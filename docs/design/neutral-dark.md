---
name: CodeCora UI, neutral-dark theme
description: The Plain Workbench after dark.
colors:
  surface: "oklch(18% 0.01 260)"
  surface-raised: "oklch(22% 0.01 260)"
  surface-sunken: "oklch(14% 0.008 260)"
  surface-hover: "oklch(27% 0.012 260)"
  border: "oklch(31% 0.012 260)"
  border-strong: "oklch(60% 0.014 260)"
  text: "oklch(94% 0.005 260)"
  text-muted: "oklch(73% 0.012 260)"
  danger: "#F87171"
  danger-text: "#0E1015"
  success: "#34D399"
  success-text: "#0E1015"
  warning: "#E89B3C"
  warning-text: "#0E1015"
  accent: "#7CB2FF"
  accent-hover: "#A3C8FF"
  accent-text: "#0E1015"
typography:
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  mono:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
---

# Design System: CodeCora UI, neutral-dark theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `neutral-dark` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Plain Workbench after dark"**

`neutral` in the dark scheme: graphite surfaces on the same 260° hue, near-white ink, the neutral blue accent at a lighter step. Its twin is `neutral`, so an app can follow `prefers-color-scheme` without changing brand.

**Key Characteristics:**
- Graphite surfaces, chroma under 0.015, hue 260.
- Sunken is darker than the page; raised is lighter.
- Accents use the dark set (L 80%) with dark text on fills.
- Same system fonts, radius and shape hooks as `neutral`.

## Colors

Colour scheme: dark. Default accent: `blue`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme.

Twin: `neutral` (the same brand in the other colour scheme).

## Shapes

Radius 4px for inline pieces, 8px for controls and cards, 12px for dialogs, pill for chips.

### Shape hooks

- Badge: pill, sentence case, system sans (as `neutral`).
- Focus ring: 2px, offset 2px.
- Selected table row: accent tint with a 2px bar.
