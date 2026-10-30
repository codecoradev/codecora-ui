---
'@codecora/ui': minor
---

Harden error states: `Field` marks an error with an icon and a screen-reader "Error:" prefix and passes `required` to the control; invalid `Input`, `Textarea` and `Select` get a stronger border; `Select` takes `required`; `Button` takes `loadingLabel`. `ConfirmDialog` forwards `theme`, emphasises the irreversible sentence and focuses Cancel first for `tone="danger"`, and takes an optional `confirmText` the user must type.
