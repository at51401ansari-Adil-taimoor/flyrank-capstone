'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';

function normalizePartialMarkdown(text: string) {
  const fenceMatches = text.match(/```/g) ?? [];

  if (fenceMatches.length % 2 !== 0) {
    return `${text}\n\`\`\``;
  }

  return text;
}

function renderTextPart(text: string) {
  return (
    <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-inherit">
      {normalizePartialMarkdown(text)}
    </div>
  );
}

function StudyScheduleToolPart({ part }: { part: any }) {
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
                days.map((day: any, idx: number) => (
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

export default function StudyPlanPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState('');
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [hasReceivedFirstToken, setHasReceivedFirstToken] = useState(false);

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const hasError = status === 'error' || Boolean(error);
  const isGenerating = status === 'submitted' || status === 'streaming';
  const isInputDisabled = isGenerating;
  const showThinking = !hasError && isGenerating && !hasReceivedFirstToken;

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'assistant') {
      if (!isGenerating) {
        setHasReceivedFirstToken(false);
      }
      return;
    }

    const assistantText = lastMessage.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');

    if (assistantText.trim().length > 0) {
      setHasReceivedFirstToken(true);
    } else if (!isGenerating) {
      setHasReceivedFirstToken(false);
    }
  }, [messages, isGenerating]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const shouldAutoScroll = distanceFromBottom < 48;

    if (shouldAutoScroll) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
      setShowJumpToLatest(false);
    }
  }, [messages, status, input]);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
    setShowJumpToLatest(false);
  };

  const onScroll = () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const userHasScrolledUp = distanceFromBottom > 48;
    setShowJumpToLatest(userHasScrolledUp && messages.length > 0);
  };

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isGenerating || hasError) {
      return;
    }

    setInput('');
    setHasReceivedFirstToken(false);
    void sendMessage({ text: trimmed });
  };

  const retryLastMessage = () => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'user') {
      return;
    }

    const lastUserMessage = lastMessage.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');

    if (!lastUserMessage.trim()) {
      return;
    }

    setHasReceivedFirstToken(false);
    void sendMessage({ text: lastUserMessage });
  };

  return (
    <section className="relative flex h-[calc(100vh-12rem)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Study planner</p>
          <h2 className="text-lg font-semibold text-slate-900">AI study plan chat</h2>
        </div>
        {isGenerating && (
          <button
            type="button"
            onClick={() => stop()}
            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
          >
            Stop
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-3 py-4 sm:px-5"
      >
        {messages.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-600">
            Tell me which courses you are studying, your exam dates, and how many hours you can commit each day.
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-800'
              }`}
            >
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                {message.role === 'user' ? 'You' : 'Study AI'}
              </div>

              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <div key={`${message.id}-${index}`}>
                      {renderTextPart(part.text)}
                    </div>
                  );
                }

                if (part.type === 'tool-generateStudySchedule') {
                  return (
                    <div
                      key={`${message.id}-${index}`}
                      className={part.state === 'output-available' ? 'transition-all duration-200 ease-out' : ''}
                    >
                      <StudyScheduleToolPart part={part} />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {hasError && (
          <div className="flex justify-center">
            <div className="max-w-md rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
              <p className="font-medium">Something went wrong reaching the AI. Please try again.</p>
              <button
                type="button"
                onClick={retryLastMessage}
                className="mt-2 inline-flex rounded-full bg-rose-600 px-3 py-1.5 font-medium text-white transition hover:bg-rose-500"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div
          className={`pointer-events-none flex justify-center transition-all duration-300 ${
            showThinking ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
          aria-live="polite"
        >
          {showThinking && (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </span>
              Thinking
            </div>
          )}
        </div>
      </div>

      {showJumpToLatest && (
        <div className="absolute inset-x-0 bottom-20 flex justify-center px-4">
          <button
            type="button"
            onClick={scrollToBottom}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg transition hover:bg-slate-50"
          >
            Jump to latest
          </button>
        </div>
      )}

      <div className="border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur-sm sm:px-5">
        <form onSubmit={submitMessage} className="flex items-end gap-3">
          <label className="sr-only" htmlFor="study-plan-prompt">
            Enter your study plan prompt
          </label>
          <textarea
            id="study-plan-prompt"
            value={input}
            onChange={event => setInput(event.target.value)}
            rows={1}
            placeholder="Ask for a study plan..."
            disabled={isInputDisabled}
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const form = event.currentTarget.form;
                if (form) {
                  form.requestSubmit();
                }
              }
            }}
          />

          <button
            type="submit"
            disabled={!input.trim() || isInputDisabled}
            className="inline-flex h-[48px] items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
