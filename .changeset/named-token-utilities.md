---
'@codecora/tokens': minor
'@codecora/ui': patch
'@codecora/memory': patch
---

`theme.css` adds named utilities for the CodeCora-only tokens: `outline-focus`, `outline-offset-focus`, `stroke-icon`, `scale-press` and `case-badge`, plus the theme keys `rounded-badge`, `font-badge` and `tracking-badge` (#180). The components use them in place of arbitrary values such as `outline-[length:var(--cc-focus-width)]`; the rendered CSS is the same. `cn()` merges them with Tailwind's utilities of the same group (`outline-2` replaces `outline-focus`).
