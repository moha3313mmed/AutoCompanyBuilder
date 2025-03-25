import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin", "arabic"] })

export const metadata = {
  title: "منشئ تطبيقات الشركات",
  description: "منصة سهلة الاستخدام لإنشاء تطبيقات مخصصة للشركات بدون برمجة",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'