"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Code, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { generateCodeWithAI, type CodeGenerationOptions } from "@/lib/ai-code-generation"
import { useToast } from "@/components/ui/use-toast"

export interface RealtimeGeneratorProps {
  onCodeGenerated: (files: Record<string, string>) => void
  requirements: {
    name: string
    description: string
    type: string
    features: string[]
    database: string
  }
  stage?: string
}

export function RealtimeGenerator({ onCodeGenerated, requirements, stage = "frontend" }: RealtimeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingOutput, setStreamingOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({})
  const streamingOutputRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // تمرير إلى نهاية مخرجات التوليد عند تحديثها
  useEffect(() => {
    if (streamingOutputRef.current) {
      streamingOutputRef.current.scrollTop = streamingOutputRef.current.scrollHeight
    }
  }, [streamingOutput])

  const handleGenerateCode = async () => {
    setIsGenerating(true)
    setError(null)
    setStreamingOutput("")
    setProgress(0)

    try {
      // إضافة رسالة بدء التوليد إلى مخرجات التوليد
      setStreamingOutput((prev) => prev + `--- بدء توليد الكود لمرحلة ${stage} ---\n\n`)

      // إعداد خيارات توليد الكود
      const options: CodeGenerationOptions = {
        stage,
        requirements,
        streaming: true,
        onProgress: (chunk) => {
          setStreamingOutput((prev) => prev + chunk)
          // تحديث نسبة التقدم بناءً على طول المخرجات
          setProgress((prev) => Math.min(prev + 1, 95))
        },
      }

      // استدعاء وظيفة توليد الكود
      const result = await generateCodeWithAI(options)

      // تحديث الملفات المولدة
      setGeneratedFiles(result.files)

      // إرسال الملفات المولدة إلى المكون الأب
      onCodeGenerated(result.files)

      // إضافة رسالة اكتمال التوليد
      setStreamingOutput((prev) => prev + `\n\n--- اكتمل توليد الكود بنجاح ---\n`)

      setProgress(100)

      toast({
        title: "تم توليد الكود بنجاح",
        description: `تم توليد ${Object.keys(result.files).length} ملفات`,
      })
    } catch (error) {
      console.error("Error generating code:", error)
      setError(`حدث خطأ أثناء توليد الكود: ${error.message}`)

      toast({
        variant: "destructive",
        title: "فشل في توليد الكود",
        description: "حدث خطأ أثناء توليد الكود. يرجى المحاولة مرة أخرى.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="mr-2 h-5 w-5" />
          توليد الكود في الوقت الفعلي
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isGenerating && !streamingOutput && (
          <div className="text-center p-4">
            <p className="text-muted-foreground mb-4">
              اضغط على زر "توليد الكود" لبدء عملية توليد الكود باستخدام الذكاء الاصطناعي.
            </p>
          </div>
        )}

        {(isGenerating || streamingOutput) && (
          <>
            <div className="w-full bg-muted h-2 rounded-full mb-4 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="border rounded-md">
              <div className="bg-muted p-2 border-b flex justify-between items-center">
                <div className="text-sm font-medium">مخرجات التوليد</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      جاري التوليد...
                    </>
                  ) : progress === 100 ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      اكتمل التوليد
                    </>
                  ) : (
                    "توقف التوليد"
                  )}
                </div>
              </div>
              <ScrollArea className="h-[300px] w-full" ref={streamingOutputRef}>
                <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                  {streamingOutput || "انتظار بدء التوليد..."}
                </pre>
              </ScrollArea>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {progress === 100 && !error && (
              <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  تم توليد الكود بنجاح! تم إنشاء {Object.keys(generatedFiles).length} ملفات.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {Object.keys(generatedFiles).length > 0 && <>تم توليد {Object.keys(generatedFiles).length} ملفات</>}
        </div>
        <Button onClick={handleGenerateCode} disabled={isGenerating} className="flex items-center">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Code className="mr-2 h-4 w-4" />
              توليد الكود
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

