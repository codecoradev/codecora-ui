---
name: CodeCora UI, neutral-cvd theme
description: The Plain Workbench, colour-blind safe.
colors:
  surface: "oklch(98.5% 0.003 260)"
  surface-raised: "oklch(99.6% 0.001 260)"
  surface-sunken: "oklch(96.2% 0.005 260)"
  surface-hover: "oklch(93.6% 0.007 260)"
  border: "oklch(90% 0.008 260)"
  border-strong: "oklch(55% 0.012 260)"
  text: "oklch(22% 0.012 260)"
  text-muted: "oklch(45% 0.014 260)"
  danger: "oklch(50% 0.16 40)"
  danger-text: "oklch(99% 0.004 40)"
  success: "oklch(48% 0.13 245)"
  success-text: "oklch(99% 0.004 245)"
  warning: "oklch(47% 0.1 70)"
  warning-text: "oklch(99% 0.004 70)"
  accent: "oklch(50% 0.17 295)"
  accent-hover: "oklch(44% 0.17 295)"
  accent-text: "oklch(99% 0.004 295)"
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

# Design System: CodeCora UI, neutral-cvd theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `neutral-cvd` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Plain Workbench, colour-blind safe"**

`neutral` for people with red/green colour vision deficiency (deuteranopia, protanopia). Surfaces, type and shapes match `neutral`; the status pair that collides for them is replaced after the Okabe-Ito palette: success is blue and danger is vermillion.

**Key Characteristics:**
- Success `oklch(48% 0.13 245)`, danger `oklch(50% 0.16 40)`; warning stays amber and differs from danger in hue and chroma.
- Default accent `violet`, so the accent never reads as success. `data-accent="blue"` still works, but brings the accent close to success.
- Status still carries an icon or a label as well as colour, as in every theme.
- Tightest pair: danger on its soft tint, 4.97:1.

## Colors

Colour scheme: light. Default accent: `violet`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme.

## Shapes

Radius as in `neutral`: 4px, 8px, 12px, pill.

### Shape hooks

- Badge: pill, sentence case.
- Focus ring: 2px, offset 2px.
- Selected table row: accent tint with a 3px bar, one pixel heavier than `neutral`, so selection leans less on hue.
