import Link from 'next/link'

const navLinks = [
  { href: '/',            label: 'Dashboard',     icon: '⊞' },
  { href: '/study-plan',  label: 'Study Plan',    icon: '✦', highlight: true },
  { href: '/courses',     label: 'My Courses',    icon: '📚' },
  { href: '/health',      label: 'System Health', icon: '◎' },
]

const recentPlans = [
  { emoji: '📚', label: 'Biology 101 Finals Cram',        sub: '4 days' },
  { emoji: '💻', label: 'Computer Architecture ISA Prep',  sub: '7 days' },
  { emoji: '📐', label: 'Calculus II Polar Coordinates',   sub: '2 weeks' },
  { emoji: '⚡', label: 'Organic Chemistry Midterm',       sub: '5 days' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 min-h-screen flex-col bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-2.5 border-b border-slate-800">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold select-none shrink-0">
          AI
        </span>
        <span className="font-bold text-[15px] text-white tracking-tight leading-tight">
          AI Study<br />
          <span className="text-indigo-400 font-semibold text-[13px]">Planner</span>
        </span>
      </div>

      {/* ── Primary nav ────────────────────────────────────────────────── */}
      <nav aria-label="Sidebar navigation" className="px-2 pt-4 flex flex-col gap-0.5">
        {navLinks.map(link => (
          link.highlight ? (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          )
        ))}
      </nav>

      {/* ── Recent study plans ─────────────────────────────────────────── */}
      <div className="px-2 mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 px-2 mb-2">
          Recent Study Plans
        </p>
        <div className="flex flex-col gap-0.5">
          {recentPlans.map(plan => (
            <Link
              key={plan.label}
              href="/study-plan"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors group truncate"
            >
              <span className="shrink-0 text-sm">{plan.emoji}</span>
              <span className="truncate flex-1 text-[13px]">{plan.label}</span>
              <span className="shrink-0 text-[10px] text-slate-600 group-hover:text-slate-400 hidden xl:block">
                {plan.sub}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Spacer ─────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── User footer ────────────────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-slate-800">
        <Link
          href="/login"
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
        >
          {/* Avatar */}
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-white text-xs font-bold select-none">
            AT
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-200 truncate">Adil Taimoor</span>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-400 truncate">Student · Free plan</span>
          </div>
          <span className="ml-auto text-slate-600 group-hover:text-slate-400 text-xs">→</span>
        </Link>
      </div>
    </aside>
  )
}
