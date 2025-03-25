"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Database,
  Layout,
  Settings,
  Users,
  FileText,
  BarChart,
  Grid,
  Search,
  FileCode,
  FolderOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("templates")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <Layout className="h-6 w-6" />
          <span>AppBuilder</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <Link className="text-sm font-medium" href="#">
            لوحة التحكم
          </Link>
          <Link className="text-sm font-medium text-muted-foreground" href="/projects">
            المشاريع
          </Link>
          <Link className="text-sm font-medium text-muted-foreground" href="#">
            القوالب
          </Link>
          <Link className="text-sm font-medium text-muted-foreground" href="#">
            الإعدادات
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4 md:justify-end">
          <Button variant="outline" size="icon" className="rounded-full">
            <Search className="h-4 w-4" />
            <span className="sr-only">بحث</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
            <span className="sr-only">الإعدادات</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Users className="h-4 w-4" />
            <span className="sr-only">الحساب</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي التطبيقات</CardTitle>
              <Grid className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 في الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمين النشطين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 منذ الأسبوع الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العمليات</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% منذ الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التقارير المنشأة</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 منذ الأسبوع الماضي</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>إنشاء تطبيق جديد</CardTitle>
                <CardDescription>ابدأ بإنشاء تطبيق جديد باستخدام أحد القوالب أو من الصفر.</CardDescription>
              </div>
              <div className="mr-auto flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/builder">
                    <Layout className="mr-2 h-4 w-4" />
                    منشئ التطبيقات
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/generator">
                    <FileCode className="mr-2 h-4 w-4" />
                    مولد التطبيقات الذكي
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/editor">
                    <FileCode className="mr-2 h-4 w-4" />
                    محرر الأكواد المتكامل
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="templates"
                    className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    onClick={() => setActiveTab("templates")}
                  >
                    القوالب
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    onClick={() => setActiveTab("projects")}
                  >
                    المشاريع
                  </TabsTrigger>
                  <TabsTrigger
                    value="scratch"
                    className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    onClick={() => setActiveTab("scratch")}
                  >
                    من الصفر
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="templates" className="p-0 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Card className="cursor-pointer hover:bg-accent">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">إدارة المخزون</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground">تطبيق لإدارة المخزون والمنتجات والطلبات</p>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button size="sm" className="w-full">
                          استخدام هذا القالب
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">إدارة العملاء</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground">تطبيق لإدارة العملاء والمبيعات والعلاقات</p>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button size="sm" className="w-full">
                          استخدام هذا القالب
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">إدارة المشاريع</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground">تطبيق لإدارة المشاريع والمهام والفرق</p>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button size="sm" className="w-full">
                          استخدام هذا القالب
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="projects" className="p-0 pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">المشاريع الحالية</h3>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/projects">
                          <FolderOpen className="mr-2 h-4 w-4" />
                          عرض كل المشاريع
                        </Link>
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">نظام إدارة المخزون</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-muted-foreground">تم التحديث منذ 2 ساعة</p>
                        </CardContent>
                        <CardFooter className="p-4">
                          <Button size="sm" className="w-full" variant="outline">
                            فتح المشروع
                          </Button>
                        </CardFooter>
                      </Card>
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">نظام إدارة العملاء</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-muted-foreground">تم التحديث منذ يوم واحد</p>
                        </CardContent>
                        <CardFooter className="p-4">
                          <Button size="sm" className="w-full" variant="outline">
                            فتح المشروع
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="scratch" className="p-0 pt-4">
                  <div className="grid gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="app-name">اسم التطبيق</Label>
                      <Input id="app-name" placeholder="أدخل اسم التطبيق" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="app-description">وصف التطبيق</Label>
                      <Textarea id="app-description" placeholder="أدخل وصف التطبيق" />
                    </div>
                    <Button>
                      إنشاء تطبيق جديد
                      <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>التطبيقات الأخيرة</CardTitle>
              <CardDescription>قائمة بالتطبيقات التي تم إنشاؤها مؤخرًا.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">نظام إدارة المخزون</p>
                    <p className="text-xs text-muted-foreground">تم التحديث منذ 2 ساعة</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">نظام إدارة العملاء</p>
                    <p className="text-xs text-muted-foreground">تم التحديث منذ يوم واحد</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">نظام إدارة المستندات</p>
                    <p className="text-xs text-muted-foreground">تم التحديث منذ 3 أيام</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/projects">عرض كل المشاريع</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}

function Textarea({ id, placeholder }) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}

