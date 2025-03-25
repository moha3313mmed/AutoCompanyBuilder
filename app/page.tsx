import Link from "next/link"
import { ArrowRight, CheckCircle, Code, Database, Layout, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Layout className="h-6 w-6 mr-2" />
          <span className="font-bold">AppBuilder</span>
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            حول
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  بناء تطبيقات الشركات بشكل تلقائي
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  منصة سهلة الاستخدام لإنشاء تطبيقات مخصصة للشركات بدون برمجة. وفر الوقت والموارد.
                </p>
              </div>
              <div className="space-x-4 rtl:space-x-reverse">
                <Button
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  asChild
                >
                  <Link href="/generator">
                    ابدأ الآن
                    <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  عرض توضيحي
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">ميزات المنصة</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  كل ما تحتاجه لبناء تطبيقات شركتك بسرعة وكفاءة
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <Layout className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">واجهات سهلة الاستخدام</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    إنشاء واجهات مستخدم جذابة وسهلة الاستخدام بدون معرفة تقنية
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <Database className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">إدارة البيانات</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    إنشاء وإدارة قواعد البيانات المخصصة لتطبيقات شركتك بسهولة
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">تخصيص متقدم</h3>
                  <p className="text-gray-500 dark:text-gray-400">خيارات تخصيص متقدمة للمستخدمين ذوي المعرفة التقنية</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <Settings className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">أتمتة العمليات</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    أتمتة عمليات الأعمال المتكررة لتوفير الوقت والموارد
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">تكامل سهل</h3>
                  <p className="text-gray-500 dark:text-gray-400">تكامل سلس مع الأنظمة والخدمات الحالية</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">تقارير وتحليلات</h3>
                  <p className="text-gray-500 dark:text-gray-400">تقارير وتحليلات متقدمة لمراقبة أداء تطبيقاتك</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">كيف يعمل</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  عملية بسيطة من ثلاث خطوات لإنشاء تطبيقات الشركات الخاصة بك
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    1
                  </div>
                  <h3 className="text-xl font-bold">اختر قالب</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    اختر من بين مجموعة متنوعة من القوالب المصممة مسبقًا لمختلف احتياجات الأعمال
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    2
                  </div>
                  <h3 className="text-xl font-bold">خصص التطبيق</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    خصص التطبيق وفقًا لاحتياجات عملك باستخدام أدوات السحب والإفلات سهلة الاستخدام
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    3
                  </div>
                  <h3 className="text-xl font-bold">نشر واستخدام</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    انشر تطبيقك واستخدمه على الفور، مع تحديثات وتحسينات مستمرة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">ابدأ اليوم</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  انضم إلى آلاف الشركات التي تستخدم منصتنا لبناء تطبيقات أعمالها
                </p>
              </div>
              <div className="space-x-4 rtl:space-x-reverse">
                <Button
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  asChild
                >
                  <Link href="/generator">سجل مجانًا</Link>
                </Button>
                <Button
                  variant="outline"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  تواصل معنا
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 AppBuilder. كل الحقوق محفوظة.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            الشروط والأحكام
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            سياسة الخصوصية
          </Link>
        </nav>
      </footer>
    </div>
  )
}

