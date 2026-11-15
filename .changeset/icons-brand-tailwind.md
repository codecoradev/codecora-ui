---
'@codecora/icons': minor
'@codecora/brand': minor
---

BREAKING: `Icon` and `Mark` are written with Tailwind 4 utilities instead of a scoped `<style>` block (#184). Apps run Tailwind 4 with `@codecora/tokens/theme.css` and import `@codecora/icons/source.css` and `@codecora/brand/source.css` after `tailwindcss`; `Icon` no longer falls back to 1.25rem and stroke 2 without the tokens. The rendered result is the same.
