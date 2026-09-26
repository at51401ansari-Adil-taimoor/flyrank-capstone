import Link from 'next/link'

export default function DashboardPage() {
  const sessions = [
    { time: 'Today  ·  2:00 PM',     course: 'Biology 101',       topic: 'Cell Mitosis Review',    hours: 2,   color: 'emerald' },
    { time: 'Today  ·  6:00 PM',     course: 'Computer Arch.',    topic: 'Pipeline Hazards',       hours: 1.5, color: 'indigo'  },
    { time: 'Tomorrow  ·  10:00 AM', course: 'Calculus II',       topic: 'Series Convergence',     hours: 2,   color: 'amber'   },
    { time: 'Tomorrow  ·  3:00 PM',  course: 'Organic Chemistry', topic: 'Reaction Mechanisms',    hours: 1,   color: 'rose'    },
  ]

  const dotColor: Record<string, string> = {
    emerald: 'bg-emerald-500',
    indigo:  'bg-indigo-500',
    amber:   'bg-amber-500',
    rose:    'bg-rose-500',
  }

  const presets = [
    'Plan 5-day cram for Bio 101',
    '2 weeks calculus study routine',
    'CS 201 ISA prep — 3 hrs/day',
    'Organic Chemistry midterm sprint',
  ]

  return (
    <section className="flex-1 flex flex-col gap-8">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-0.5">Overview</p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Study Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Your academic command center — courses, deadlines, and AI study plans.</p>
      </div>

      {/* ── Metric cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Active Plans</p>
          <p className="text-3xl font-bold text-slate-900">1</p>
          <span className="inline-flex w-fit items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">● Active</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Next Exam</p>
          <p className="text-lg font-bold text-slate-900 leading-snug">CS 201</p>
          <span className="inline-flex w-fit items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">in 4 days</span>
        </div>

        {/* Card 3 — with progress bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Study Hours</p>
          <p className="text-3xl font-bold text-slate-900">14.5</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72.5%' }} />
            </div>
            <span className="text-[10px] text-slate-500 shrink-0">/ 20 hrs</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Preparedness</p>
          <p className="text-3xl font-bold text-slate-900">82<span className="text-xl text-slate-400">%</span></p>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '82%' }} />
          </div>
        </div>
      </div>

      {/* ── Main 2-column grid ───────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Left — Upcoming sessions timeline */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Upcoming Study Sessions</h2>
            <Link href="/study-plan" className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              View all →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Dot + line */}
                <div className="flex flex-col items-center pt-1 gap-1 shrink-0">
                  <span className={`h-2.5 w-2.5 rounded-full ${dotColor[s.color]} ring-2 ring-white shadow-sm`} />
                  {i < sessions.length - 1 && <span className="w-px flex-1 min-h-[28px] bg-slate-100" />}
                </div>
                {/* Content */}
                <div className="flex-1 pb-1">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{s.time}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.course}</p>
                  <p className="text-[12px] text-slate-500">{s.topic} · {s.hours} hr{s.hours !== 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — quick actions + model status */}
        <div className="flex flex-col gap-4">

          {/* AI Planner quick-prompt box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Launch AI Planner</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tap a preset or open the chat to describe your course.</p>
            </div>
            <div className="flex flex-col gap-2">
              {presets.map(p => (
                <Link
                  key={p}
                  href="/study-plan"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-sm text-slate-700 hover:text-indigo-700 transition-colors group"
                >
                  <span className="text-indigo-400 group-hover:text-indigo-600 text-xs">✦</span>
                  <span className="text-[13px] font-medium italic">&ldquo;{p}&rdquo;</span>
                </Link>
              ))}
            </div>
            <Link
              href="/study-plan"
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Open Study Planner →
            </Link>
          </div>

          {/* Active model card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">AI Model</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
            <p className="text-base font-bold text-white">Gemini 1.5 Flash</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <p className="text-slate-500 mb-0.5">Latency</p>
                <p className="text-slate-200 font-semibold">~420 ms</p>
              </div>
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <p className="text-slate-500 mb-0.5">Max tokens</p>
                <p className="text-slate-200 font-semibold">8 192</p>
              </div>
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <p className="text-slate-500 mb-0.5">Rate limit</p>
                <p className="text-slate-200 font-semibold">10 req / min</p>
              </div>
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <p className="text-slate-500 mb-0.5">Max input</p>
                <p className="text-slate-200 font-semibold">2 000 chars</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
