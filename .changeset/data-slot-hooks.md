---
'@codecora/ui': minor
'@codecora/memory': minor
'@codecora/icons': minor
'@codecora/brand': minor
---

BREAKING: components mark their parts with `data-slot` and data attributes instead of `cc-*` hook classes, as shadcn v4 does. A part hook becomes `data-slot="<part>"` on the same element (`cc-button` → `data-slot="button"`, `cc-glyph` → `data-slot="glyph"`, `cc-icon` → `data-slot="icon"`, `cc-mark` → `data-slot="mark"`), and a variant hook becomes a data attribute named after the prop it reflects (`data-variant`, `data-tone`, `data-size`, `data-side`, plus the flags `data-danger` on a destructive menu item and `data-step` on the pagination arrows; orientation uses bits-ui's own `data-orientation`). A `data-slot` or variant attribute passed by the caller replaces the component's own, as in shadcn. Nothing looks different. To migrate, rewrite selectors that target the classes: `.cc-button` → `[data-slot=button]`, `.cc-button-primary` → `[data-slot=button][data-variant=primary]`, `[&_.cc-glyph]:text-primary` → `[&_[data-slot=glyph]]:text-primary`. Keyframe names (`cc-fade-in`) and `--cc-*` variables are unchanged.
