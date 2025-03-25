import JSZip from "jszip"
import FileSaver from "file-saver"

/**
 * تصدير التطبيق كملف ZIP
 */
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

/**
 * تحويل التطبيق إلى كائن Blob
 */
export async function applicationToBlob(
  files: Record<string, string>,
  options: {
    includeDefaults?: boolean
  } = {},
): Promise<Blob> {
  const { includeDefaults = true } = options

  try {
    const zip = new JSZip()

    // إضافة الملفات إلى الـ ZIP
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content)
    }

    // إضافة الملفات الافتراضية إذا كانت مطلوبة
    if (includeDefaults) {
      // نفس المنطق السابق لإضافة الملفات الافتراضية
      // ...
    }

    // إنشاء كائن Blob
    return await zip.generateAsync({ type: "blob" })
  } catch (error) {
    console.error("Error converting application to blob:", error)
    throw new Error(`فشل في تحويل التطبيق إلى Blob: ${error.message}`)
  }
}

