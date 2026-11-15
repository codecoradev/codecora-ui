---
'@codecora/tokens': minor
---

New `@codecora/tokens/theme.css` for Tailwind 4 (D13, #158): every theme with its token layers inside Tailwind's `base` layer, the shadcn variable names plus `primary-hover`, `primary-soft`, `destructive-soft`, `success`, `warning` and `overlay`, `@theme inline` keys (radius, fonts, density sizes such as `h-control`, shadows, `ease-enter|exit|move|spring`), `duration-*` and `z-*` utilities, and a `dark` variant for the dark themes. The names read the `--cc-*` tokens during the migration. Exports `themeVariables`, `shadcnExtensions`, `tailwindKeys` and `tailwindUtilities`.
