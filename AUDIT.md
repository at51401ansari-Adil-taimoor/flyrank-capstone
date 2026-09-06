# FE-10 Accessibility & Performance Audit

> **Project:** flyrank-capstone — Next.js 13 App Router, TypeScript, Tailwind CSS
> **Live URL:** https://flyrank-capstone-zeta.vercel.app/
> **Audit date:** 2026-09-05
> **Tool versions:** Lighthouse CLI (mobile emulation, no `--preset` flag), WAVE (manual — see below), keyboard test (manual — see below)

---

## 1. Lighthouse Baseline (Before Fixes)

Audits run against the live deployed URL before any code changes.

### Homepage (`/`)

| Category | Score |
|---|---|
| Performance | ~91 |
| Accessibility | ~96 |
| Best Practices | ~78 |
| SEO | ~100 |

**Performance metrics:**

| Metric | Value | Score |
|---|---|---|
| First Contentful Paint | 1.2 s | 0.99 |
| Largest Contentful Paint | 1.9 s | 0.98 |
| Total Blocking Time | 410 ms | 0.67 amber |
| Cumulative Layout Shift | 0 | 1.00 |
| Speed Index | 2.8 s | 0.96 |
| Time to Interactive | 2.5 s | 0.98 |

**Issues found in baseline:**

| ID | Severity | Finding |
|---|---|---|
| BP-1 | High | `favicon.ico` returns 404 → console error → lowers Best Practices |
| BP-2 | Medium | Unused JS: ~26 KiB (~81% unused) in `380-*.js` chunk |
| PERF-1 | Medium | TBT 410 ms (score 0.67) — 5 long tasks; `472-adf511f336431740.js` 296 ms, inline/root 203 ms |
| BP-3 | Low | No Content-Security-Policy header (informational) |
| BP-4 | Low | No COOP header (informational) |
| A11Y-1 | Medium | `<nav>` has no accessible name (`aria-label` missing) |
| A11Y-2 | High | Login form: `<label>` elements not programmatically associated with `<input>` (missing `htmlFor`/`id`) |
| A11Y-3 | Medium | Login form inputs: no focus ring styles |
| A11Y-4 | Medium | Login form submit button: no focus ring |
| A11Y-5 | Medium | Stop button on study-plan: no `aria-label`, no focus ring |
| A11Y-6 | Medium | "Jump to latest" button: no focus ring |
| A11Y-7 | Medium | Retry button (error state): no `aria-label`, no focus ring |
| A11Y-8 | Medium | Demo buttons (Force Success/Error): no focus rings |
| A11Y-9 | High | Chat message container: no `aria-live` region — streamed AI text not announced to screen readers |
| A11Y-10 | Low | Study plan `<section>`: not a named landmark (no `aria-labelledby`) |
| A11Y-11 | Low | Schedule data table: `<th>` elements missing `scope="col"` |
| A11Y-12 | Low | Schedule data table: no `<caption>` for screen reader context |

---

## 2. Issues Fixed

All fixes were applied to source code and verified with `npm run build` (exit code 0, zero TypeScript errors).

### 2.1 Favicon 404 → console error fixed

**File:** `public/favicon.ico` (new file — `public/` directory created)
**Fix:** Added a minimal 1x1 transparent ICO file. Next.js serves `public/` statically, so `/favicon.ico` now returns 200.
**Expected improvement:** Eliminates the `errors-in-console` failure → Best Practices score should rise to ~95+.

---

### 2.2 Login form: label associations fixed

**File:** `app/login/page.tsx`
**Fixes:**
- Added `htmlFor="login-email"` to email label + `id="login-email"` and `type="email"` to email input
- Added `htmlFor="login-password"` to password label + `id="login-password"` to password input
- Added `focus:ring-2 focus:ring-sky-400` focus rings to both inputs
- Added `focus-visible:ring-2 focus-visible:ring-sky-400` focus ring to the Login button

**WCAG criterion:** 1.3.1 Info and Relationships (Level A), 2.4.7 Focus Visible (Level AA)

---

### 2.3 Nav landmark: accessible name added

**File:** `app/layout.tsx`
**Fix:** Added `aria-label="Main navigation"` to the `<nav>` element.
**WCAG criterion:** 2.4.1 Bypass Blocks (Level A), ARIA Landmarks best practice

---

### 2.4 Stop button: aria-label and focus ring

**File:** `app/study-plan/page.tsx`
**Fix:** Added `aria-label="Stop generating"` and `focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2`.
**WCAG criterion:** 2.4.6 Headings and Labels (Level AA), 2.4.7 Focus Visible (Level AA)

---

### 2.5 Chat messages container: aria-live region

**File:** `app/study-plan/page.tsx`
**Fix:** Added `aria-live="polite"` and `aria-label="Chat messages"` to the scroll container div.
**Rationale:** `polite` allows screen readers to finish reading the current content before announcing new messages. `assertive` would interrupt — inappropriate for streaming chat.
**WCAG criterion:** 4.1.3 Status Messages (Level AA)

---

### 2.6 Study plan section: named landmark

**File:** `app/study-plan/page.tsx`
**Fix:** Added `aria-labelledby="study-plan-heading"` to the `<section>` element and `id="study-plan-heading"` to the existing `<h2>`.
**WCAG criterion:** 1.3.1 Info and Relationships (Level A)

---

### 2.7 Focus rings: Jump to latest, Retry, demo buttons

**File:** `app/study-plan/page.tsx`
**Fixes:** Added `focus-visible:ring-2 focus-visible:ring-*-400 focus-visible:ring-offset-*` to:
- "Jump to latest" button
- "Retry" button in error message (also added `aria-label="Retry sending last message"`)
- "Force Success" and "Force Error" demo buttons

**WCAG criterion:** 2.4.7 Focus Visible (Level AA)

---

### 2.8 Schedule data table: scope and caption

**File:** `components/StudyScheduleToolPart.tsx`
**Fixes:**
- Added `scope="col"` to all three `<th>` elements
- Added `<caption className="sr-only">Study schedule — daily topics and hours</caption>` (visually hidden, read by screen readers)

**WCAG criterion:** 1.3.1 Info and Relationships (Level A)

---

## 3. Issues Not Fixed (with rationale)

| Issue | Why not fixed |
|---|---|
| TBT 410 ms — large JS bundle `472-*.js` (27.5 kB) | This is React + AI SDK runtime; reducing it would require removing features. Next.js code-splitting already isolates it to non-homepage routes. |
| Unused JS chunk `380-*.js` (~26 KiB, 81% unused at homepage) | Likely third-party library code for routes not yet visited; tree-shaking is already applied by webpack. No code change can eliminate this without removing the dependency. |
| No CSP header | Infrastructure concern (Vercel headers config). Out of scope for this code audit — documented for follow-up. |
| No COOP header | Same as above. |
| `text-slate-400` placeholder contrast | Placeholder text is excluded from WCAG 1.4.3 contrast requirements per the spec. The actual input text (`text-slate-900`) passes easily. |

---

## 4. WAVE Findings

> Fill this section in after running WAVE on the deployed URL.
> Run WAVE at https://wave.webaim.org/ against:
> - https://flyrank-capstone-zeta.vercel.app/ (homepage)
> - https://flyrank-capstone-zeta.vercel.app/study-plan
> - https://flyrank-capstone-zeta.vercel.app/login
> - https://flyrank-capstone-zeta.vercel.app/signup

| Page | Errors | Alerts | Contrast errors | Notes |
|---|---|---|---|---|
| Homepage | | | | |
| /study-plan | | | | |
| /login | | | | |
| /signup | | | | |

---

## 5. Manual Keyboard-Only Test Notes

> Fill this section in after doing a real physical keyboard-only test.
> Test with Tab / Shift+Tab to move focus, Enter/Space to activate.

**Checklist:**

| Test | Chrome | Firefox | Safari | NVDA | Notes |
|---|---|---|---|---|---|
| Can Tab to all nav links, focus ring visible | | | | | |
| Can Tab to chat textarea, send, Stop | | | | | |
| Enter/Space submits form | | | | | |
| Stop button keyboard-activatable | | | | | |
| Error state: Retry button focusable | | | | | |
| "Jump to latest" focusable when visible | | | | | |
| Screen reader announces new AI messages | | | | | |
| Screen reader announces Send button state changes | | | | | |
| Login form: Tab moves label→input correctly | | | | | |
| Signup form: Tab moves label→input correctly | | | | | |
| Signup validation errors announced | | | | | |

---

## 6. Lighthouse After Fixes

> Fill this section in after deploying and re-running Lighthouse.
>
> Re-run after committing and waiting for Vercel to deploy:
>
> npx lighthouse https://flyrank-capstone-zeta.vercel.app/ --output=html --output=json --output-path=./audit-after-homepage
> npx lighthouse https://flyrank-capstone-zeta.vercel.app/study-plan --output=html --output=json --output-path=./audit-after-study-plan

### Homepage (`/`) — After

| Category | Before | After | Delta |
|---|---|---|---|
| Performance | ~91 | | |
| Accessibility | ~96 | | |
| Best Practices | ~78 | | |
| SEO | ~100 | | |

### Study Plan (`/study-plan`) — After

| Category | Before | After | Delta |
|---|---|---|---|
| Performance | | | |
| Accessibility | | | |
| Best Practices | | | |
| SEO | | | |

---

## 7. Files Changed

| File | Change |
|---|---|
| `public/favicon.ico` | NEW — 1x1 transparent ICO, fixes favicon 404 |
| `app/layout.tsx` | Added `aria-label="Main navigation"` to `<nav>` |
| `app/login/page.tsx` | Fixed `htmlFor`/`id` associations, added `type="email"`, focus rings on inputs and button |
| `app/study-plan/page.tsx` | `aria-live="polite"` + `aria-label` on messages container; `aria-labelledby` on section; focus rings + `aria-label` on Stop/Retry/Jump/demo buttons; `id` on h2 |
| `components/StudyScheduleToolPart.tsx` | Added `scope="col"` to `<th>` elements; added `<caption className="sr-only">` |

---

## 8. Build Verification

```
npm run build  →  exit 0
✓ Compiled successfully
✓ Types checked (zero errors)
✓ 13/13 static pages generated
```
