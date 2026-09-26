export default async function HealthPage() {
  const mod = await import('../../data/health.json')
  const data = (mod as any).default ?? mod

  return (
    <section className="flex-1 flex flex-col gap-6 max-w-2xl bg-slate-50">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-1">System</p>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Health Check</h2>
        <p className="mt-1 text-sm text-slate-500">
          Server-rendered page confirming data fetching from local files works correctly.
        </p>
      </div>

      {/* Terminal card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" aria-hidden="true" />
          <span className="text-xs font-medium text-slate-700">health.json</span>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-emerald-600">OK</span>
        </div>

        {/* Code block */}
        <pre className="bg-slate-900 text-emerald-400 p-5 rounded-b-2xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </section>
  )
}
