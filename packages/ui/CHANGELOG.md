# @codecora/ui

## 0.2.0

### Minor Changes

- 72a0960: Add `Combobox` (type to filter), `Slider` and `FieldGroup` (legend, hint and error around radios or checkboxes).
- eacfcf4: Add `CommandPalette`: type to jump or run an action, grouped items with keywords and shortcut hints, opened with Cmd or Ctrl plus a key.
- b339ca5: Add `DataTable`: sortable columns with `aria-sort`, row selection with a mixed header state, a bulk-action bar, client-side paging, and loading and empty states. `Checkbox` gains `labelHidden` and `onchange`.
- 9f9ab38: Add `Card`, `Alert`, `Avatar`, `Progress`, `Separator`, `Kbd`, `Link` and `CodeBlock`. Alerts pair tone with an icon, external links open safely and say so, and the code block copies with a polite announcement.
- 9421a33: Add `Checkbox` (with a mixed state), `Switch` and `RadioGroup`, built on bits-ui and styled with the theme tokens, plus a `minus` glyph.
- c294c13: Add `Breadcrumb`, `Accordion`, `ToggleGroup`, `Pagination`, `Popover` and `DropdownMenu`, built on bits-ui with keyboard support and the theme focus ring.
- 15aa581: Themes can now set structural hooks beyond colour: badge shape, case and font, focus-ring width and offset, and the marker on a selected table row. `uteke` and `corin` use them to look distinct from `neutral`; every component's focus ring reads the new tokens.

### Patch Changes

- 119242a: Add stacking tokens (`--cc-layer-*`) and theme-aware shadows (`--cc-shadow-popover`, `--cc-shadow-modal`), and read them in every overlay instead of literal numbers. Fixes the Progress bar transition, which read a duration token that does not exist.

## 0.1.0

### Minor Changes

- ba285ae: Add `AppShell` and `Sidebar`: a grouped, collapsible sidebar with brand and footer slots on desktop; a drawer and a bottom bar of up to 5 items on narrow screens; a skip link; and a per-region theme for the sidebar. `Sheet` and `Dialog` accept a `theme` for their portalled panel.
- 5c3f9e1: First primitive set on bits-ui: Button, IconButton, Field, Input, Textarea, Select, Dialog, ConfirmDialog, Sheet, Tabs, Table, Badge, Toaster with `toast`, Tooltip, EmptyState, Skeleton and Spinner. Plain CSS on semantic tokens; icons are passed as props.
- a08bec9: Harden error states: `Field` marks an error with an icon and a screen-reader "Error:" prefix and passes `required` to the control; invalid `Input`, `Textarea` and `Select` get a stronger border; `Select` takes `required`; `Button` takes `loadingLabel`. `ConfirmDialog` forwards `theme`, emphasises the irreversible sentence and focuses Cancel first for `tone="danger"`, and takes an optional `confirmText` the user must type.

### Patch Changes

- d4cdbc2: Audit fixes: toasts pause while hovered or focused, a disabled tab is visibly different from an unselected one, and `Skeleton` pulses with opacity instead of animating a background position.
