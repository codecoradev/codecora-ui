---
'@codecora/tokens': minor
---

BREAKING: the themes declare the shadcn variable names (`--background`, `--card`, `--primary`, `--ring`, ...) and Tailwind's theme keys (`--radius-*`, `--font-*`, `--spacing-control*`, `--spacing-stack`, `--spacing-cell-*`, `--shadow-*`, `--ease-enter|exit|move|spring`) directly, and every other `--cc-*` name with a Tailwind home is removed; only `--cc-focus-*`, `--cc-icon-*`, `--cc-badge-*`, `--cc-row-marker`, `--cc-press-scale`, `--cc-duration-*` and `--cc-layer-*` keep the prefix (D13, #166). `theme.css` is the only stylesheet: `tokens.css`, `base.css`, `themes/*.css`, `tailwind.css` and `shadcn.css` are gone, as are `shadcnBridge` and `shadcnExtensions`. The type scale is Tailwind's, and `leading-heading` (1.2) is new. See the migration table in the README.
