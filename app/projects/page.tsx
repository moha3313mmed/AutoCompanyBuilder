"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Search, Trash2, Edit, Download, ExternalLink, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllProjects, deleteProject, createProject, type Project } from "@/lib/project-storage"
import { exportApplicationAsZip } from "@/lib/export-application"
import { toast } from "@/components/ui/use-toast"

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "dashboard",
  })

  // تحميل المشاريع عند تحميل الصفحة
  useEffect(() => {
    const loadedProjects = getAllProjects()
    setProjects(loadedProjects)
  }, [])

  // تصفية المشاريع بناءً على البحث
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // حذف مشروع
  const handleDeleteProject = () => {
    if (selectedProjectId) {
      const success = deleteProject(selectedProjectId)
      if (success) {
        setProjects((prev) => prev.filter((project) => project.id !== selectedProjectId))
        toast({
          title: "تم حذف المشروع",
          description: "تم حذف المشروع بنجاح",
        })
      } else {
        toast({
          title: "فشل في حذف المشروع",
          description: "حدث خطأ أثناء حذف المشروع",
          variant: "destructive",
        })
      }
      setIsDeleteDialogOpen(false)
      setSelectedProjectId(null)
    }
  }

  // إنشاء مشروع جديد
  const handleCreateProject = () => {
    if (!newProject.name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المشروع",
        variant: "destructive",
      })
      return
    }

    const createdProject = createProject({
      ...newProject,
      requirements: {
        name: newProject.name,
        description: newProject.description,
        type: newProject.type,
        features: [],
        database: "none",
      },
    })

    setProjects((prev) => [...prev, createdProject])
    setIsCreateDialogOpen(false)
    setNewProject({
      name: "",
      description: "",
      type: "dashboard",
    })

    toast({
      title: "تم إنشاء المشروع",
      description: "تم إنشاء المشروع بنجاح",
    })

    // الانتقال إلى صفحة المولد مع معرف المشروع
    router.push(`/generator?projectId=${createdProject.id}`)
  }

  // تصدير مشروع كملف ZIP
  const handleExportProject = (project: Project) => {
    try {
      exportApplicationAsZip(project.files, {
        filename: `${project.name.toLowerCase().replace(/\s+/g, "-")}.zip`,
      })

      toast({
        title: "تم تصدير المشروع",
        description: "تم تصدير المشروع بنجاح",
      })
    } catch (error) {
      toast({
        title: "فشل في تصدير المشروع",
        description: "حدث خطأ أثناء تصدير المشروع",
        variant: "destructive",
      })
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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
          <span className="font-semibold">إدارة المشاريع</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="البحث عن مشروع..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                مشروع جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء مشروع جديد</DialogTitle>
                <DialogDescription>أدخل تفاصيل المشروع الجديد</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">اسم المشروع</Label>
                  <Input
                    id="name"
                    placeholder="أدخل اسم المشروع"
                    value={newProject.name}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">نوع المشروع</Label>
                  <Select
                    value={newProject.type}
                    onValueChange={(value) => setNewProject((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المشروع" />
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
                <div className="grid gap-2">
                  <Label htmlFor="description">وصف المشروع</Label>
                  <Textarea
                    id="description"
                    placeholder="أدخل وصف المشروع"
                    value={newProject.description}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateProject}>إنشاء</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.type}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/generator?projectId=${project.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          تحرير
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportProject(project)}>
                          <Download className="mr-2 h-4 w-4" />
                          تصدير كملف ZIP
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedProjectId(project.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">{project.description || "لا يوجد وصف"}</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <div>تاريخ الإنشاء: {formatDate(project.createdAt)}</div>
                    <div>آخر تحديث: {formatDate(project.updatedAt)}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/generator?projectId=${project.id}`}>تحرير المشروع</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/editor?projectId=${project.id}`}>
                      <ExternalLink className="mr-2 h-3 w-3" />
                      فتح في المحرر
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">لم يتم العثور على مشاريع</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? "لم يتم العثور على مشاريع تطابق معايير البحث" : "لم تقم بإنشاء أي مشاريع بعد"}
              </p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                إنشاء مشروع جديد
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* حوار تأكيد الحذف */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

