import { parseGeneratedCode } from "./generate-application"

export interface CodeGenerationOptions {
  stage: string
  requirements: {
    name: string
    description: string
    type: string
    features: string[]
    database: string
  }
  streaming?: boolean
  onProgress?: (chunk: string) => void
}

export interface CodeGenerationResult {
  text: string
  files: Record<string, string>
}

/**
 * توليد الكود باستخدام AI SDK
 */
export async function generateCodeWithAI({
  stage,
  requirements,
  streaming = false,
  onProgress,
}: CodeGenerationOptions): Promise<CodeGenerationResult> {
  const prompt = getPromptForStage(stage, requirements)

  try {
    if (streaming && onProgress) {
      // Para streaming, usamos una implementación manual
      let fullText = ""
      let partialFiles: Record<string, string> = {}
      let lastParseTime = Date.now()
      const PARSE_INTERVAL = 1000 // Parse every second

      // Llamada a la API de OpenAI directamente para streaming
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                'أنت مطور محترف يقوم بإنشاء تطبيقات Next.js. قم بإنشاء كود عالي الجودة وقابل للتنفيذ مباشرة. استخدم الصيغة ```[نوع الملف] file="[مسار الملف الكامل]" لكل ملف تقوم بإنشائه.',
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Response body is not readable")

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        if (value) {
          const chunk = decoder.decode(value, { stream: true })

          // Procesar el chunk para extraer el texto
          const lines = chunk.split("\n").filter((line) => line.trim() !== "")
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue

              try {
                const json = JSON.parse(data)
                const content = json.choices[0]?.delta?.content || ""
                if (content) {
                  fullText += content
                  onProgress(content)

                  // Intentar analizar los archivos periódicamente
                  const now = Date.now()
                  if (now - lastParseTime > PARSE_INTERVAL) {
                    lastParseTime = now
                    try {
                      const currentFiles = parseGeneratedCode(fullText)
                      partialFiles = { ...partialFiles, ...currentFiles }
                    } catch (e) {
                      // Ignorar errores de análisis durante la generación
                      console.log("Error parsing partial content:", e)
                    }
                  }
                }
              } catch (e) {
                // Ignorar errores de JSON
              }
            }
          }
        }
      }

      // Analizar el código generado final para extraer archivos
      const files = parseGeneratedCode(fullText)

      return {
        text: fullText,
        files: { ...partialFiles, ...files },
      }
    } else {
      // Para generación no streaming, usamos una llamada simple
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                'أنت مطور محترف يقوم بإنشاء تطبيقات Next.js. قم بإنشاء كود عالي الجودة وقابل للتنفيذ مباشرة. استخدم الصيغة ```[نوع الملف] file="[مسار الملف الكامل]" لكل ملف تقوم بإنشائه.',
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const text = data.choices[0]?.message?.content || ""

      // Analizar el código generado para extraer archivos
      const files = parseGeneratedCode(text)

      return {
        text,
        files,
      }
    }
  } catch (error) {
    console.error("Error generating code with AI:", error)
    throw new Error(`فشل في توليد الكود للمرحلة ${stage}: ${error.message}`)
  }
}

/**
 * دالة مساعدة لإنشاء المطالبة المناسبة لكل مرحلة
 */
function getPromptForStage(stage: string, requirements: any): string {
  const { name, description, type, features, database } = requirements

  switch (stage) {
    case "requirements":
      return `قم بتحليل المتطلبات التالية لتطبيق ${name}:
      - نوع التطبيق: ${type}
      - الوصف: ${description}
      - الميزات المطلوبة: ${features.join(", ")}
      - قاعدة البيانات: ${database}
      
      قم بإنشاء ملخص للمتطلبات وتحديد الخطوات اللازمة لتنفيذ هذا التطبيق. قدم النتيجة بتنسيق نصي واضح.
      
      ملاحظة مهمة: قم بتضمين أسماء الملفات الدقيقة والكاملة لكل ملف ستقوم بإنشائه، واستخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      `

    case "structure":
      return `قم بإنشاء هيكل مشروع Next.js لتطبيق ${name} بناءً على المتطلبات التالية:
      - نوع التطبيق: ${type}
      - الوصف: ${description}
      - الميزات المطلوبة: ${features.join(", ")}
      - قاعدة البيانات: ${database}
      
      قم بإنشاء هيكل المجلدات والملفات الرئيسية للمشروع. قدم النتيجة بتنسيق نصي واضح يوضح هيكل المجلدات والملفات.
      
      ملاحظة مهمة: قم بإنشاء ملفات حقيقية وكاملة، وليس مجرد وصف للهيكل. استخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات الأساسية:
      - app/layout.tsx (التخطيط الرئيسي)
      - app/page.tsx (الصفحة الرئيسية)
      - app/globals.css (ملف CSS العام)
      - tsconfig.json (إعدادات TypeScript)
      - tailwind.config.js (إعدادات Tailwind CSS)
      - package.json (تبعيات المشروع)
      `

    case "frontend":
      return `قم بإنشاء مكونات واجهة المستخدم الرئيسية لتطبيق ${name} بناءً على المتطلبات التالية:
      - نوع التطبيق: ${type}
      - الوصف: ${description}
      - الميزات المطلوبة: ${features.join(", ")}
      
      قم بإنشاء كود React/Next.js للصفحة الرئيسية ولوحة التحكم وأي صفحات أخرى مطلوبة. استخدم Tailwind CSS للتنسيق واجعل التصميم متجاوبًا.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`tsx file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات على الأقل:
      - app/page.tsx (الصفحة الرئيسية)
      - app/dashboard/page.tsx (لوحة التحكم)
      - components/ui/button.tsx (مكون الزر)
      - components/ui/card.tsx (مكون البطاقة)
      `

    case "backend":
      return `قم بإنشاء خدمات الخلفية الرئيسية لتطبيق ${name} بناءً على المتطلبات التالية:
      - نوع التطبيق: ${type}
      - الميزات المطلوبة: ${features.join(", ")}
      - قاعدة البيانات: ${database}
      
      قم بإنشاء نقاط نهاية API باستخدام Next.js API Routes. قم بتضمين التعامل مع قاعدة البيانات إذا كان ذلك مطلوبًا.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`tsx file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات على الأقل:
      - app/api/[endpoint]/route.ts (نقاط نهاية API)
      - lib/db.ts (اتصال قاعدة البيانات)
      - config/database.js (إعدادات قاعدة البيانات)
      `

    case "finalization":
      return `قم بإنشاء ملف README.md لتطبيق ${name} يشرح كيفية تثبيت وتشغيل التطبيق، بالإضافة إلى وصف الميزات الرئيسية.
      قم أيضًا بإنشاء ملف تكوين لقاعدة البيانات وأي ملفات تكوين أخرى مطلوبة.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات على الأقل:
      - README.md (توثيق المشروع)
      - .env.example (مثال لملف البيئة)
      - next.config.js (إعدادات Next.js)
      `

    default:
      return `قم بإنشاء كود لتطبيق ${name} بناءً على المتطلبات المحددة.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      `
  }
}

