# @codecora/tokens

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
