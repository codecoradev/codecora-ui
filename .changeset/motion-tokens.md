---
'@codecora/tokens': minor
---

Add motion tokens: `--cc-duration-instant` (70 ms) and `--cc-duration-slow` (400 ms) next to `fast` and `normal`, and the `--cc-ease-in-out`, `--cc-ease-exit` and `--cc-ease-spring` curves (`spring` is a `linear()` curve with a small overshoot). Under `prefers-reduced-motion` every duration is 0 ms and `spring` falls back to `--cc-ease-out`. The Tailwind preset adds `ease-cc-in-out`, `ease-cc-exit` and `ease-cc-spring`.
