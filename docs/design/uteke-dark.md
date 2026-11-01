---
name: CodeCora UI, uteke-dark theme
description: The Field Notebook by lamplight.
colors:
  surface: "oklch(19% 0.012 155)"
  surface-raised: "oklch(23% 0.012 155)"
  surface-sunken: "oklch(15% 0.012 155)"
  surface-hover: "oklch(28% 0.014 155)"
  border: "oklch(32% 0.014 155)"
  border-strong: "oklch(61% 0.02 150)"
  text: "oklch(94% 0.012 150)"
  text-muted: "oklch(74% 0.02 150)"
  danger: "#F87171"
  danger-text: "#0E1015"
  success: "#34D399"
  success-text: "#0E1015"
  warning: "#E89B3C"
  warning-text: "#0E1015"
  accent: "#34D399"
  accent-hover: "#6EE7B7"
  accent-text: "#0E1015"
typography:
  body:
    fontFamily: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  pill: "999px"
---

# Design System: CodeCora UI, uteke-dark theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `uteke-dark` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Field Notebook by lamplight"**

`uteke` in the dark scheme: green-black paper on hue 155, warm near-white ink, the notebook green at a lighter step. Fonts and label shapes stay those of `uteke`. Its twin is `uteke`.

**Key Characteristics:**
- Green-black surfaces, hue 155, never pure black.
- Space Grotesk headings, Geist body, JetBrains Mono figures.
- Accents use the dark set (L 80%) with dark text on fills.
- Uppercase tracked badges and the 3px margin-mark row marker, as in `uteke`.

## Colors

Colour scheme: dark. Default accent: `green`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme.

Twin: `uteke` (the same brand in the other colour scheme).

## Shapes

Radius 4px for inline pieces, 6px for controls and cards, 10px for dialogs, pill for chips.

### Shape hooks

- Badge: 4px corners, uppercase with 0.06em tracking.
- Focus ring: 2px, offset 3px.
- Selected table row: accent tint with a 3px rule.
