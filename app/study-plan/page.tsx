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

import StudyScheduleToolPart from '@/components/StudyScheduleToolPart';


// ─────────────────────────────────────────────────────────────────────────────
// SendButton – choreographed multi-state submit button
//
// DURATION & EASING RATIONALE:
//   • hover scale (150 ms, ease-out): Fast enough to feel instant and
//     responsive. ease-out decelerates into the end state so it doesn't
//     feel mechanical. 150 ms is below the ~200 ms perception threshold for
//     UI feedback, keeping hover snappy.
//   • loading fade-crossfade (200 ms, ease-in-out): The label fades out
//     while the spinner fades in simultaneously. 200 ms feels deliberate
//     without being slow – long enough to be readable as an intentional
//     transition, short enough not to block the user's sense of progress.
//   • spinner rotation (700 ms, linear): A linear easing gives the
//     impression of steady, continuous work. Shorter loops (<400 ms) feel
//     frantic; 700 ms lands in the "calm but active" range.
//   • success checkmark draw-on (300 ms, ease-out): The SVG path stroke-
//     dashoffset animation uses ease-out so the line starts fast and slows
//     to a confident stop, mimicking a human pen stroke.
//   • success hold then return to idle (1 200 ms total hold via setTimeout):
//     Long enough for users to register the ✓ without feeling stuck.
//   • error shake (400 ms, custom cubic-bezier(0.36, 0.07, 0.19, 0.97)):
//     This is a classic "snappy spring" curve that overshoots slightly on
//     the first beat and decays fast. 400 ms is the minimum perceptible
//     duration for a multi-step shake pattern (8 keyframe steps).
//   • error color transition (200 ms, ease-out): Matches the crossfade
//     duration for visual coherence.
//   • prefers-reduced-motion: All transform-based animations (shake, spin,
//     scale) are removed. Color and icon changes remain so state feedback
//     is never lost – just conveyed without motion.
// ─────────────────────────────────────────────────────────────────────────────

type BtnVisualState = 'idle' | 'loading' | 'success' | 'error';

interface SendButtonProps {
  /** True when the real send action is in-flight */
  isLoading: boolean;
  /** True when hasError is set on the chat */
  isError: boolean;
  /** True when the button should be fully disabled (empty input, or generating) */
  isDisabled: boolean;
  /** Called when the button is activated in idle/error state */
  onActivate: () => void;
  /** Override visual state from outside (used by demo controls) */
  forcedState?: BtnVisualState | null;
}

function SpinnerIcon() {
  return (
    <svg
      className="btn-spin h-4 w-4 text-white/90"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8" cy="8" r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="28"
        strokeDashoffset="20"
        opacity="0.3"
      />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-white"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <polyline
        className="btn-check"
        points="3,9 7,13 13,4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SendButton({ isLoading, isError, isDisabled, onActivate, forcedState }: SendButtonProps) {
  const [visualState, setVisualState] = useState<BtnVisualState>('idle');
  // Track shake key so re-triggering error re-mounts the animation
  const [shakeKey, setShakeKey] = useState(0);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLoadingRef = useRef(false);
  const prevErrorRef = useRef(false);

  // Sync visual state from real chat state
  useEffect(() => {
    if (forcedState) return; // demo override takes precedence

    const wasLoading = prevLoadingRef.current;
    const wasError = prevErrorRef.current;
    prevLoadingRef.current = isLoading;
    prevErrorRef.current = isError;

    if (isLoading) {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      setVisualState('loading');
      return;
    }

    if (isError) {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      setShakeKey(k => k + 1);
      setVisualState('error');
      return;
    }

    // Transitioned from loading → idle (not error) = success
    if (wasLoading && !isLoading && !isError) {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      setVisualState('success');
      successTimerRef.current = setTimeout(() => {
        setVisualState('idle');
      }, 1200);
      return;
    }

    // Error resolved (e.g. user retried successfully)
    if (wasError && !isError && !isLoading) {
      setVisualState('idle');
    }
  }, [isLoading, isError, forcedState]);

  // Apply forced state from demo controls
  useEffect(() => {
    if (!forcedState) return;
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    if (forcedState === 'error') setShakeKey(k => k + 1);
    setVisualState(forcedState);
    if (forcedState === 'success') {
      successTimerRef.current = setTimeout(() => setVisualState('idle'), 1200);
    }
  }, [forcedState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const isActuallyDisabled = isDisabled && visualState === 'idle';

  // Derived display values
  const bgColor =
    visualState === 'error'   ? 'bg-rose-600'
    : visualState === 'success' ? 'bg-emerald-500'
    : isActuallyDisabled        ? 'bg-slate-300'
    : 'bg-sky-600';

  const hoverBg =
    visualState === 'error'             ? 'hover:bg-rose-500 focus-visible:bg-rose-500'
    : visualState === 'idle' && !isActuallyDisabled ? 'hover:bg-sky-500 focus-visible:bg-sky-500'
    : '';

  const ariaLabel =
    visualState === 'loading' ? 'Sending…'
    : visualState === 'success' ? 'Sent!'
    : visualState === 'error'   ? 'Message failed — retry'
    : 'Send message';

  const label =
    visualState === 'error' ? 'Retry'
    : 'Send';

  return (
    <button
      key={shakeKey /* re-mount on shake so animation replays */}
      type="submit"
      disabled={isActuallyDisabled}
      onClick={visualState === 'error' ? onActivate : undefined}
      aria-label={ariaLabel}
      aria-live="polite"
      aria-busy={visualState === 'loading'}
      style={{ minWidth: '3rem' }}
      className={[
        // Base layout
        'relative inline-flex h-[48px] items-center justify-center overflow-hidden rounded-2xl px-4 text-sm font-semibold text-white',
        // Background transitions – 200 ms ease-out for color morph
        'transition-[background-color,transform,box-shadow,opacity] duration-200 ease-out',
        bgColor,
        hoverBg,
        // Hover/focus scale – compositor-only, 150 ms ease-out
        !isActuallyDisabled && visualState !== 'loading'
          ? '[&:not(:disabled)]:hover:scale-[1.04] [&:not(:disabled)]:active:scale-[0.97]'
          : '',
        // Focus ring (visible custom ring, replaces default outline)
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        visualState === 'error'
          ? 'focus-visible:ring-rose-400'
          : 'focus-visible:ring-sky-400',
        // Disabled treatment
        isActuallyDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        // Error shake (class drives the keyframe via globals.css)
        visualState === 'error' ? 'btn-shake' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Loading state: spinner fades in */}
      <span
        aria-hidden="true"
        className={[
          'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
          visualState === 'loading' ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <SpinnerIcon />
      </span>

      {/* Success state: checkmark fades in */}
      <span
        aria-hidden="true"
        className={[
          'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
          visualState === 'success' ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <CheckIcon />
      </span>

      {/* Idle / Error label – fades out during loading/success */}
      <span
        className={[
          'transition-opacity duration-200',
          visualState === 'loading' || visualState === 'success'
            ? 'opacity-0 select-none'
            : 'opacity-100',
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  );
}

export default function StudyPlanPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState('');
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [hasReceivedFirstToken, setHasReceivedFirstToken] = useState(false);

  // Demo-control state: null = no override; otherwise force a visual state
  const [demoForcedState, setDemoForcedState] = useState<'loading' | 'success' | 'error' | null>(null);

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

  // Demo helpers – simulate async call without hitting the real API
  const runDemo = (outcome: 'success' | 'error') => {
    if (demoForcedState === 'loading') return; // already running
    setDemoForcedState('loading');
    const delay = 800 + Math.random() * 700; // 800–1500 ms
    setTimeout(() => {
      setDemoForcedState(outcome);
      // Reset forced state after outcome animation completes
      setTimeout(() => setDemoForcedState(null), outcome === 'success' ? 1400 : 2000);
    }, delay);
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
                      <StudyScheduleToolPart part={part as any} />
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

          <SendButton
            isLoading={isGenerating}
            isError={hasError}
            isDisabled={!input.trim() || isInputDisabled}
            onActivate={retryLastMessage}
            forcedState={demoForcedState}
          />
        </form>

        {/* ── Demo controls ──────────────────────────────────────────────────
            These buttons are for design review only and are NOT part of the
            normal user flow. They simulate the Send button's loading →
            success / error choreography without calling the real chat API.
        ─────────────────────────────────────────────────────────────────── */}
        <div className="mt-2 flex items-center gap-2 border-t border-dashed border-slate-200 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Demo
          </span>
          <button
            type="button"
            onClick={() => runDemo('success')}
            disabled={demoForcedState === 'loading'}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Force Success
          </button>
          <button
            type="button"
            onClick={() => runDemo('error')}
            disabled={demoForcedState === 'loading'}
            className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Force Error
          </button>
        </div>
      </div>
    </section>
  );
}
