"use client"

import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, Eye, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface CodePreviewProps {
  htmlContent?: string
  consoleOutput?: string[]
  isLoading?: boolean
  onRefresh?: () => void
}

function CodePreview({ htmlContent = "", consoleOutput = [], isLoading = false, onRefresh }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("preview")
  const [iframeKey, setIframeKey] = useState<number>(0)

  // تحديث الـ iframe عند تغيير المحتوى
  useEffect(() => {
    setIframeKey((prev) => prev + 1)
  }, [htmlContent])

  return (
    <Card className="w-full border shadow-md">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            معاينة الكود
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="flex items-center">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/40">
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            المعاينة
          </TabsTrigger>
          <TabsTrigger value="console" className="flex items-center">
            <Terminal className="h-4 w-4 mr-2" />
            وحدة التحكم
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="m-0 p-0">
          <CardContent className="p-0 h-[400px] bg-white">
            {htmlContent ? (
              <iframe
                key={iframeKey}
                srcDoc={htmlContent}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                title="معاينة الكود"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">لا توجد معاينة متاحة</div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="console" className="m-0 p-0">
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] w-full bg-black text-white font-mono text-sm p-4">
              {consoleOutput.length > 0 ? (
                consoleOutput.map((line, index) => (
                  <div key={index} className="py-1">
                    <span className="text-gray-400">{">"}</span> {line}
                  </div>
                ))
              ) : (
                <div className="py-2 text-gray-400">وحدة التحكم فارغة</div>
              )}
            </ScrollArea>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

export default memo(CodePreview)

