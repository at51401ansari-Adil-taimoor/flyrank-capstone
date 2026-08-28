'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-rose-200 bg-rose-50 px-5 py-5 shadow-sm">
        <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Error
        </div>
        <p className="font-medium text-rose-800">
          Something went wrong. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 inline-flex rounded-full bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
