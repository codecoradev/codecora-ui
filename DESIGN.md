---
name: CodeCora UI
description: One design system, many themes; product identity on shared structure and accessibility.
rounded:
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "16": "4rem"
---

# Design System: CodeCora UI

This file holds the rules every theme shares. Each theme records its own colours, type and shapes in its own file:

| Theme | North Star | File |
|---|---|---|
| `neutral` (default) | The Plain Workbench | [docs/design/neutral.md](docs/design/neutral.md) |
| `uteke` | The Field Notebook | [docs/design/uteke.md](docs/design/uteke.md) |
| `corin` | The Night Console | [docs/design/corin.md](docs/design/corin.md) |
| `neutral-dark` | The Plain Workbench after dark | [docs/design/neutral-dark.md](docs/design/neutral-dark.md) |
| `uteke-dark` | The Field Notebook by lamplight | [docs/design/uteke-dark.md](docs/design/uteke-dark.md) |
| `sepia` | The Reading Room | [docs/design/sepia.md](docs/design/sepia.md) |
| `contrast` | High Beam | [docs/design/contrast.md](docs/design/contrast.md) |

The token source of truth is `packages/tokens/src` ([README](packages/tokens/README.md)); these files describe it and must not contradict it. Product context lives in [PRODUCT.md](PRODUCT.md).

## Overview

**Creative North Star: "One Frame, Many Faces"**

Every CodeCora product stands on the same frame: the same structure, spacing, states, keyboard behaviour and contrast floor. A theme is the face on that frame: colour, fonts, radius, density and icon weight. Themes mix per element, so a dark `corin` panel can sit inside a light `uteke` page and both stay correct.

**Key Characteristics:**
- Semantic tokens only (`--cc-surface`, `--cc-text`, `--cc-accent`, ...); components never see a raw colour.
- One accent per scope, chosen with `data-accent`; status colours carry meaning, never decoration.
- Two densities, `comfortable` (44px controls) and `compact` (32px), switched with `data-density`.
- Flat surfaces separated by tone; shadows are reserved for floating layers.

## Colors

Each theme defines the same roles; values differ per theme.

- **Surfaces:** `surface` (the page), `surface-raised` (cards, inputs, popovers), `surface-sunken` (wells, sidebars, table headers), `surface-hover` (hover tint).
- **Lines:** `border` is a decorative hairline; `border-strong` marks a control's boundary at 3:1.
- **Text:** `text` and `text-muted`, both at least 4.5:1 on every surface.
- **Accent:** `accent` (fill, link, selection), `accent-hover`, `accent-text` (label on the fill), `focus` (ring), `accent-soft` (selected-row tint).
- **Status:** `danger`, `success`, `warning`, each with `-text` (label on the fill) and `-soft` (tint behind status text).

### Named Rules
**The Semantic Only Rule.** Components read `--cc-*` tokens and nothing else. A raw colour outside `packages/tokens` is a defect.

**The Meaning Before Hue Rule.** Accent means "act here" or "you are here"; status colours mean their status. Neither decorates.

**The AA Floor Rule.** Every theme and accent passes WCAG 2.2 AA for the pairs listed in the tokens README; `bun run contrast` and the unit tests enforce it.

## Typography

Each theme names three families: `--cc-font-sans` (UI and body), `--cc-font-display` (headings) and `--cc-font-mono` (data). The type scale is shared: `--cc-font-size-xs` 0.75rem, `sm` 0.875rem, `md` 1rem, `lg` 1.125rem, `xl` 1.375rem, `2xl` 1.75rem, `3xl` 2.25rem; line height 1.2 for headings and 1.5 for text.

### Named Rules
**The Tabular Data Rule.** IDs, dates, counts and any number that changes use the mono family with tabular figures.

## Layout

A 4px-based spacing scale (`--cc-space-1` to `--cc-space-16`). Controls, gaps and table cells take their size from the density tokens (`--cc-control-h`, `--cc-control-px`, `--cc-gap`, `--cc-cell-py`, `--cc-cell-px`), never from hard-coded values. Every component works at 375px wide without horizontal scrolling.

## Elevation & Depth

Flat by default. Depth comes from tone: sunken, base, raised and hover are small lightness steps. Shadows are for layers that float above the page (popovers, dialogs, toasts), which arrive with the components in M1.

### Named Rules
**The Tone Before Shadow Rule.** Separate resting surfaces with surface tokens; use a shadow only when something floats.

## Shapes

Radius comes from the theme: `--cc-radius-sm` for inline pieces (kbd, code), `--cc-radius-md` for controls and cards, `--cc-radius-lg` for dialogs and sheets, `--cc-radius-pill` for badges and chips.

## Components

Components arrive in M1 (`@codecora/ui`). The shared behaviour they must follow:

- **Focus:** a 2px `--cc-focus` outline offset 2px on `:focus-visible`, on every interactive element.
- **Motion:** state changes use `--cc-duration-fast` with `--cc-ease-out`; durations drop to 0ms under `prefers-reduced-motion`.
- **Icons:** stroke and size come from `--cc-icon-stroke` and `--cc-icon-size`.
- **Selected states** change at least two things (for example fill and weight), never colour alone.

## Do's and Don'ts

### Do:
- **Do** set `data-theme` on the element that should change, not on every child.
- **Do** use `border-strong` wherever the border is the only cue that a control exists.

### Don't:
- **Don't** write a colour literal in a component, a playground page or an app override.
- **Don't** rely on colour alone to show state or meaning.
- **Don't** add product-specific tokens to a shared theme; a product theme carries them.
