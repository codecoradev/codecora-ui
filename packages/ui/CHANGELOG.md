# @codecora/ui

## 0.6.0

### Minor Changes

- 5aa4d30: Motion for the states that still cut between states, on the motion tokens and instant under reduced motion: `Button` and `IconButton` shrink to `--cc-press-scale` while pressed; the `RadioGroup` dot fades in and springs to size and its ring changes colour smoothly; a `Field` error fades in and settles; `Table` and `DataTable` rows ease their hover and selection fill; `Input` and `Textarea` ease the border and the invalid ring. The playground Motion page shows each one (#143).

### Patch Changes

- 23b4ee5: Fixes from the first real-browser axe scan. `@codecora/tokens`: the contrast check now also covers accent text on its own tint and on a sunken surface (badges, the current nav item, links in wells), and two themes failed it: `corin-light` has a slightly darker teal (`#0B6D66`, was `#0E7C74`, 4.0:1 on its tint) and `sepia` has a darker blue accent. `@codecora/ui`: a `Table` that scrolls names its region "<label> (scrollable)" instead of repeating the label, so a heading or section with the same words no longer makes two landmarks with one name; the new `regionLabel` prop sets another name (#141).

## 0.5.0

### Minor Changes

- d063cf4: `Table` (and so `DataTable`) is a labelled, focusable scroll region only while it overflows sideways, so a table that fits adds no tab stop. It is measured with a ResizeObserver, so it follows the viewport and the rows; until then, and without JavaScript, the wrapper is a plain element and the `<caption>` names the table. Tests that expected `role="region"` and `tabindex="0"` on every table need a table that overflows (#124).

### Patch Changes

- 298ede5: `AppShell`'s top bar is a `<header>` (the banner landmark), so the menu button, the mobile brand and the `header` snippet are inside a landmark and axe's `region` rule no longer fails on a phone-width page. It sits next to `<main>`, not inside it. A shell without a `header` snippet hides its bare top bar on a wide screen, so there is no empty landmark; on a phone it stays for the menu button (#128).
- 996cc0f: Tabs no longer draw a vertical scrollbar next to the tab list when every tab fits. The tabs sit 1px over the list's border, which made the list scroll vertically too; `overflow-y: hidden` removes that, and horizontal scrolling still works when the tabs do not fit (#123).

## 0.4.0

### Minor Changes

- 7f557e3: Motion for the components that still cut between states, on the existing motion tokens. Tooltip, DropdownMenu, Select and Combobox fade and scale in from their trigger and out on close; CommandPalette fades and drops in like Dialog. Accordion panels open to their measured height and the chevron turns. The Tabs underline slides to the selected tab. Checkbox fills and its check mark springs in. Slider keyboard steps glide and the thumb grows while held, with no lag while dragging. ToggleGroup and Pagination ease their fill and colour. Avatar images fade in once loaded, and Alert fades in when it appears. Under `prefers-reduced-motion` every one of them is instant.

### Patch Changes

- 5f73e9e: A fifth density token, `--cc-control-py`, sets the block padding of rows whose label can wrap: 0.5rem at comfortable (unchanged) and 0.25rem at compact. Checkbox, RadioGroup, Switch and Accordion rows use it, so at compact density a one-line row is 32 px like every other control instead of 36 to 40 px.

## 0.3.1

### Patch Changes

- 90c102e: CodeBlock and Kbd turn off font ligatures, so code renders the characters as typed in every theme: `<!--`, `->` and `!=` no longer merge into arrows or symbols in fonts with programming ligatures.
- 6652daf: CodeBlock: when the clipboard refuses, the button reads "Copy failed", the code is selected so the keyboard shortcut copies it, and the status region says so. Before, a failed copy reset to "Copy" without a word.

## 0.3.0

### Minor Changes

- 1846cd4: Dialog, ConfirmDialog, Sheet, Popover and Toast now animate out as well as in, with exits one step shorter than entries. The centred Dialog and Toast move on `--cc-ease-spring` while their opacity eases. Popover gains an entry animation. Needs the matching `@codecora/tokens` release; with older tokens the new animations are skipped.

### Patch Changes

- 6999016: Combobox colours its placeholder with `--cc-text-muted`, like Input and Textarea, instead of the browser default grey that fell below 4.5:1.

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
