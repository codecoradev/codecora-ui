# @codecora/tokens

## 0.7.0

### Minor Changes

- 5aa4d30: A press token: `--cc-press-scale` (0.98), exported as `press` (`press.scale`). A pressed control scales to it, and under `prefers-reduced-motion` it is 1, so a press changes nothing there (#143).
- 936b05c: New `tagfold` theme, the identity of the tagfold stock-photo tagging client: near-black slate that steps up in tone, one mint accent (`#7EE0A3`, dark ink on every fill, riding the `green` accent slot like gaira's volt) that is also the success colour, amber and red for status only, 9px controls and 12px cards, system fonts with mono badges. Dark only. `border-strong` is a lighter `#70708A` than tagfold's own `#4A4A57`, which is 1.9:1 on the well and fails the 3:1 a control boundary needs; `docs/design/tagfold.md` says so (#140).

### Patch Changes

- 23b4ee5: Fixes from the first real-browser axe scan. `@codecora/tokens`: the contrast check now also covers accent text on its own tint and on a sunken surface (badges, the current nav item, links in wells), and two themes failed it: `corin-light` has a slightly darker teal (`#0B6D66`, was `#0E7C74`, 4.0:1 on its tint) and `sepia` has a darker blue accent. `@codecora/ui`: a `Table` that scrolls names its region "<label> (scrollable)" instead of repeating the label, so a heading or section with the same words no longer makes two landmarks with one name; the new `regionLabel` prop sets another name (#141).

## 0.6.0

### Minor Changes

- 72fc73d: New `corin-light` theme: Corin's warm-paper light palette as the light twin of `corin`, with the same teal accent, radii, fonts and shape hooks (`data-theme="corin-light"`, `themes/corin-light.css`). It passes WCAG AA for every accent. Corin's own light red, green, amber and muted border fail AA, so those four are darkened at Corin's hue angles; `docs/design/corin-light.md` lists them. `corin` now names `corin-light` as its `twin` (#129).

## 0.5.1

### Patch Changes

- 1d3d4b8: New `gaira` theme: ink surfaces, the volt accent (`#D4FF3A`, in the `green` accent slot) with ink text on every fill, teal success, Inter and JetBrains Mono. Dark only.

## 0.5.0

### Minor Changes

- beeba37: The shadcn bridge maps `--chart-1` to `--chart-5` (accent, success, warning, danger, muted text), so charts in shadcn-svelte apps follow the theme. The map is exported as `shadcnBridge`; the registry's `cc-theme` item writes the same map into an app's `:root` and `.dark`.

## 0.4.0

### Minor Changes

- 5f73e9e: A fifth density token, `--cc-control-py`, sets the block padding of rows whose label can wrap: 0.5rem at comfortable (unchanged) and 0.25rem at compact. Checkbox, RadioGroup, Switch and Accordion rows use it, so at compact density a one-line row is 32 px like every other control instead of 36 to 40 px.

## 0.3.0

### Minor Changes

- 5d9bcb6: Add the `orange`, `indigo` and `cyan` accents to every theme (`data-accent="orange|indigo|cyan"`), each meeting WCAG AA on the theme surfaces.
- 32a6c54: The `contrast` theme uses square corners (radius `sm` 2px, `md` 4px, `lg` 6px) so its outlines read as edges.
- 1846cd4: Add motion tokens: `--cc-duration-instant` (70 ms) and `--cc-duration-slow` (400 ms) next to `fast` and `normal`, and the `--cc-ease-in-out`, `--cc-ease-exit` and `--cc-ease-spring` curves (`spring` is a `linear()` curve with a small overshoot). Under `prefers-reduced-motion` every duration is 0 ms and `spring` falls back to `--cc-ease-out`. The Tailwind preset adds `ease-cc-in-out`, `ease-cc-exit` and `ease-cc-spring`.
- 0b97143: Add four themes: `neutral-dark` and `uteke-dark` (dark twins of `neutral` and `uteke`), `sepia` (a serif reading theme) and `contrast` (7:1 text, heavier rings and icons). Themes gain `twin`, naming the same brand in the other colour scheme, and `minText`, which raises the contrast check for body and muted text.
- b2f2222: Add four themes with range beyond colour: `dimmed` (low-glare mid-grey dark with quieter accents), `slab` (brutalist print: square corners, mono headings, hard offset shadows), `soft` (round corners, rounded sans, thin icons) and `neutral-cvd` (`neutral` with blue success and vermillion danger for red/green colour vision deficiency). Themes gain an optional `shadow` for floating layers; `--cc-shadow-popover` and `--cc-shadow-modal` now come from the theme and are listed in `semanticTokens`.

## 0.2.0

### Minor Changes

- 119242a: Add stacking tokens (`--cc-layer-*`) and theme-aware shadows (`--cc-shadow-popover`, `--cc-shadow-modal`), and read them in every overlay instead of literal numbers. Fixes the Progress bar transition, which read a duration token that does not exist.
- 15aa581: Themes can now set structural hooks beyond colour: badge shape, case and font, focus-ring width and offset, and the marker on a selected table row. `uteke` and `corin` use them to look distinct from `neutral`; every component's focus ring reads the new tokens.

## 0.1.0

### Minor Changes

- ac5496e: First release: primitive, semantic and theme tokens with the `neutral`, `uteke` and `corin` themes, `data-accent` and `data-density` modifiers, a Tailwind 4 preset and a shadcn-svelte bridge.
