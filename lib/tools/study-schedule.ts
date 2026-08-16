import { z } from 'zod';
import { tool } from 'ai';

/**
 * Zod schema for the generateStudySchedule tool.
 * Defines the input parameters and their constraints.
 */
export const studyScheduleInputSchema: z.ZodType<{
  courseName: string;
  examDate: string;
  topics: string[];
  hoursPerDay: number;
}> = z.object({
  courseName: z.string().describe(
    'The full course name or subject being studied, such as "Biology 101" or "AP Statistics".',
  ),
  examDate: z.string().describe(
    'The exam date in YYYY-MM-DD format, such as 2026-09-15. It must be a future date.',
  ),
  topics: z.array(z.string()).describe(
    'A list of specific subject areas or topics to cover before the exam, such as ["Cell biology", "Genetics", "Ecology"].',
  ),
  hoursPerDay: z
    .number()
    .min(0.5)
    .max(12)
    .describe(
      'The daily study time in hours, with a valid range of 0.5 to 12 inclusive.',
    ),
});

type StudyScheduleInput = {
  courseName: string;
  examDate: string;
  topics: string[];
  hoursPerDay: number;
};

interface ScheduleDay {
  date: string;
  topic: string;
  hours: number;
}

interface StudyScheduleOutput {
  courseName: string;
  examDate: string;
  daysUntilExam: number;
  totalHours: number;
  days: ScheduleDay[];
}

/**
 * Converts a Date object to a local YYYY-MM-DD string.
 * Avoids timezone shift issues that occur with toISOString().split('T')[0]
 * when the client is in a positive UTC-offset timezone.
 */
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates a day-by-day study schedule based on course info and available hours.
 * Validates that the exam date is in the future and topics array is non-empty.
 * Cycles through topics, allocating one topic per day up to the exam date.
 */
export const generateStudySchedule = tool({
  description:
    'Use this tool whenever the student has provided all required scheduling data: a course name, a future exam date, a non-empty list of topics, and daily study hours. This is the canonical way to create a study schedule; do not write a schedule in plain text when these fields are present. Only ask for clarification in text when any required field is missing, then call this tool once the missing info is available.',
  inputSchema: studyScheduleInputSchema as any,
  execute: async (input: StudyScheduleInput): Promise<StudyScheduleOutput> => {
    // Validate exam date is in the future
    const examDateObj = new Date(input.examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    examDateObj.setHours(0, 0, 0, 0);

    if (isNaN(examDateObj.getTime())) {
      throw new Error(
        `Invalid exam date format. Expected YYYY-MM-DD, received: ${input.examDate}`,
      );
    }

    if (examDateObj <= today) {
      throw new Error(
        `Exam date must be in the future. Provided date: ${input.examDate} is today or in the past.`,
      );
    }

    // Validate topics array is non-empty
    if (!input.topics || input.topics.length === 0) {
      throw new Error(
        'Topics array cannot be empty. Please provide at least one topic to study.',
      );
    }

    // Calculate days until exam
    const daysUntilExam = Math.floor(
      (examDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Build day-by-day schedule, cycling through topics
    const days: ScheduleDay[] = [];
    const topicCount = input.topics.length;

    for (let i = 0; i < daysUntilExam; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      const topicIndex = i % topicCount;
      const topic = input.topics[topicIndex];

      days.push({
        date: toLocalDateString(currentDate),
        topic,
        hours: input.hoursPerDay,
      });
    }

    // Calculate total study hours
    const totalHours = days.length * input.hoursPerDay;

    return {
      courseName: input.courseName,
      examDate: input.examDate,
      daysUntilExam,
      totalHours,
      days,
    };
  },
});
