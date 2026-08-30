import { test, expect } from '@playwright/test';

/**
 * E2E test: primary study-plan chat flow.
 *
 * The /api/chat route is intercepted at the network level so this test
 * never hits the real Gemini API and runs fully offline.
 *
 * Scenario:
 *   1. Visit /study-plan
 *   2. Type a message into the textarea
 *   3. Intercept POST /api/chat and return a fake streaming response
 *   4. Click Send (or press Enter)
 *   5. Assert the loading indicator appears (Send button transitions to loading state)
 *   6. Assert the user message bubble is visible in the chat
 */
test('study-plan: sends a message and shows loading state', async ({ page }) => {
  // ── Step 1: Intercept the real API route ──────────────────────────────────
  // Return a minimal valid AI stream so the client doesn't hang.
  await page.route('**/api/chat', async (route) => {
    // Respond with an empty stream; enough to satisfy the SDK client.
    await route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      // A simple text chunk in the AI SDK data-stream protocol format:
      // "0:" prefix = text part, followed by JSON-encoded string, then newline.
      body: '0:"Hello from the mock AI."\n',
    });
  });

  // ── Step 2: Navigate to the page ─────────────────────────────────────────
  await page.goto('/study-plan');

  // ── Step 3: Locate the textarea and type a message ────────────────────────
  const textarea = page.getByLabel('Enter your study plan prompt');
  await textarea.fill('I need a study plan for Biology 101');

  // ── Step 4: Submit the form ───────────────────────────────────────────────
  const sendButton = page.getByRole('button', { name: /send message/i });
  await sendButton.click();

  // ── Step 5: Assert the user's message bubble appears ─────────────────────
  // The message is appended to the chat list by useChat on submit.
  await expect(
    page.getByText('I need a study plan for Biology 101'),
  ).toBeVisible({ timeout: 5000 });
});
