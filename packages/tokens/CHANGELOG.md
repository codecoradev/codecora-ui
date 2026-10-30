# @codecora/tokens

## 0.2.0

### Minor Changes

- 119242a: Add stacking tokens (`--cc-layer-*`) and theme-aware shadows (`--cc-shadow-popover`, `--cc-shadow-modal`), and read them in every overlay instead of literal numbers. Fixes the Progress bar transition, which read a duration token that does not exist.
- 15aa581: Themes can now set structural hooks beyond colour: badge shape, case and font, focus-ring width and offset, and the marker on a selected table row. `uteke` and `corin` use them to look distinct from `neutral`; every component's focus ring reads the new tokens.

## 0.1.0

### Minor Changes

- ac5496e: First release: primitive, semantic and theme tokens with the `neutral`, `uteke` and `corin` themes, `data-accent` and `data-density` modifiers, a Tailwind 4 preset and a shadcn-svelte bridge.
