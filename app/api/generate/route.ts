import { type NextRequest, NextResponse } from "next/server"

// دالة مساعدة لإنشاء المطالبة المناسبة لكل مرحلة
function getPromptForStage(stage: string, requirements: any): string {
  const { name, description, type, features, database } = requirements

  switch (stage) {
    case "requirements":
      return `قم بتحليل المتطلبات التالية لتطبيق ${name}:
      - نوع التطبيق: ${type}
      - الوصف: ${description}
      - الميزات المطلوبة: ${features.join(", ")}
      - قاعدة البيانات: ${database}
      
      قم بإنشاء ملخص للمتطلبات وتحديد الخطوات اللازمة لتنفيذ هذا التطبيق. قدم النتيجة بتنسيق نصي واضح.
      
      ملاحظة مهمة: قم بتضمين أسماء الملفات الدقيقة والكاملة لكل ملف ستقوم بإنشائه، واستخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      على سبيل المثال:
      \`\`\`md file="README.md"
      # اسم المشروع
      وصف المشروع
      \`\`\`
      
      \`\`\`tsx file="app/page.tsx"
      export default function Home() {
        return <div>الصفحة الرئيسية</div>
      }
      \`\`\`
      `

    case "structure":
      return `قم بإنشاء هيكل مشروع Next.js لتطبيق ${name} بناءً على المتطلبات التالية:
      - نوع التطبيق: ${type}
      - الوصف: ${description}
      - الميزات المطلوبة: ${features.join(", ")}
      - قاعدة البيانات: ${database}
      
      قم بإنشاء هيكل المجلدات والملفات الرئيسية للمشروع. قدم النتيجة بتنسيق نصي واضح يوضح هيكل المجلدات والملفات.
      
      ملاحظة مهمة: قم بإنشاء ملفات حقيقية وكاملة، وليس مجرد وصف للهيكل. استخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات الأساسية:
      - app/layout.tsx (التخطيط الرئيسي)
      - app/page.tsx (الصفحة الرئيسية)
      - app/globals.css (ملف CSS العام)
      - tsconfig.json (إعدادات TypeScript)
      - tailwind.config.js (إعدادات Tailwind CSS)
      - package.json (تبعيات المشروع)
      
      قم بإنشاء محتوى كامل وقابل للتنفيذ لكل ملف.
      `

    case "frontend":
      return `قم بإنشاء مكونات واجهة المستخدم الرئيسية لتطبيق ${name} بناءً على المتطلبات التالية:
      - نوع التطبيق: ${type}
      - الوصف: ${description}
      - الميزات المطلوبة: ${features.join(", ")}
      
      قم بإنشاء كود React/Next.js للصفحة الرئيسية ولوحة التحكم وأي صفحات أخرى مطلوبة. استخدم Tailwind CSS للتنسيق واجعل التصميم متجاوبًا.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`tsx file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات على الأقل:
      - app/page.tsx (الصفحة الرئيسية)
      - app/dashboard/page.tsx (لوحة التحكم)
      - components/ui/button.tsx (مكون الزر)
      - components/ui/card.tsx (مكون البطاقة)
      
      قم بإنشاء محتوى كامل وقابل للتنفيذ لكل ملف، وتأكد من أن الكود يعمل بشكل صحيح.
      `

    case "backend":
      return `قم بإنشاء خدمات الخلفية الرئيسية لتطبيق ${name} بناءً على المتطلبات التالية:
      - نوع التطبيق: ${type}
      - الميزات المطلوبة: ${features.join(", ")}
      - قاعدة البيانات: ${database}
      
      قم بإنشاء نقاط نهاية API باستخدام Next.js API Routes. قم بتضمين التعامل مع قاعدة البيانات إذا كان ذلك مطلوبًا.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`tsx file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات على الأقل:
      - app/api/[endpoint]/route.ts (نقاط نهاية API)
      - lib/db.ts (اتصال قاعدة البيانات)
      - config/database.js (إعدادات قاعدة البيانات)
      
      قم بإنشاء محتوى كامل وقابل للتنفيذ لكل ملف، وتأكد من أن الكود يعمل بشكل صحيح.
      `

    case "finalization":
      return `قم بإنشاء ملف README.md لتطبيق ${name} يشرح كيفية تثبيت وتشغيل التطبيق، بالإضافة إلى وصف الميزات الرئيسية.
      قم أيضًا بإنشاء ملف تكوين لقاعدة البيانات وأي ملفات تكوين أخرى مطلوبة.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      
      يجب أن تشمل الملفات على الأقل:
      - README.md (توثيق المشروع)
      - .env.example (مثال لملف البيئة)
      - next.config.js (إعدادات Next.js)
      
      قم بإنشاء محتوى كامل وقابل للتنفيذ لكل ملف، وتأكد من أن الكود يعمل بشكل صحيح.
      `

    default:
      return `قم بإنشاء كود لتطبيق ${name} بناءً على المتطلبات المحددة.
      
      ملاحظة مهمة: قم بإنشاء ملفات كاملة وقابلة للتنفيذ مباشرة. استخدم الصيغة التالية لكل ملف:
      \`\`\`[نوع الملف] file="[مسار الملف الكامل]"
      [محتوى الملف الكامل]
      \`\`\`
      `
  }
}

// دالة لتوليد كود وهمي للعرض التوضيحي في حالة عدم توفر API
function generateDemoCode(stage: string, requirements: any): string {
  const { name, type } = requirements

  switch (stage) {
    case "requirements":
      return `
\`\`\`md file="requirements.md"
# تحليل المتطلبات لتطبيق ${name}

## نظرة عامة
- نوع التطبيق: ${type}
- الوصف: ${requirements.description}
- الميزات المطلوبة: ${requirements.features.join(", ")}
- قاعدة البيانات: ${requirements.database}

## خطة التنفيذ
1. إعداد مشروع Next.js مع App Router
2. تنفيذ واجهة المستخدم باستخدام Tailwind CSS
3. إعداد قاعدة البيانات وخدمات الخلفية
4. تنفيذ الميزات المطلوبة
5. اختبار وتحسين التطبيق
\`\`\`
`

    case "structure":
      return `
\`\`\`tsx file="app/layout.tsx"
import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "arabic"] })

export const metadata = {
  title: "${name}",
  description: "${requirements.description}",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
\`\`\`

\`\`\`tsx file="app/page.tsx"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold">${name}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            الميزات
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            التسعير
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            المستندات
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  ${name}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  ${requirements.description}
                </p>
              </div>
              <div className="space-x-4 rtl:space-x-reverse">
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  ابدأ الآن
                  <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
\`\`\`

\`\`\`css file="app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
\`\`\`

\`\`\`js file="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
\`\`\`

\`\`\`json file="tsconfig.json"
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
\`\`\`

\`\`\`json file="package.json"
{
  "name": "${name.toLowerCase().replace(/\s+/g, "-")}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-icons": "^1.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "tailwind-merge": "^2.1.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-config-next": "^14.0.0",
    "postcss": "^8.4.31",
    "typescript": "^5.3.2"
  }
}
\`\`\`
`

    case "frontend":
      return `
\`\`\`tsx file="app/page.tsx"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold">${name}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            الميزات
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            التسعير
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            المستندات
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  ${name}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  ${requirements.description}
                </p>
              </div>
              <div className="space-x-4 rtl:space-x-reverse">
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  ابدأ الآن
                  <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
\`\`\`

\`\`\`tsx file="app/dashboard/page.tsx"
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [data, setData] = useState([])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات</CardTitle>
          </CardHeader>
          <CardContent>
            <p>بيانات الإحصائيات هنا</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <p>بيانات المستخدمين هنا</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>النشاط</CardTitle>
          </CardHeader>
          <CardContent>
            <p>بيانات النشاط هنا</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`tsx file="components/ui/button.tsx"
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    React.PropsWithChildren {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
\`\`\`

\`\`\`tsx file="components/ui/card.tsx"
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
\`\`\`
`

    case "backend":
      return `
\`\`\`tsx file="app/api/data/route.ts"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

// نقطة نهاية API لجلب البيانات
export async function GET() {
  try {
    // في التطبيق الحقيقي، هنا سيتم الاتصال بقاعدة البيانات
    const db = await connectToDatabase()
    const data = [
      { id: 1, name: "عنصر 1" },
      { id: 2, name: "عنصر 2" },
      { id: 3, name: "عنصر 3" },
    ]
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}

// نقطة نهاية API لإضافة بيانات جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await connectToDatabase()
    
    // في التطبيق الحقيقي، هنا سيتم إضافة البيانات إلى قاعدة البيانات
    console.log("تمت إضافة البيانات:", body)
    
    return NextResponse.json({ success: true, message: "تمت إضافة البيانات بنجاح" })
  } catch (error) {
    console.error("Error adding data:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
\`\`\`

\`\`\`typescript file="lib/db.ts"
// مثال على اتصال بقاعدة البيانات
export async function connectToDatabase() {
  // هنا سيتم الاتصال بقاعدة البيانات المحددة
  console.log("تم الاتصال بقاعدة البيانات")
  
  // في التطبيق الحقيقي، هنا سيتم إنشاء اتصال بقاعدة البيانات
  // مثال: const client = new MongoClient(process.env.DATABASE_URL)
  
  return {
    query: async (sql: string, params: any[] = []) => {
      console.log("تنفيذ استعلام:", sql, params)
      return []
    },
    insert: async (table: string, data: any) => {
      console.log("إدراج بيانات في الجدول:", table, data)
      return { id: Date.now() }
    },
    update: async (table: string, id: number, data: any) => {
      console.log("تحديث بيانات في الجدول:", table, id, data)
      return true
    },
    delete: async (table: string, id: number) => {
      console.log("حذف بيانات من الجدول:", table, id)
      return true
    }
  }
}
\`\`\`

\`\`\`javascript file="config/database.js"
// إعدادات قاعدة البيانات
module.exports = {
  development: {
    client: "${requirements.database === "none" ? "sqlite3" : requirements.database}",
    connection: {
      filename: "./dev.sqlite3", // للتطوير المحلي باستخدام SQLite
      // للاتصال بقواعد بيانات أخرى، استخدم الإعدادات المناسبة
      // host: process.env.DB_HOST,
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    useNullAsDefault: true,
  },
  
  production: {
    client: "${requirements.database === "none" ? "postgresql" : requirements.database}",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
}
\`\`\`

\`\`\`typescript file="lib/utils.ts"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount)
}
\`\`\`
`

    case "finalization":
      return `
\`\`\`md file="README.md"
# ${name}

${requirements.description}

## الميزات

${requirements.features.map((feature) => `- ${feature}`).join("\n")}

## متطلبات التشغيل

- Node.js 18 أو أحدث
- NPM أو Yarn
${requirements.database !== "none" ? `- ${requirements.database}` : ""}

## كيفية البدء

1. قم بتثبيت التبعيات:
   \`\`\`
   npm install
   \`\`\`

2. قم بإعداد ملف البيئة:
   \`\`\`
   cp .env.example .env.local
   \`\`\`
   ثم قم بتعديل القيم في الملف حسب إعداداتك.

3. قم بتشغيل الخادم المحلي:
   \`\`\`
   npm run dev
   \`\`\`

4. افتح المتصفح على العنوان: \`http://localhost:3000\`

## هيكل المشروع

\`\`\`
project/
├── app/                      # مجلد التطبيق الرئيسي (Next.js App Router)
│   ├── page.tsx              # الصفحة الرئيسية
│   ├── layout.tsx            # التخطيط الرئيسي
│   ├── dashboard/            # صفحات لوحة التحكم
│   └── api/                  # نقاط نهاية API
├── components/               # مكونات React
│   ├── ui/                   # مكونات واجهة المستخدم
│   └── features/             # مكونات الميزات
├── lib/                      # وظائف مساعدة
│   └── utils.ts              # وظائف مساعدة
├── config/                   # ملفات التكوين
│   └── database.js           # إعدادات قاعدة البيانات
└── public/                   # الموارد العامة
\`\`\`

## التطوير

### إضافة صفحات جديدة

لإضافة صفحة جديدة، قم بإنشاء ملف \`page.tsx\` في المجلد المناسب ضمن مجلد \`app\`.

### إضافة نقاط نهاية API جديدة

لإضافة نقطة نهاية API جديدة، قم بإنشاء ملف \`route.ts\` في المجلد المناسب ضمن مجلد \`app/api\`.

## النشر

يمكن نشر هذا التطبيق على أي منصة تدعم Next.js، مثل Vercel أو Netlify.

\`\`\`
npm run build
npm run start
\`\`\`
\`\`\`

\`\`\`env file=".env.example"
# إعدادات التطبيق
APP_NAME=${name}
APP_URL=http://localhost:3000

# إعدادات قاعدة البيانات
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=${name.toLowerCase().replace(/\s+/g, "_")}

# إعدادات الأمان
JWT_SECRET=your_jwt_secret_key_here
\`\`\`

\`\`\`js file="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
\`\`\`

\`\`\`js file="postcss.config.js"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
\`\`\`
`

    default:
      return "// لم يتم توليد أي كود لهذه المرحلة"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { stage, requirements } = await request.json()

    // تحديد المطالبة المناسبة بناءً على المرحلة
    const prompt = getPromptForStage(stage, requirements)

    // التحقق من وجود مفتاح API
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // إذا لم يكن هناك مفتاح API، استخدم الكود الوهمي للعرض التوضيحي
      const demoCode = generateDemoCode(stage, requirements)
      return NextResponse.json({ text: demoCode })
    }

    // استخدام fetch مباشرة بدلاً من مكتبة OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              'أنت مطور محترف يقوم بإنشاء تطبيقات Next.js. قم بإنشاء كود عالي الجودة وقابل للتنفيذ مباشرة. استخدم الصيغة ```[نوع الملف] file="[مسار الملف الكامل]" لكل ملف تقوم بإنشائه.',
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "لم يتم توليد أي محتوى"

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error generating application:", error)

    // في حالة الخطأ، استخدم الكود الوهمي للعرض التوضيحي
    try {
      const { stage, requirements } = await request.json()
      const demoCode = generateDemoCode(stage, requirements)
      return NextResponse.json({ text: demoCode })
    } catch (e) {
      return NextResponse.json({ error: "حدث خطأ أثناء توليد التطبيق" }, { status: 500 })
    }
  }
}

