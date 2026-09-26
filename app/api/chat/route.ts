import { createUIMessageStreamResponse, convertToModelMessages, isStepCount, streamText, toUIMessageStream } from 'ai';
import { STUDY_PLAN_MODEL_SETTINGS, STUDY_PLAN_SYSTEM_PROMPT, studyPlanModel } from '@/lib/ai-config';
import { generateStudySchedule } from '@/lib/tools/study-schedule';

export const runtime = 'nodejs';

// Cap streaming execution to 30 seconds on Vercel serverless functions.
// Without this, long-running streams can exceed the platform default and be
// silently terminated, leaving the client with an incomplete response.
export const maxDuration = 30;

// ─── In-memory rate limiter ──────────────────────────────────────────────────
// Tracks the timestamps of recent requests per client IP using a sliding window.
//
// IMPORTANT: This implementation is intentionally simple and is suitable only
// for single-instance deployments (e.g. Vercel free-tier Hobby plan).
// State is held in the Node.js process heap, so it resets on every cold start
// and is NOT shared across multiple serverless function instances.
//
// For production scale, replace this map with a distributed store such as
// Upstash Redis (via @upstash/ratelimit) or Vercel KV.
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute sliding window
const RATE_LIMIT_MAX_REQUESTS = 10;  // maximum requests per window per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Retrieve (or initialise) the list of request timestamps for this IP
  const timestamps = rateLimitMap.get(ip) ?? [];

  // Evict timestamps that have fallen outside the current window
  const recent = timestamps.filter(t => t > windowStart);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    // Store the evicted list back (no new timestamp — request is rejected)
    rateLimitMap.set(ip, recent);
    return true;
  }

  // Record this request and persist the updated list
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}
// ────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  // Prefer x-forwarded-for (set by Vercel/proxies); fall back to x-real-ip;
  // use "anonymous" as a last resort so the check still applies.
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests. You have exceeded the limit of 10 requests per minute. Please wait before trying again.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      },
    );
  }

  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'GOOGLE_GENERATIVE_AI_API_KEY is not configured.' },
        { status: 500 },
      );
    }

    const { messages } = await request.json();

    // ── Input length guard ────────────────────────────────────────────────────
    // Reject any request where a user message part exceeds 2,000 characters.
    // This prevents excessively large prompts from consuming model quota and
    // keeps responses within the maxDuration window.
    const MAX_MESSAGE_LENGTH = 2_000;
    const oversizedMessage = Array.isArray(messages) && messages.some((msg: { role?: string; content?: unknown }) => {
      if (msg.role !== 'user') return false;
      // content may be a plain string or an array of typed parts ({ type, text })
      if (typeof msg.content === 'string') {
        return msg.content.length > MAX_MESSAGE_LENGTH;
      }
      if (Array.isArray(msg.content)) {
        return msg.content.some(
          (part: { type?: string; text?: string }) =>
            part.type === 'text' && typeof part.text === 'string' && part.text.length > MAX_MESSAGE_LENGTH,
        );
      }
      return false;
    });

    if (oversizedMessage) {
      return new Response(
        JSON.stringify({ error: 'Message exceeds maximum allowed length of 2,000 characters.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    const result = streamText({
      model: studyPlanModel,
      system: STUDY_PLAN_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: STUDY_PLAN_MODEL_SETTINGS.maxOutputTokens,
      tools: { generateStudySchedule },
      stopWhen: isStepCount(3),
    });

    void result.finishReason.then(finishReason => {
      if (finishReason === 'length') {
        console.warn('[study-plan] Response was cut off by the model token limit.', {
          finishReason,
          maxOutputTokens: STUDY_PLAN_MODEL_SETTINGS.maxOutputTokens,
        });
      }
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: error => (error instanceof Error ? error.message : 'Tool execution failed.'),
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = /rate limit|quota|429|too many requests|429/i.test(message) ? 429 : 500;

    console.error('[study-plan] Chat request failed:', error);

    return Response.json(
      { error: 'Something went wrong reaching the AI. Please try again.' },
      { status },
    );
  }
}
