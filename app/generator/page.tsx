"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Code, Download, FileCode, Loader2, Save, Terminal } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { exportApplicationAsZip } from "@/lib/generate-application"
import { generateCodeWithAI } from "@/lib/ai-code-generation"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

const GENERATION_STAGES = [
  { id: "requirements", name: "تحليل المتطلبات", percentage: 10 },
  { id: "structure", name: "هيكلة التطبيق", percentage: 30 },
  { id: "frontend", name: "واجهة المستخدم", percentage: 60 },
  { id: "backend", name: "خدمات الخلفية", percentage: 80 },
  { id: "finalization", name: "التشطيب والتحسين", percentage: 100 },
]

export default function Generator() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("requirements")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({})
  const [parsedFiles, setParsedFiles] = useState<Record<string, Record<string, string>>>({})
  const [appRequirements, setAppRequirements] = useState({
    name: "",
    description: "",
    type: "dashboard",
    features: [],
    database: "none",
  })
  const [error, setError] = useState<string | null>(null)
  const [streamingOutput, setStreamingOutput] = useState<string>("")
  const streamingOutputRef = useRef<HTMLDivElement>(null)

  // تمرير إلى نهاية مخرجات التوليد عند تحديثها
  useEffect(() => {
    if (streamingOutputRef.current) {
      streamingOutputRef.current.scrollTop = streamingOutputRef.current.scrollHeight
    }
  }, [streamingOutput])

  const handleStartGeneration = async () => {
    setIsGenerating(true)
    setActiveTab("generation")
    setError(null)
    setStreamingOutput("")

    // توليد التطبيق عبر مراحل متعددة
    for (let i = 0; i < GENERATION_STAGES.length; i++) {
      setCurrentStage(i)
      setProgress(GENERATION_STAGES[i].percentage)

      try {
        // إضافة رسالة بدء المرحلة إلى مخرجات التوليد
        setStreamingOutput((prev) => prev + `\n\n--- بدء مرحلة ${GENERATION_STAGES[i].name} ---\n\n`)

        // استدعاء وظيفة توليد الكود مع تفعيل التدفق
        const stageResult = await generateCodeWithAI({
          stage: GENERATION_STAGES[i].id,
          requirements: appRequirements,
          streaming: true,
          onProgress: (chunk) => {
            setStreamingOutput((prev) => prev + chunk)
          },
        })

        // تحديث الكود المولد بنتائج هذه المرحلة
        setGeneratedCode((prev) => ({
          ...prev,
          [GENERATION_STAGES[i].id]: stageResult.text,
        }))

        // تحديث الملفات المستخرجة
        setParsedFiles((prev) => ({
          ...prev,
          [GENERATION_STAGES[i].id]: stageResult.files,
        }))

        // إضافة رسالة اكتمال المرحلة إلى مخرجات التوليد
        setStreamingOutput((prev) => prev + `\n\n--- اكتملت مرحلة ${GENERATION_STAGES[i].name} ---\n\n`)

        // إضافة تأخير قصير للانتقال بين المراحل
        if (i < GENERATION_STAGES.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      } catch (error) {
        console.error(`Error in stage ${GENERATION_STAGES[i].id}:`, error)
        setError(`حدث خطأ أثناء توليد المرحلة "${GENERATION_STAGES[i].name}". يرجى المحاولة مرة أخرى.`)
        setIsGenerating(false)

        toast({
          variant: "destructive",
          title: "فشل في توليد التطبيق",
          description: `حدث خطأ أثناء توليد المرحلة "${GENERATION_STAGES[i].name}".`,
          action: <ToastAction altText="حاول مرة أخرى">حاول مرة أخرى</ToastAction>,
        })

        return
      }
    }

    setIsGenerating(false)
    setActiveTab("preview")

    toast({
      title: "تم توليد التطبيق بنجاح",
      description: "يمكنك الآن معاينة الكود المولد أو تصديره كملف ZIP.",
    })
  }

  const handleExportZip = async () => {
    try {
      // تجميع جميع الملفات من جميع المراحل
      const allFiles: Record<string, string> = {}

      // دمج الملفات من جميع المراحل
      Object.values(parsedFiles).forEach((stageFiles) => {
        Object.entries(stageFiles).forEach(([path, content]) => {
          // تجنب تكرار الملفات، الملفات من المراحل اللاحقة تحل محل الملفات من المراحل السابقة
          allFiles[path] = content
        })
      })

      // تصدير التطبيق كملف ZIP
      await exportApplicationAsZip(allFiles)

      toast({
        title: "تم تصدير التطبيق بنجاح",
        description: "تم تنزيل ملف ZIP يحتوي على التطبيق المولد.",
      })
    } catch (error) {
      console.error("Error exporting application:", error)

      toast({
        variant: "destructive",
        title: "فشل في تصدير التطبيق",
        description: "حدث خطأ أثناء تصدير التطبيق. يرجى المحاولة مرة أخرى.",
        action: <ToastAction altText="حاول مرة أخرى">حاول مرة أخرى</ToastAction>,
      })
    }
  }

  const handleFeatureToggle = (feature) => {
    setAppRequirements((prev) => {
      const features = [...prev.features]
      if (features.includes(feature)) {
        return { ...prev, features: features.filter((f) => f !== feature) }
      } else {
        return { ...prev, features: [...features, feature] }
      }
    })
  }

  const handleDownloadFile = (stage, filePath, content) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filePath.split("/").pop() || "file.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
          <span className="font-semibold">مولد التطبيقات الذكي</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {activeTab === "preview" && (
            <>
              <Button variant="outline" onClick={handleExportZip}>
                <Download className="mr-2 h-4 w-4" />
                تصدير كملف ZIP
              </Button>
              <Button onClick={() => router.push("/dashboard")}>
                <Save className="mr-2 h-4 w-4" />
                حفظ المشروع
              </Button>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requirements" disabled={isGenerating}>
              متطلبات التطبيق
            </TabsTrigger>
            <TabsTrigger value="generation" disabled={!isGenerating && activeTab !== "generation"}>
              توليد التطبيق
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedCode.finalization}>
              معاينة الكود
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>تحديد متطلبات التطبيق</CardTitle>
                <CardDescription>
                  قم بتحديد متطلبات التطبيق الذي ترغب في إنشائه باستخدام الذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">اسم التطبيق</Label>
                    <Input
                      id="app-name"
                      placeholder="أدخل اسم التطبيق"
                      value={appRequirements.name}
                      onChange={(e) => setAppRequirements((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-type">نوع التطبيق</Label>
                    <Select
                      value={appRequirements.type}
                      onValueChange={(value) => setAppRequirements((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع التطبيق" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">لوحة تحكم</SelectItem>
                        <SelectItem value="ecommerce">متجر إلكتروني</SelectItem>
                        <SelectItem value="crm">إدارة علاقات العملاء</SelectItem>
                        <SelectItem value="inventory">إدارة المخزون</SelectItem>
                        <SelectItem value="blog">مدونة</SelectItem>
                        <SelectItem value="custom">مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="app-description">وصف التطبيق</Label>
                  <Textarea
                    id="app-description"
                    placeholder="اشرح بالتفصيل ما الذي يجب أن يفعله تطبيقك"
                    rows={4}
                    value={appRequirements.description}
                    onChange={(e) => setAppRequirements((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-4">
                  <Label>الميزات المطلوبة</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch
                        id="feature-auth"
                        checked={appRequirements.features.includes("authentication")}
                        onCheckedChange={() => handleFeatureToggle("authentication")}
                      />
                      <Label htmlFor="feature-auth">نظام المصادقة وإدارة المستخدمين</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch
                        id="feature-dashboard"
                        checked={appRequirements.features.includes("dashboard")}
                        onCheckedChange={() => handleFeatureToggle("dashboard")}
                      />
                      <Label htmlFor="feature-dashboard">لوحة تحكم تفاعلية</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch
                        id="feature-reports"
                        checked={appRequirements.features.includes("reports")}
                        onCheckedChange={() => handleFeatureToggle("reports")}
                      />
                      <Label htmlFor="feature-reports">تقارير وإحصائيات</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch
                        id="feature-api"
                        checked={appRequirements.features.includes("api")}
                        onCheckedChange={() => handleFeatureToggle("api")}
                      />
                      <Label htmlFor="feature-api">واجهة برمجة تطبيقات (API)</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch
                        id="feature-notifications"
                        checked={appRequirements.features.includes("notifications")}
                        onCheckedChange={() => handleFeatureToggle("notifications")}
                      />
                      <Label htmlFor="feature-notifications">نظام إشعارات</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch
                        id="feature-darkmode"
                        checked={appRequirements.features.includes("darkmode")}
                        onCheckedChange={() => handleFeatureToggle("darkmode")}
                      />
                      <Label htmlFor="feature-darkmode">الوضع الداكن</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="app-database">قاعدة البيانات</Label>
                  <Select
                    value={appRequirements.database}
                    onValueChange={(value) => setAppRequirements((prev) => ({ ...prev, database: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع قاعدة البيانات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون قاعدة بيانات</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="supabase">Supabase</SelectItem>
                      <SelectItem value="firebase">Firebase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">إلغاء</Link>
                </Button>
                <Button
                  onClick={handleStartGeneration}
                  disabled={!appRequirements.name || !appRequirements.description}
                >
                  بدء توليد التطبيق
                  <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="generation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>توليد التطبيق</CardTitle>
                <CardDescription>
                  يتم الآن توليد التطبيق باستخدام نموذج GPT-4o. قد تستغرق هذه العملية بضع دقائق.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={progress} className="h-2 w-full" />

                <div className="space-y-4">
                  {GENERATION_STAGES.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          index < currentStage
                            ? "bg-primary/20 text-primary"
                            : index === currentStage
                              ? "bg-primary text-primary-foreground animate-pulse"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index < currentStage ? (
                          <div className="h-4 w-4 rounded-full bg-primary" />
                        ) : index === currentStage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            index < currentStage
                              ? "text-primary"
                              : index === currentStage
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {stage.name}
                        </p>
                        {index < currentStage && <p className="text-xs text-muted-foreground">تم الانتهاء</p>}
                        {index === currentStage && <p className="text-xs text-muted-foreground">جاري التنفيذ...</p>}
                      </div>
                      <Badge variant={index <= currentStage ? "default" : "outline"}>{stage.percentage}%</Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border rounded-md">
                  <div className="bg-muted p-2 border-b flex justify-between items-center">
                    <div className="text-sm font-medium">مخرجات التوليد</div>
                    <div className="text-xs text-muted-foreground">
                      {isGenerating ? "جاري التوليد..." : "اكتمل التوليد"}
                    </div>
                  </div>
                  <ScrollArea className="h-[300px] w-full" ref={streamingOutputRef}>
                    <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                      {streamingOutput || "انتظار بدء التوليد..."}
                    </pre>
                  </ScrollArea>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>حدث خطأ</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {currentStage >= GENERATION_STAGES.length - 1 && !isGenerating && !error && (
                  <Alert className="mt-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>تم الانتهاء من توليد التطبيق!</AlertTitle>
                    <AlertDescription>
                      تم توليد التطبيق بنجاح. يمكنك الآن معاينة الكود المولد أو تصديره كملف ZIP.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                {currentStage >= GENERATION_STAGES.length - 1 && !isGenerating && !error && (
                  <Button onClick={() => setActiveTab("preview")}>
                    معاينة الكود المولد
                    <Code className="mr-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>معاينة الكود المولد</CardTitle>
                <CardDescription>يمكنك معاينة الكود المولد لكل مرحلة من مراحل التوليد</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="requirements" className="w-full">
                  <TabsList className="w-full grid grid-cols-5">
                    {GENERATION_STAGES.map((stage) => (
                      <TabsTrigger key={stage.id} value={stage.id}>
                        {stage.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {GENERATION_STAGES.map((stage) => (
                    <TabsContent key={stage.id} value={stage.id} className="mt-4">
                      <div className="space-y-4">
                        {parsedFiles[stage.id] && Object.entries(parsedFiles[stage.id]).length > 0 ? (
                          Object.entries(parsedFiles[stage.id]).map(([filePath, content], index) => (
                            <div key={index} className="relative">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium">{filePath}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDownloadFile(stage.id, filePath, content)}
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">تنزيل</span>
                                </Button>
                              </div>
                              <ScrollArea className="h-[300px] w-full rounded-md border bg-muted p-4">
                                <pre className="font-mono text-sm">
                                  <code dir="ltr" className="block text-left">
                                    {content}
                                  </code>
                                </pre>
                              </ScrollArea>
                            </div>
                          ))
                        ) : (
                          <div className="relative">
                            <ScrollArea className="h-[400px] w-full rounded-md border bg-muted p-4">
                              <pre className="font-mono text-sm">
                                <code dir="ltr" className="block text-left">
                                  {generatedCode[stage.id] || "// لم يتم توليد أي كود لهذه المرحلة بعد"}
                                </code>
                              </pre>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("requirements")}>
                  العودة إلى المتطلبات
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportZip}>
                    <Download className="mr-2 h-4 w-4" />
                    تصدير كملف ZIP
                  </Button>
                  <Button onClick={() => router.push("/dashboard")}>
                    <Save className="mr-2 h-4 w-4" />
                    حفظ المشروع
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

