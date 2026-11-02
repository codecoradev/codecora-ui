---
'@codecora/tokens': minor
---

The shadcn bridge maps `--chart-1` to `--chart-5` (accent, success, warning, danger, muted text), so charts in shadcn-svelte apps follow the theme. The map is exported as `shadcnBridge`; the registry's `cc-theme` item writes the same map into an app's `:root` and `.dark`.
