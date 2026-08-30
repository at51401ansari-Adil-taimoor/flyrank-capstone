// components/StudyScheduleToolPart.tsx
// Extracted from app/study-plan/page.tsx for isolated testability.
// Renders all four tool part states without changing any existing behaviour.

export interface ScheduleDay {
  date: string;
  topic: string;
  hours: number;
}

export interface ToolPartProps {
  part: {
    state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
    input?: {
      courseName?: string;
      examDate?: string;
      topics?: string[];
      hoursPerDay?: number;
    };
    output?: {
      courseName?: string;
      examDate?: string;
      daysUntilExam?: number;
      totalHours?: number;
      days?: ScheduleDay[];
    };
    errorText?: string;
  };
}

export default function StudyScheduleToolPart({ part }: ToolPartProps) {
  const input = part.input ?? {};
  const output = part.output ?? {};
  const topicCount = Array.isArray(input.topics) ? input.topics.length : 0;
  const days = Array.isArray(output.days) ? output.days : [];

  if (part.state === 'input-streaming') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-300" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
            {input.courseName ? (
              <div className="mt-2 truncate text-sm font-medium text-slate-600">{input.courseName}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (part.state === 'input-available') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm transition-all duration-200 ease-out">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-amber-900">Generating schedule</div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-amber-700">Working</span>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-amber-900 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-white/60 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Course</div>
            <div className="mt-1 font-medium">{input.courseName || '—'}</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white/60 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Exam date</div>
            <div className="mt-1 font-medium">{input.examDate || '—'}</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white/60 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Topics</div>
            <div className="mt-1 font-medium">{topicCount}</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white/60 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Hours/day</div>
            <div className="mt-1 font-medium">{input.hoursPerDay ?? '—'}</div>
          </div>
        </div>

        {/* Skeleton preview of the schedule table that will appear once output is ready */}
        <div className="mt-3 overflow-hidden rounded-xl border border-amber-200 bg-white/60">
          {/* Skeleton header row */}
          <div className="flex gap-3 border-b border-amber-200 bg-amber-100/60 px-3 py-2.5">
            <div className="h-3 w-16 animate-pulse rounded bg-amber-200" />
            <div className="h-3 w-28 animate-pulse rounded bg-amber-200" />
            <div className="h-3 w-10 animate-pulse rounded bg-amber-200" />
          </div>
          {/* Skeleton data rows */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3 border-b border-amber-100 px-3 py-2.5 last:border-b-0">
              <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-8 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (part.state === 'output-available') {
    const summary = output ?? {};
    return (
      <div key={part.state} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 ease-out">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Study schedule</div>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{summary.courseName || input.courseName || 'Study plan'}</h3>
          </div>
          <div className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            {summary.daysUntilExam ?? '—'} days until exam
          </div>
        </div>

        <div className="mb-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Exam date</div>
            <div className="mt-1 font-medium text-slate-800">{summary.examDate || input.examDate || '—'}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Total hours</div>
            <div className="mt-1 font-medium text-slate-800">{summary.totalHours ?? '—'}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Days</div>
            <div className="mt-1 font-medium text-slate-800">{days.length || 0}</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2.5 font-semibold text-slate-700">Date</th>
                <th className="px-3 py-2.5 font-semibold text-slate-700">Topic</th>
                <th className="px-3 py-2.5 font-semibold text-slate-700">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {days.length > 0 ? (
                days.map((day, idx) => (
                  <tr key={`${day.date}-${idx}`} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5">{day.date}</td>
                    <td className="px-3 py-2.5">{day.topic}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-800">{day.hours}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-slate-500">
                    No schedule days available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (part.state === 'output-error') {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
        <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Schedule unavailable</div>
        <p className="font-medium text-rose-800">{part.errorText || 'The schedule could not be generated.'}</p>
      </div>
    );
  }

  return null;
}
