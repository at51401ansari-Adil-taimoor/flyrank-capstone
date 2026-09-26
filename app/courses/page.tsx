import Link from 'next/link'

export default function CoursesPage() {
  const courses = [
    {
      code: 'BIO 101',
      name: 'Biology 101',
      instructor: 'Dr. Sarah Chen',
      term: 'Fall 2026',
      daysUntilExam: 18,
      topics: ['Cell Biology', 'Genetics', 'Ecology', 'Physiology', 'Mitosis'],
      color: 'emerald',
    },
    {
      code: 'CS 201',
      name: 'Computer Architecture',
      instructor: 'Prof. James Miller',
      term: 'Fall 2026',
      daysUntilExam: 4,
      topics: ['Logic Gates', 'Memory Hierarchy', 'Pipelining', 'ISA', 'Caches'],
      color: 'indigo',
    },
    {
      code: 'MATH 102',
      name: 'Calculus II',
      instructor: 'Prof. Aiko Tanaka',
      term: 'Fall 2026',
      daysUntilExam: 31,
      topics: ['Integration', 'Series', 'Polar Coordinates', 'Vectors'],
      color: 'amber',
    },
    {
      code: 'ENG 204',
      name: 'Technical Writing',
      instructor: 'Dr. Maria Lopez',
      term: 'Fall 2026',
      daysUntilExam: 12,
      topics: ['Reports', 'Documentation', 'Persuasion', 'Style Guides'],
      color: 'violet',
    },
    {
      code: 'CHEM 110',
      name: 'Organic Chemistry',
      instructor: 'Prof. David Park',
      term: 'Fall 2026',
      daysUntilExam: 5,
      topics: ['Reaction Mechanisms', 'Functional Groups', 'Stereochemistry'],
      color: 'rose',
    },
    {
      code: 'PHYS 201',
      name: 'Classical Mechanics',
      instructor: 'Dr. Elena Novak',
      term: 'Fall 2026',
      daysUntilExam: 22,
      topics: ['Newton\'s Laws', 'Energy', 'Rotational Motion', 'Oscillations'],
      color: 'sky',
    },
  ] as const

  const urgencyBadge = (days: number) =>
    days <= 5
      ? { bg: 'bg-red-100 text-red-700 border border-red-200',   label: `${days}d — URGENT` }
      : days <= 14
      ? { bg: 'bg-amber-100 text-amber-700 border border-amber-200', label: `${days}d until exam` }
      : { bg: 'bg-emerald-100 text-emerald-700 border border-emerald-200', label: `${days}d until exam` }

  const codeBadge: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700',
    indigo:  'bg-indigo-100 text-indigo-700',
    amber:   'bg-amber-100 text-amber-700',
    violet:  'bg-violet-100 text-violet-700',
    rose:    'bg-rose-100 text-rose-700',
    sky:     'bg-sky-100 text-sky-700',
  }

  return (
    <section className="flex-1 flex flex-col gap-8">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-0.5">Academic Hub</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            {courses.length} enrolled courses · Fall 2026
          </p>
        </div>
        <Link
          href="/study-plan"
          className="shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          ✦ Generate New Schedule
        </Link>
      </div>

      {/* ── Course grid ──────────────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map(course => {
          const badge = urgencyBadge(course.daysUntilExam)
          return (
            <div
              key={course.code}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-slate-300 transition-all"
            >
              {/* Card header — code + urgency */}
              <div className="flex items-start justify-between gap-3">
                <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide ${codeBadge[course.color]}`}>
                  {course.code}
                </span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              {/* Course name & meta */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900 leading-tight">{course.name}</h2>
                <p className="mt-0.5 text-[12px] text-slate-500">{course.instructor} · {course.term}</p>
              </div>

              {/* Topics tag cloud */}
              <div className="flex flex-wrap gap-1.5">
                {course.topics.map(topic => (
                  <span key={topic} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="mt-auto flex gap-2">
                <Link
                  href="/study-plan"
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition-colors"
                >
                  Generate Schedule
                </Link>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-700 transition-colors"
                >
                  View Syllabus
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
