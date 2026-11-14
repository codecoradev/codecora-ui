---
'@codecora/ui': minor
'@codecora/tokens': minor
---

Field, FieldGroup, Input, Textarea, Checkbox, RadioGroup, Switch, Slider, Select, Combobox and ToggleGroup are written with Tailwind utilities and need Tailwind 4 with `@codecora/tokens/theme.css` and `@codecora/ui/source.css` (D13, #161); they look the same. `theme.css` adds the `font-inherit` utility and the `animate-error-in`, `animate-dot-in`, `animate-listbox-in` and `animate-listbox-out` animations (exported as `formAnimations`).
