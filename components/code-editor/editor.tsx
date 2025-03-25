"use client"

import { useRef, useState, useEffect, memo } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// استخدام dynamic import لتحميل Monaco Editor بشكل متأخر وبدون SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[200px] bg-muted/20">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
})

export interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  height?: string | number
  readOnly?: boolean
  theme?: "vs-dark" | "light"
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
]

export const CodeEditor = memo(function CodeEditor({
  value,
  onChange,
  language = "typescript",
  height = "500px",
  readOnly = false,
  theme = "vs-dark",
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setIsEditorReady(true)
    setIsLoading(false)

    // تكوين المحرر
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      minimap: { enabled: false }, // تعطيل الخريطة المصغرة لتحسين الأداء
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on",
      lineNumbers: "on",
      glyphMargin: false, // تعطيل هامش الرموز لتحسين الأداء
      folding: true,
      lineDecorationsWidth: 10,
      renderLineHighlight: "all",
    })

    // إضافة اختصارات لوحة المفاتيح
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // حفظ الكود
      console.log("Saving code...")
    })
  }

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
  }

  useEffect(() => {
    if (editorRef.current) {
      // يمكن إضافة منطق إضافي هنا عند تغيير اللغة
    }
  }, [selectedLanguage])

  // تحسين الأداء: تقليل عدد عمليات إعادة الرسم
  const editorOptions = {
    readOnly,
    domReadOnly: readOnly,
    contextmenu: !readOnly,
  }

  return (
    <div className="flex flex-col w-full h-full border rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-muted">
        <Select value={selectedLanguage} onValueChange={handleLanguageChange} disabled={readOnly}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="اختر اللغة" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-xs">جاري التحميل...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <MonacoEditor
          height={height}
          language={selectedLanguage}
          value={value}
          theme={theme}
          onChange={(value) => onChange?.(value || "")}
          onMount={handleEditorDidMount}
          options={editorOptions}
        />
      </div>
    </div>
  )
})

