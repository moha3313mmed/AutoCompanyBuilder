"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  Layout,
  Layers,
  Save,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Code,
  Database,
  Grid,
  Type,
  Image,
  ListOrdered,
  Table,
  Calendar,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Builder() {
  const [viewMode, setViewMode] = useState("desktop")
  const [activeTab, setActiveTab] = useState("components")

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">العودة</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Layout className="h-6 w-6" />
          <span className="font-semibold">منشئ التطبيقات</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-md"
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
              <span className="sr-only">عرض الجوال</span>
            </Button>
            <Button
              variant={viewMode === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setViewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
              <span className="sr-only">عرض التابلت</span>
            </Button>
            <Button
              variant={viewMode === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-md"
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
              <span className="sr-only">عرض سطح المكتب</span>
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            معاينة
          </Button>
          <Button variant="outline" size="sm">
            <Code className="mr-2 h-4 w-4" />
            التعليمات البرمجية
          </Button>
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            حفظ
          </Button>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-[250px_1fr_250px]">
        <div className="border-r">
          <Tabs defaultValue="components">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="components"
                className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                onClick={() => setActiveTab("components")}
              >
                المكونات
              </TabsTrigger>
              <TabsTrigger
                value="layers"
                className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                onClick={() => setActiveTab("layers")}
              >
                الطبقات
              </TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="p-0">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="grid gap-1 p-2">
                  <div className="font-medium px-2 py-1.5">عناصر الواجهة</div>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Type className="h-4 w-4" />
                    <span>نص</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Button size="icon" className="h-4 w-4 p-0" />
                    <span>زر</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Image className="h-4 w-4" />
                    <span>صورة</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <ListOrdered className="h-4 w-4" />
                    <span>قائمة</span>
                  </Button>
                  <Separator className="my-2" />
                  <div className="font-medium px-2 py-1.5">عناصر البيانات</div>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Table className="h-4 w-4" />
                    <span>جدول</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Grid className="h-4 w-4" />
                    <span>شبكة</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>تقويم</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    <span>نموذج</span>
                  </Button>
                  <Separator className="my-2" />
                  <div className="font-medium px-2 py-1.5">مكونات النظام</div>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Database className="h-4 w-4" />
                    <span>قاعدة بيانات</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Code className="h-4 w-4" />
                    <span>API</span>
                  </Button>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="layers" className="p-0">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="grid gap-1 p-2">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                  >
                    <Layers className="h-4 w-4" />
                    <span>الصفحة الرئيسية</span>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </Button>
                  <div className="pl-4">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                    >
                      <div className="h-4 w-4 rounded-sm border" />
                      <span>الرأس</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                    >
                      <div className="h-4 w-4 rounded-sm border" />
                      <span>القسم الرئيسي</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                    <div className="pl-4">
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                      >
                        <div className="h-4 w-4 rounded-sm border" />
                        <span>العنوان</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                      >
                        <div className="h-4 w-4 rounded-sm border" />
                        <span>الوصف</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                      >
                        <div className="h-4 w-4 rounded-sm border" />
                        <span>الأزرار</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 px-2 py-1.5 text-muted-foreground"
                    >
                      <div className="h-4 w-4 rounded-sm border" />
                      <span>التذييل</span>
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col items-center justify-center bg-muted/40 p-4">
          <div
            className={`bg-background border rounded-md shadow-sm overflow-auto transition-all ${
              viewMode === "mobile"
                ? "w-[375px] h-[667px]"
                : viewMode === "tablet"
                  ? "w-[768px] h-[1024px]"
                  : "w-full h-full"
            }`}
          >
            <div className="p-4 min-h-full">
              <div className="border-2 border-dashed border-primary/20 rounded-md min-h-full flex items-center justify-center text-muted-foreground">
                اسحب وأفلت المكونات هنا
              </div>
            </div>
          </div>
        </div>
        <div className="border-l">
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-medium">الخصائص</span>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">الإعدادات</span>
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">العنصر</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <option>لا يوجد عنصر محدد</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">المعرف</label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="معرف العنصر"
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">الفئة</label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="فئة العنصر"
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">النمط</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="نمط العنصر"
                  disabled
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

