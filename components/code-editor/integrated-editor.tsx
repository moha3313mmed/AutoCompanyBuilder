"use client"

import dynamic from "next/dynamic"
import { useState, useCallback } from "react"
import { Save, Play, Download, Copy, Trash2, FileCode, Settings, Undo, Redo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

// استخدام dynamic import لتحميل مكون المحرر بشكل متأخر وبدون SSR
const CodeEditor = dynamic(() => import("./editor").then((mod) => mod.CodeEditor), { ssr: false })

export interface FileTab {
  id: string
  name: string
  language: string
  content: string
}

export interface IntegratedEditorProps {
  initialFiles?: FileTab[]
  onSave?: (files: FileTab[]) => void
  onRun?: (activeFile: FileTab) => void
  readOnly?: boolean
  height?: string | number
  theme?: "vs-dark" | "light"
}

function IntegratedEditor({
  initialFiles = [],
  onSave,
  onRun,
  readOnly = false,
  height = "500px",
  theme = "vs-dark",
}: IntegratedEditorProps) {
  const [files, setFiles] = useState<FileTab[]>(
    initialFiles.length > 0
      ? initialFiles
      : [{ id: "1", name: "index.tsx", language: "typescript", content: "// أكتب الكود هنا" }],
  )
  const [activeTabId, setActiveTabId] = useState<string>(files[0]?.id || "1")
  const { toast } = useToast()

  const activeFile = files.find((file) => file.id === activeTabId) || files[0]

  const handleCodeChange = useCallback(
    (value: string) => {
      setFiles((prev) => prev.map((file) => (file.id === activeTabId ? { ...file, content: value } : file)))
    },
    [activeTabId],
  )

  const handleSave = useCallback(() => {
    onSave?.(files)
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الملفات بنجاح",
    })
  }, [files, onSave, toast])

  const handleRun = useCallback(() => {
    if (activeFile) {
      onRun?.(activeFile)
      toast({
        title: "جاري التنفيذ",
        description: `جاري تنفيذ الملف ${activeFile.name}`,
      })
    }
  }, [activeFile, onRun, toast])

  const handleCopyCode = useCallback(() => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content)
      toast({
        title: "تم النسخ",
        description: "تم نسخ الكود إلى الحافظة",
      })
    }
  }, [activeFile, toast])

  const handleDownload = useCallback(() => {
    if (activeFile) {
      const blob = new Blob([activeFile.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = activeFile.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "تم التنزيل",
        description: `تم تنزيل الملف ${activeFile.name}`,
      })
    }
  }, [activeFile, toast])

  const addNewFile = useCallback(() => {
    const newId = String(Date.now())
    const newFile: FileTab = {
      id: newId,
      name: `file-${files.length + 1}.tsx`,
      language: "typescript",
      content: "// أكتب الكود هنا",
    }

    setFiles((prev) => [...prev, newFile])
    setActiveTabId(newId)
  }, [files.length])

  const removeFile = useCallback(
    (id: string) => {
      if (files.length <= 1) {
        toast({
          title: "تنبيه",
          description: "لا يمكن حذف الملف الوحيد",
          variant: "destructive",
        })
        return
      }

      setFiles((prev) => {
        const newFiles = prev.filter((file) => file.id !== id)
        // إذا كان الملف المحذوف هو النشط، قم بتعيين الملف الأول كنشط
        if (id === activeTabId) {
          setActiveTabId(newFiles[0].id)
        }
        return newFiles
      })
    },
    [files.length, activeTabId, toast],
  )

  return (
    <Card className="w-full border shadow-md">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <FileCode className="mr-2 h-5 w-5" />
            محرر الأكواد
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleSave} disabled={readOnly}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>حفظ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleRun}>
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تشغيل</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>نسخ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تنزيل</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col">
          <Tabs value={activeTabId} onValueChange={setActiveTabId} className="w-full">
            <div className="flex items-center border-b bg-muted/40">
              <TabsList className="h-10 bg-transparent">
                {files.map((file) => (
                  <TabsTrigger
                    key={file.id}
                    value={file.id}
                    className="relative h-9 rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    <span className="mr-1">{file.name}</span>
                    {files.length > 1 && !readOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(file.id)
                        }}
                        className="ml-2 rounded-full p-1 hover:bg-muted"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {!readOnly && (
                <Button variant="ghost" size="sm" onClick={addNewFile} className="ml-auto mr-2">
                  + ملف جديد
                </Button>
              )}
            </div>

            {files.map((file) => (
              <TabsContent key={file.id} value={file.id} className="m-0 p-0">
                <CodeEditor
                  value={file.content}
                  onChange={handleCodeChange}
                  language={file.language}
                  height={height}
                  readOnly={readOnly}
                  theme={theme}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-2 border-t bg-muted/40">
        <div className="text-xs text-muted-foreground">
          {activeFile ? `${activeFile.name} - ${activeFile.language}` : "لا يوجد ملف نشط"}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Undo className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Redo className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default IntegratedEditor

