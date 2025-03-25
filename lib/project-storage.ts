/**
 * نموذج المشروع
 */
export interface Project {
  id: string
  name: string
  description: string
  type: string
  createdAt: string
  updatedAt: string
  requirements: {
    name: string
    description: string
    type: string
    features: string[]
    database: string
  }
  files: Record<string, string>
  stages?: Record<
    string,
    {
      completed: boolean
      generatedCode: string
      files: Record<string, string>
    }
  >
}

/**
 * الحصول على جميع المشاريع المحفوظة
 */
export function getAllProjects(): Project[] {
  if (typeof window === "undefined") return []

  try {
    const projectsJson = localStorage.getItem("app-builder-projects")
    if (!projectsJson) return []

    return JSON.parse(projectsJson)
  } catch (error) {
    console.error("Error getting projects:", error)
    return []
  }
}

/**
 * الحصول على مشروع محدد بواسطة المعرف
 */
export function getProjectById(id: string): Project | null {
  if (typeof window === "undefined") return null

  try {
    const projects = getAllProjects()
    return projects.find((project) => project.id === id) || null
  } catch (error) {
    console.error(`Error getting project with id ${id}:`, error)
    return null
  }
}

/**
 * حفظ مشروع جديد أو تحديث مشروع موجود
 */
export function saveProject(project: Project): Project {
  if (typeof window === "undefined") return project

  try {
    const projects = getAllProjects()
    const existingProjectIndex = projects.findIndex((p) => p.id === project.id)

    // تحديث وقت التعديل
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    }

    if (existingProjectIndex >= 0) {
      // تحديث مشروع موجود
      projects[existingProjectIndex] = updatedProject
    } else {
      // إضافة مشروع جديد
      projects.push(updatedProject)
    }

    localStorage.setItem("app-builder-projects", JSON.stringify(projects))
    return updatedProject
  } catch (error) {
    console.error("Error saving project:", error)
    return project
  }
}

/**
 * إنشاء مشروع جديد
 */
export function createProject(data: {
  name: string
  description: string
  type: string
  requirements: {
    name: string
    description: string
    type: string
    features: string[]
    database: string
  }
}): Project {
  const now = new Date().toISOString()

  const newProject: Project = {
    id: `project_${Date.now()}`,
    name: data.name,
    description: data.description,
    type: data.type,
    createdAt: now,
    updatedAt: now,
    requirements: data.requirements,
    files: {},
    stages: {},
  }

  return saveProject(newProject)
}

/**
 * حذف مشروع بواسطة المعرف
 */
export function deleteProject(id: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const projects = getAllProjects()
    const filteredProjects = projects.filter((project) => project.id !== id)

    if (filteredProjects.length === projects.length) {
      // لم يتم العثور على المشروع
      return false
    }

    localStorage.setItem("app-builder-projects", JSON.stringify(filteredProjects))
    return true
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error)
    return false
  }
}

/**
 * تحديث مرحلة في مشروع
 */
export function updateProjectStage(
  projectId: string,
  stageId: string,
  stageData: {
    completed: boolean
    generatedCode: string
    files: Record<string, string>
  },
): Project | null {
  if (typeof window === "undefined") return null

  try {
    const project = getProjectById(projectId)
    if (!project) return null

    const updatedProject: Project = {
      ...project,
      updatedAt: new Date().toISOString(),
      stages: {
        ...(project.stages || {}),
        [stageId]: stageData,
      },
    }

    // دمج الملفات من المرحلة مع ملفات المشروع
    for (const [path, content] of Object.entries(stageData.files)) {
      updatedProject.files[path] = content
    }

    return saveProject(updatedProject)
  } catch (error) {
    console.error(`Error updating stage ${stageId} for project ${projectId}:`, error)
    return null
  }
}

