import JSZip from "jszip"
import FileSaver from "file-saver"

// هيكل لتخزين الملفات المولدة
export interface GeneratedFile {
  path: string
  content: string
}

// هيكل لتخزين نتائج التوليد
export interface GenerationResult {
  files: GeneratedFile[]
  summary: string
}

// دالة لتوليد التطبيق باستخدام نموذج GPT-4o عبر API
export async function generateApplication(stage: string, requirements: any): Promise<string> {
  try {
    // استدعاء API الخاص بنا بدلاً من استدعاء OpenAI مباشرة
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stage, requirements }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return data.text
  } catch (error) {
    console.error(`Error generating application for stage ${stage}:`, error)
    throw new Error(`فشل في توليد الكود للمرحلة ${stage}`)
  }
}

// دالة لتصدير التطبيق كملف ZIP
export async function exportApplicationAsZip(
  files: Record<string, string>,
  options: {
    filename?: string
    includeDefaults?: boolean
  } = {},
): Promise<void> {
  const { filename = "generated-application.zip", includeDefaults = true } = options

  try {
    const zip = new JSZip()

    // إضافة الملفات إلى الـ ZIP
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content)
    }

    // إضافة الملفات الافتراضية إذا كانت مطلوبة
    if (includeDefaults) {
      // إضافة ملف package.json إذا لم يكن موجودًا
      if (!files["package.json"]) {
        zip.file(
          "package.json",
          JSON.stringify(
            {
              name: "generated-app",
              version: "0.1.0",
              private: true,
              scripts: {
                dev: "next dev",
                build: "next build",
                start: "next start",
                lint: "next lint",
              },
              dependencies: {
                next: "^14.0.0",
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                tailwindcss: "^3.3.0",
                "@radix-ui/react-icons": "^1.3.0",
                "class-variance-authority": "^0.7.0",
                clsx: "^2.0.0",
                "lucide-react": "^0.294.0",
                "tailwind-merge": "^2.1.0",
                "tailwindcss-animate": "^1.0.7",
              },
              devDependencies: {
                "@types/node": "^20.10.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0",
                autoprefixer: "^10.4.16",
                eslint: "^8.54.0",
                "eslint-config-next": "^14.0.0",
                postcss: "^8.4.31",
                typescript: "^5.3.2",
              },
            },
            null,
            2,
          ),
        )
      }

      // إضافة ملف README.md إذا لم يكن موجودًا
      if (!files["README.md"]) {
        zip.file(
          "README.md",
          `# Generated Application

This application was generated using AI.

## Getting Started

First, run the development server:

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
`,
        )
      }

      // إضافة ملف .gitignore إذا لم يكن موجودًا
      if (!files[".gitignore"]) {
        zip.file(
          ".gitignore",
          `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`,
        )
      }
    }

    // إنشاء وتنزيل الملف
    const blob = await zip.generateAsync({ type: "blob" })
    FileSaver.saveAs(blob, filename)

    return Promise.resolve()
  } catch (error) {
    console.error("Error exporting application:", error)
    throw new Error(`فشل في تصدير التطبيق: ${error.message}`)
  }
}

// دالة محسنة لتحليل الكود المولد واستخراج الملفات
export function parseGeneratedCode(code: string): Record<string, string> {
  const files: Record<string, string> = {}

  // 1. البحث عن أنماط الملفات المحددة بوضوح مع اسم الملف
  // مثال: ```tsx file="app/page.tsx"
  const fileRegex =
    /```(?:jsx|tsx|javascript|typescript|js|ts|css|json|md|html|env)?\s*file=["']([^"']+)["']\s*\n([\s\S]*?)```/g

  let match
  while ((match = fileRegex.exec(code)) !== null) {
    const filePath = match[1].trim()
    const fileContent = match[2].trim()

    if (filePath && fileContent) {
      files[filePath] = fileContent
    }
  }

  // 2. البحث عن أنماط الملفات بدون علامة اللغة
  // مثال: ```file="app/page.tsx"
  const simpleFileRegex = /```\s*file=["']([^"']+)["']\s*\n([\s\S]*?)```/g
  while ((match = simpleFileRegex.exec(code)) !== null) {
    const filePath = match[1].trim()
    const fileContent = match[2].trim()

    if (filePath && fileContent && !files[filePath]) {
      files[filePath] = fileContent
    }
  }

  // 3. البحث عن أنماط الملفات المضمنة في النص
  // مثال: file="app/page.tsx" ثم محتوى الملف
  const embeddedFileRegex = /file=["']([^"']+)["']\s*\n([\s\S]*?)(?=file=["']|```|$)/g
  while ((match = embeddedFileRegex.exec(code)) !== null) {
    const filePath = match[1].trim()
    const fileContent = match[2].trim()

    if (filePath && fileContent && !files[filePath]) {
      files[filePath] = fileContent
    }
  }

  // 4. البحث عن أسماء الملفات في التعليقات
  // مثال: // app/page.tsx
  const commentFileRegex =
    /\/\/\s*([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)\s*\n([\s\S]*?)(?=\/\/\s*[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+|```|$)/g
  while ((match = commentFileRegex.exec(code)) !== null) {
    const filePath = match[1].trim()
    const fileContent = match[2].trim()

    if (filePath && fileContent && !files[filePath]) {
      files[filePath] = fileContent
    }
  }

  // 5. البحث عن أنماط الملفات في مرحلة التحسين والتشطيب
  // مثال: ```md file="README.md"
  if (code.includes("README.md") && !files["README.md"]) {
    const readmeRegex = /```md\s*(?:file=["']README\.md["'])?\s*\n([\s\S]*?)```/
    const readmeMatch = code.match(readmeRegex)
    if (readmeMatch) {
      files["README.md"] = readmeMatch[1].trim()
    }
  }

  if (code.includes(".env.example") && !files[".env.example"]) {
    const envRegex = /```(?:env)?\s*(?:file=['"]\\.env\.example['"])?\s*\n([\s\S]*?)```/
    const envMatch = code.match(envRegex)
    if (envMatch) {
      files[".env.example"] = envMatch[1].trim()
    }
  }

  if (code.includes("next.config.js") && !files["next.config.js"]) {
    const configRegex = /```(?:js)?\s*(?:file=['"]next\.config\.js['"])?\s*\n([\s\S]*?)```/
    const configMatch = code.match(configRegex)
    if (configMatch) {
      files["next.config.js"] = configMatch[1].trim()
    }
  }

  // 6. تحليل محتوى النص للعثور على أسماء الملفات المحتملة
  if (Object.keys(files).length === 0) {
    // البحث عن أنماط مثل "ملف README.md" أو "ملف .env.example"
    const fileNameRegex = /(?:ملف|file)\s+([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/g
    const fileNames = []
    while ((match = fileNameRegex.exec(code)) !== null) {
      fileNames.push(match[1].trim())
    }

    // تقسيم النص إلى أقسام بناءً على أسماء الملفات المكتشفة
    if (fileNames.length > 0) {
      for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i]
        const nextFileName = fileNames[i + 1]

        let content
        if (nextFileName) {
          const startIdx = code.indexOf(fileName) + fileName.length
          const endIdx = code.indexOf(nextFileName)
          content = code.substring(startIdx, endIdx).trim()
        } else {
          const startIdx = code.indexOf(fileName) + fileName.length
          content = code.substring(startIdx).trim()
        }

        if (content && !files[fileName]) {
          files[fileName] = content
        }
      }
    }
  }

  // 7. إذا لم يتم العثور على أي ملفات، احفظ الكود كاملاً في ملف واحد
  if (Object.keys(files).length === 0) {
    // محاولة تحديد نوع المحتوى
    if (
      code.includes("import React") ||
      code.includes("import { useState }") ||
      code.includes("export default function")
    ) {
      files["app/page.tsx"] = code
    } else if (code.includes("const express = require")) {
      files["server.js"] = code
    } else if (code.includes("<html>") || code.includes("<!DOCTYPE html>")) {
      files["index.html"] = code
    } else if (code.includes("# ") && (code.includes("## ") || code.includes("### "))) {
      files["README.md"] = code
    } else {
      files["generated_code.txt"] = code
    }
  }

  // 8. تحسين أسماء الملفات المولدة
  const finalFiles: Record<string, string> = {}
  Object.entries(files).forEach(([path, content]) => {
    // إذا كان اسم الملف يبدأ بـ "generated_file_"، حاول تحسينه
    if (path.startsWith("generated_file_")) {
      // تحديد نوع الملف بناءً على المحتوى
      if (content.includes("# ") && (content.includes("## ") || content.includes("### "))) {
        finalFiles["README.md"] = content
      } else if (content.includes("DB_HOST") && content.includes("DB_USER")) {
        finalFiles[".env.example"] = content
      } else if (content.includes("module.exports") && content.includes("nextConfig")) {
        finalFiles["next.config.js"] = content
      } else if (content.includes("@tailwind") || content.includes("tailwind")) {
        finalFiles["tailwind.config.js"] = content
      } else if (content.includes('"scripts"') && content.includes('"dependencies"')) {
        finalFiles["package.json"] = content
      } else {
        // استخدام الاسم الأصلي إذا لم نتمكن من تحديد نوع أفضل
        finalFiles[path] = content
      }
    } else {
      finalFiles[path] = content
    }
  })

  return finalFiles
}

