import '../styles/globals.css'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'AI Study Planner',
  description: 'Personalized AI study schedules for students'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {/* ── Two-column app shell ──────────────────────────────────────── */}
        <div className="flex min-h-screen">

          {/* ── Left sidebar (desktop only) ──────────────────────────────── */}
          <Sidebar />

          {/* ── Right workspace ──────────────────────────────────────────── */}
          <div className="flex flex-col flex-1 min-w-0 bg-slate-50">

            {/* Top bar */}
            <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4 sm:px-6 gap-3 shrink-0">
              {/* Mobile brand (sidebar is hidden on mobile) */}
              <Link href="/" className="flex items-center gap-2 md:hidden">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white text-[10px] font-bold select-none">AI</span>
                <span className="font-bold text-sm text-white tracking-tight">Study Planner</span>
              </Link>

              {/* Route breadcrumb placeholder — kept generic so it works on every page */}
              <span className="hidden md:block text-sm font-medium text-slate-400">
                AI Study Planner
              </span>

              <div className="flex-1" />

              {/* Mobile nav links */}
              <nav aria-label="Main navigation" className="flex md:hidden items-center gap-1">
                <Link href="/"            className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 rounded transition-colors">Home</Link>
                <Link href="/courses"     className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 rounded transition-colors">Courses</Link>
                <Link href="/study-plan"  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg transition-colors">Plan</Link>
              </nav>

              {/* Desktop "New Plan" CTA */}
              <Link
                href="/study-plan"
                className="hidden md:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                <span>＋</span> New Plan
              </Link>
            </header>

            {/* Page content */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-4 bg-white shrink-0">
              <div className="px-4 sm:px-6 lg:px-8 text-center text-[11px] text-slate-400">
                © {new Date().getFullYear()} AI Study Planner · Powered by Gemini
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}
