# FlyRank Capstone

A capstone project for the FlyRank Front-end AI Engineering track.

## Overview

FlyRank Capstone is a full-stack web application built with React and Next.js 
(frontend) and Node.js (API). It demonstrates front-end AI engineering skills 
through AI-assisted UI development and modern React/Next.js practices.

**Status:** Early development - project scaffold in place.

## Tech Stack

- **Frontend:** React, Next.js, TypeScript
- **Backend:** Node.js

## Tool Contract

### `generateStudySchedule`

**Purpose:** Generates a day-by-day study schedule for a course, cycling through the given topics up to the exam date.

**Location:** `lib/tools/study-schedule.ts`

**Input schema:**

| Field | Type | Description |
|---|---|---|
| `courseName` | `string` | The full course name or subject being studied, e.g. "Biology 101". |
| `examDate` | `string` | The exam date in `YYYY-MM-DD` format. Must be a future date. |
| `topics` | `string[]` | A list of specific subject areas or topics to cover before the exam. |
| `hoursPerDay` | `number` | Daily study time in hours, between 0.5 and 12 inclusive. |

**Return shape:**

```ts
{
  courseName: string;
  examDate: string;
  daysUntilExam: number;
  totalHours: number;
  days: {
    date: string;
    topic: string;
    hours: number;
  }[];
}
```

**Validation / error cases:**
- Throws if `examDate` is not a valid date, or is today or in the past.
- Throws if `topics` is empty.

**UI rendering:** The tool's four lifecycle states (`input-streaming`, `input-available`, `output-available`, `output-error`) are rendered with distinct visual treatments in `app/study-plan/page.tsx` via the `StudyScheduleToolPart` component. A successful call renders as a day-by-day table with a summary header (exam date, total hours, days remaining). A failed call renders as a designed error card showing the validation message.

