import { createUIMessageStreamResponse, convertToModelMessages, isStepCount, streamText, toUIMessageStream } from 'ai';
import { STUDY_PLAN_MODEL_SETTINGS, STUDY_PLAN_SYSTEM_PROMPT, studyPlanModel } from '@/lib/ai-config';
import { generateStudySchedule } from '@/lib/tools/study-schedule';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'GOOGLE_GENERATIVE_AI_API_KEY is not configured.' },
        { status: 500 },
      );
    }

    const { messages } = await request.json();

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
