---
'@codecora/ui': minor
'@codecora/memory': minor
---

BREAKING: the components read the shadcn variable names and Tailwind theme keys of `@codecora/tokens/theme.css` instead of the removed `--cc-*` tokens, and need the matching `@codecora/tokens` release (D13, #166). Text sizes use Tailwind's type scale: `text-xl`, `text-2xl` and `text-3xl` are smaller than the old `xl`, `2xl` and `3xl` steps, and headings set `leading-heading` (1.2) themselves. Override `--primary`, `--radius-md` and the other new names instead of `--cc-accent`, `--cc-radius-md`, ...

`cn()` keeps a `leading-*` class when a `text-*` size follows it, as Tailwind 4 renders them (the line height wins either way); `text-lg/7` still replaces it. The override is exported as `twMergeOverride`.
