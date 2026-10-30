---
'@codecora/tokens': minor
'@codecora/ui': patch
---

Add stacking tokens (`--cc-layer-*`) and theme-aware shadows (`--cc-shadow-popover`, `--cc-shadow-modal`), and read them in every overlay instead of literal numbers. Fixes the Progress bar transition, which read a duration token that does not exist.
