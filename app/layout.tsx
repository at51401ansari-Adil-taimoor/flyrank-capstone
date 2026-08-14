import '../styles/globals.css'
import Link from 'next/link'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: 'AI Study Planner',
  description: 'Personalized AI study schedules for students'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold">AI Study Planner</h1>
              <nav className="space-x-4">
                <Link href="/" className="text-sm text-primary">Dashboard</Link>
                <Link href="/courses" className="text-sm text-primary">Courses</Link>
                <Link href="/study-plan" className="text-sm text-primary">Study Plan</Link>
                <Link href="/login" className="text-sm">Login</Link>
                <Link href="/signup" className="text-sm">Sign Up</Link>
                <Link href="/health" className="text-sm">Health</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
          <footer className="border-t bg-white py-4 mt-8">
            <div className="max-w-5xl mx-auto px-4 text-sm text-gray-600">© {new Date().getFullYear()} AI Study Planner</div>
          </footer>
        </div>
      </body>
    </html>
  )
}
