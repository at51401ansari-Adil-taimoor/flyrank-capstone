# Workflow Comparison: Vague vs. Precise Prompting

## Setup
Feature: Login and signup form (Next.js + TypeScript)
Round 1: `round-1-vague` branch, single prompt: "Build a login and signup form"
Round 2: `round-2-precise` branch, detailed prompt with file references, explicit 
validation rules, accessibility requirements, and a verification step (write tests, 
run them)

## Correctness
Round 1 produced a form with real client-side validation (required fields, email 
format, password length, password match), which was better than expected for a 
vague prompt. However, manual testing revealed a critical bug: the login form 
showed "Signed in successfully" for credentials that were never registered. There 
was no actual check against a user list, just a UI shell simulating success 
unconditionally.

Round 2 explicitly required a mock "registered users" check and correctly rejected 
unregistered credentials with a real error message, verified by an automated test. 
Round 1 had no tests at all, so its login bug would have shipped unnoticed without 
me manually testing it.

## Accessibility
Both rounds handled labels, keyboard tab order, and focus outlines correctly. This 
wasn't a strong differentiator, likely because React/Next.js form defaults are 
already reasonably accessible. Round 2 made this a guaranteed requirement via the 
prompt rather than relying on a lucky default.

## Edge cases and verification gaps
Round 1 accepted passwords with only letters and no complexity beyond length, an 
undocumented but acceptable choice, matched in round 2.

The most important finding wasn't in the code at all: while testing round 2, I 
initially saw the form submit as a native browser request (page reload, credentials 
in the URL), even though round 2's tests for "prevents native form submission" were 
passing. After reviewing the actual `onSubmit` handler code, `event.preventDefault()` 
was implemented correctly. The real cause was that I was testing on the network URL 
(192.168.56.1) instead of localhost, which Next.js handles differently in dev mode. 
On localhost, the form worked exactly as intended.

This was a useful reminder that "the test passes" and "I observed a bug" can both 
be true at once if the testing environment itself is inconsistent, and that 
verifying a fix means checking my own test conditions, not just re-reading the code.

## Review effort
Round 1 was faster to generate but required about 14 manual test cases to uncover 
its login bug, an unplanned and time-consuming step. Round 2 took longer to prompt 
and generate (explicit rules, mock auth, tests), but came with automated tests I 
could re-run instantly, and its one open bug (the fake native-submission issue) 
turned out to be a testing-environment mistake on my end, not a code defect. Round 
2 was slower upfront but required far less manual re-verification overall.

## Key takeaway
The biggest risk from vague prompting wasn't visual quality; round 1 looked fine. 
It was silent correctness gaps (fake login success) that only manual testing 
caught. Precise prompting with an explicit verification step (write it, then test 
it) surfaced and fixed that gap automatically. The one place round 2 still needed 
human judgment was distinguishing a real bug from a test-environment issue, which 
is a reminder that automated tests reduce but don't eliminate the need for manual 
review.