# NOTES.md

Comparison between the three hand-built components in `playground/` and their
equivalent shadcn/ui components (built on Base UI primitives).

## Modal vs shadcn's Dialog

shadcn's `dialog.tsx` is a thin, styled wrapper around Base UI's `Dialog`
primitive. Most of the actual ARIA and focus-management logic lives inside
that primitive, not in the file shadcn generates, which is itself a useful
observation: shadcn's real value is delegating the hard, easy-to-get-wrong
behavior to a tested primitive, while keeping the styling layer fully
readable and editable.

Concrete gaps found between my Modal and shadcn's Dialog:

1. **No portal rendering.** shadcn wraps its dialog in `<DialogPortal>`, so
   it always renders at the document root, escaping any parent's
   `overflow: hidden` or z-index stacking context. My Modal renders inline
   wherever it is placed in the tree, so a parent with `overflow: hidden`
   could visually clip it.

2. **Stale focusable-elements list.** My Modal computes its list of
   focusable elements once, in a `useEffect` when the modal opens, and
   caches it in state. If the modal's content changes while open, the
   Tab-trap logic will not know about new focusable elements, it is working
   off a stale snapshot. A more robust version would query focusable
   elements live, at the moment Tab is pressed.

3. **No background `inert` or `aria-hidden`.** My Modal relies entirely on
   the visual overlay and JS-based focus trapping. It does not mark the
   rest of the page as `inert` or `aria-hidden="true"` while open, so some
   screen reader browsing modes (not just sequential Tab) could still reach
   content behind the modal, even though sighted keyboard users cannot.

4. **No description slot.** shadcn provides a dedicated `DialogDescription`
   component that automatically wires `aria-describedby`. My Modal only
   supports a title via `aria-labelledby`, there is no built-in way to
   associate longer descriptive text for screen readers.

5. **Escape handling is scoped to one DOM node.** My `handleKeyDown` is
   attached via `onKeyDown` on the modal's inner div, so it only fires if
   focus is currently inside that specific element. Base UI's primitive
   almost certainly listens higher up (likely at the document level), so
   Escape works reliably regardless of exactly where focus has ended up, a
   more defensive approach against edge cases I did not account for.

## Tabs vs shadcn's Tabs

1. **No orientation support.** shadcn's `Tabs` accepts an `orientation`
   prop and, per the underlying Base UI primitive, swaps ArrowUp and
   ArrowDown for ArrowLeft and ArrowRight when vertical, matching the W3C
   spec's vertical tabs variant. My Tabs hardcodes horizontal-only arrow
   key behavior and has no concept of orientation at all.

2. **No disabled tab support.** shadcn's `TabsTrigger` has built-in styling
   and ARIA hooks for a disabled state. My Tabs has no `disabled` prop, so
   there is no way to skip a disabled tab during arrow-key navigation, it
   was never built to handle that case.

3. **All panel content mounts eagerly.** My `TabsContent` divs are always
   present in the DOM, just toggled with the `hidden` attribute. This means
   inactive tabs' content, including any child components or effects,
   still executes even when not visible. Base UI's Panel primitive very
   likely supports lazy mounting, only rendering a panel's contents once it
   becomes active, which matters for performance on content-heavy tabs.

4. **No configurable activation mode.** My Tabs always immediately
   activates a tab the moment you arrow-navigate to it (automatic
   activation). The W3C ARIA spec describes two valid patterns, automatic
   activation and manual activation (arrow keys move focus only,
   activating requires Enter or Space, useful when switching tabs is
   expensive). Base UI's primitive typically supports both via a prop,
   mine only supports one, and it is hardcoded.

## Disclosure

shadcn/ui does not ship a standalone Disclosure primitive (the closest
equivalent, Accordion, is a related but distinct pattern with grouped,
often mutually-exclusive expand/collapse behavior). My Disclosure component
follows the plain W3C Disclosure pattern directly: a single toggle button
with `aria-expanded`, controlling one content region via `aria-controls`,
with the content removed from the tab order while collapsed. Since there
was no direct shadcn equivalent to install and compare against for this
one, this component was verified purely against the W3C spec and manual
keyboard testing.

## Overall takeaway

The biggest gap across all three is not any single missing ARIA attribute,
it is that hand-rolled components tend to handle the happy path correctly
but miss edge cases (stale state, content mounting behavior, orientation,
disabled states) that a maintained primitive has already had to solve for
a much wider range of real-world usage. Reading shadcn's source made clear
that a lot of its real value is not the visual styling, it is standing on
top of Base UI's primitives, which quietly handle the harder, easier to
get wrong behavior.