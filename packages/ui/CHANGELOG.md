# @codecora/ui

## 0.1.0

### Minor Changes

- ba285ae: Add `AppShell` and `Sidebar`: a grouped, collapsible sidebar with brand and footer slots on desktop; a drawer and a bottom bar of up to 5 items on narrow screens; a skip link; and a per-region theme for the sidebar. `Sheet` and `Dialog` accept a `theme` for their portalled panel.
- 5c3f9e1: First primitive set on bits-ui: Button, IconButton, Field, Input, Textarea, Select, Dialog, ConfirmDialog, Sheet, Tabs, Table, Badge, Toaster with `toast`, Tooltip, EmptyState, Skeleton and Spinner. Plain CSS on semantic tokens; icons are passed as props.
- a08bec9: Harden error states: `Field` marks an error with an icon and a screen-reader "Error:" prefix and passes `required` to the control; invalid `Input`, `Textarea` and `Select` get a stronger border; `Select` takes `required`; `Button` takes `loadingLabel`. `ConfirmDialog` forwards `theme`, emphasises the irreversible sentence and focuses Cancel first for `tone="danger"`, and takes an optional `confirmText` the user must type.

### Patch Changes

- d4cdbc2: Audit fixes: toasts pause while hovered or focused, a disabled tab is visibly different from an unselected one, and `Skeleton` pulses with opacity instead of animating a background position.
