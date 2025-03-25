"use client"

import { useState, useCallback, Suspense, lazy, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Download, Play, FileCode, Loader2, Code, Settings, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RealtimeGenerator } from "@/components/code-generator/realtime-generator"
import { getProjectById } from "@/lib/project-storage"

// استخدام التحميل المتأخر للمكونات الثقيلة
const IntegratedEditor = lazy(() => import("@/components/code-editor/integrated-editor"))
const CodePreview = lazy(() => import("@/components/code-editor/code-preview"))

// نموذج HTML أساسي
const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>معاينة الكود</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    direction: rtl;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  h1 {
    color: #333;
  }
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
</style>
</head>
<body>
<div class="container">
  <h1>مرحباً بالعالم!</h1>
  <p>هذا هو المحتوى الافتراضي للمعاينة.</p>
  <button id="myButton">انقر هنا</button>
</div>

<script>
  document.getElementById('myButton').addEventListener('click', function() {
    alert('تم النقر على الزر!');
  });
</script>
</body>
</html>`

// نموذج React أساسي
const DEFAULT_REACT = `import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
const [count, setCount] = useState(0);

return (
  <div className="container">
    <h1>تطبيق React</h1>
    <p>عدد النقرات: {count}</p>
    <button onClick={() => setCount(count + 1)}>
      زيادة العدد
    </button>
  </div>
);
}

ReactDOM.render(<App />, document.getElementById('root'));`

// مكون التحميل
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-[600px] w-full border rounded-md bg-muted/20">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">جاري تحميل المحرر...</p>
      </div>
    </div>
  )
}

// تحويل الملفات المولدة إلى تنسيق المحرر
function convertFilesToEditorFormat(files: Record<string, string>) {
  return Object.entries(files).map(([path, content], index) => {
    // استخراج اسم الملف من المسار
    const fileName = path.split("/").pop() || `file-${index}.txt`

    // تحديد لغة الملف بناءً على الامتداد
    let language = "text"
    if (fileName.endsWith(".js")) language = "javascript"
    else if (fileName.endsWith(".jsx")) language = "javascript"
    else if (fileName.endsWith(".ts")) language = "typescript"
    else if (fileName.endsWith(".tsx")) language = "typescript"
    else if (fileName.endsWith(".html")) language = "html"
    else if (fileName.endsWith(".css")) language = "css"
    else if (fileName.endsWith(".json")) language = "json"
    else if (fileName.endsWith(".md")) language = "markdown"

    return {
      id: `generated-${index}`,
      name: fileName,
      language,
      content,
    }
  })
}

// تحديد ما إذا كان الملف هو HTML
function isHtmlFile(file: { name: string; content: string }) {
  return file.name.endsWith(".html") || file.content.includes("<!DOCTYPE html>") || file.content.includes("<html")
}

export default function EditorPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [activeTab, setActiveTab] = useState("editor")
  const [files, setFiles] = useState([
    { id: "1", name: "index.html", language: "html", content: DEFAULT_HTML },
    { id: "2", name: "app.jsx", language: "javascript", content: DEFAULT_REACT },
  ])
  const [htmlPreview, setHtmlPreview] = useState(DEFAULT_HTML)
  const [consoleOutput, setConsoleOutput] = useState([
    "مرحباً بك في محرر الأكواد المتكامل",
    "يمكنك كتابة وتنفيذ الكود هنا",
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [requirements, setRequirements] = useState({
    name: "تطبيق جديد",
    description: "تطبيق ويب تفاعلي",
    type: "dashboard",
    features: ["authentication", "dashboard"],
    database: "none",
  })
  const { toast } = useToast()

  // تحميل بيانات المشروع إذا تم تمرير معرف المشروع
  useEffect(() => {
    if (projectId) {
      const project = getProjectById(projectId)
      if (project) {
        // تحديث المتطلبات
        setRequirements(project.requirements)

        // تحويل ملفات المشروع إلى تنسيق المحرر
        if (project.files && Object.keys(project.files).length > 0) {
          const projectFiles = convertFilesToEditorFormat(project.files)
          setFiles(projectFiles)

          // البحث عن ملف HTML لعرضه في المعاينة
          const htmlFile = projectFiles.find(isHtmlFile)
          if (htmlFile) {
            setHtmlPreview(htmlFile.content)
          }

          toast({
            title: "تم تحميل المشروع",
            description: `تم تحميل المشروع "${project.name}" بنجاح`,
          })
        }
      }
    }
  }, [projectId, toast])

  const handleSaveFiles = useCallback(
    (updatedFiles) => {
      setFiles(updatedFiles)
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الملفات بنجاح",
      })
    },
    [toast],
  )

  const handleRunCode = useCallback((file) => {
    setIsLoading(true)

    // محاكاة تنفيذ الكود
    setTimeout(() => {
      if (isHtmlFile(file)) {
        setHtmlPreview(file.content)
        setConsoleOutput((prev) => [...prev, `تم تنفيذ ${file.name} بنجاح`])
      } else {
        // في حالة JavaScript/TypeScript، نضيف فقط إلى وحدة التحكم
        setConsoleOutput((prev) => [
          ...prev,
          `تم تنفيذ ${file.name} بنجاح`,
          `نتيجة التنفيذ: ${Math.random() > 0.5 ? "نجاح" : "هناك بعض التحذيرات"}`,
        ])
      }

      setIsLoading(false)
    }, 500) // تقليل وقت المحاكاة
  }, [])

  const handleRefreshPreview = useCallback(() => {
    setIsLoading(true)

    // البحث عن ملف HTML لعرضه
    const htmlFile = files.find(isHtmlFile)
    if (htmlFile) {
      setHtmlPreview(htmlFile.content)
    }

    setConsoleOutput((prev) => [...prev, "تم تحديث المعاينة"])

    setTimeout(() => {
      setIsLoading(false)
    }, 300) // تقليل وقت المحاكاة
  }, [files])

  // معالجة الكود المولد
  const handleCodeGenerated = useCallback(
    (generatedFiles: Record<string, string>) => {
      // تحويل الملفات المولدة إلى تنسيق المحرر
      const newFiles = convertFilesToEditorFormat(generatedFiles)

      // دمج الملفات الجديدة مع الملفات الحالية (استبدال الملفات ذات الأسماء المتطابقة)
      const mergedFiles = [...files]

      newFiles.forEach((newFile) => {
        const existingFileIndex = mergedFiles.findIndex((f) => f.name === newFile.name)
        if (existingFileIndex >= 0) {
          // استبدال الملف الموجود
          mergedFiles[existingFileIndex] = newFile
        } else {
          // إضافة ملف جديد
          mergedFiles.push(newFile)
        }
      })

      setFiles(mergedFiles)

      // البحث عن ملف HTML لعرضه في المعاينة
      const htmlFile = newFiles.find(isHtmlFile)
      if (htmlFile) {
        setHtmlPreview(htmlFile.content)
      }

      // التبديل إلى علامة تبويب المحرر
      setActiveTab("editor")

      toast({
        title: "تم توليد الكود",
        description: `تم توليد ${newFiles.length} ملفات وإضافتها إلى المحرر`,
      })
    },
    [files, toast],
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">العودة</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <FileCode className="h-6 w-6" />
          <span className="font-semibold">محرر الأكواد المتكامل</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handleRefreshPreview} disabled={isLoading}>
            <Play className="mr-2 h-4 w-4" />
            تشغيل
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            تصدير
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            حفظ المشروع
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="editor" className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              المحرر
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              توليد الكود
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Suspense fallback={<LoadingFallback />}>
                  <IntegratedEditor
                    initialFiles={files}
                    onSave={handleSaveFiles}
                    onRun={handleRunCode}
                    height="600px"
                  />
                </Suspense>
              </div>
              <div>
                <Suspense fallback={<LoadingFallback />}>
                  <CodePreview
                    htmlContent={htmlPreview}
                    consoleOutput={consoleOutput}
                    isLoading={isLoading}
                    onRefresh={handleRefreshPreview}
                  />
                </Suspense>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generator" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <RealtimeGenerator onCodeGenerated={handleCodeGenerated} requirements={requirements} stage="frontend" />
              </div>
              <div>
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">متطلبات المشروع</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">اسم المشروع:</p>
                      <p className="text-sm text-muted-foreground">{requirements.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">الوصف:</p>
                      <p className="text-sm text-muted-foreground">{requirements.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">النوع:</p>
                      <p className="text-sm text-muted-foreground">{requirements.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">الميزات:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {requirements.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium">قاعدة البيانات:</p>
                      <p className="text-sm text-muted-foreground">{requirements.database}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">إعدادات المحرر</h3>
              <p className="text-muted-foreground">
                قريبًا: ستتمكن من تخصيص إعدادات المحرر هنا، مثل حجم الخط والسمة وغيرها من الخيارات.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

