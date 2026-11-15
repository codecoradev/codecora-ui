---
name: CodeCora UI, dimmed theme
description: Low Light.
colors:
  background: "oklch(27% 0.013 255)"
  card: "oklch(30% 0.014 255)"
  muted: "oklch(23% 0.012 255)"
  accent: "oklch(34% 0.015 255)"
  border: "oklch(39% 0.015 255)"
  input: "oklch(64% 0.015 255)"
  foreground: "oklch(88% 0.008 255)"
  muted-foreground: "oklch(77% 0.012 255)"
  destructive: "oklch(75% 0.12 25)"
  destructive-foreground: "oklch(23% 0.012 255)"
  success: "oklch(76% 0.11 155)"
  success-foreground: "oklch(23% 0.012 255)"
  warning: "oklch(80% 0.1 75)"
  warning-foreground: "oklch(23% 0.012 255)"
  primary: "oklch(77% 0.1 255)"
  primary-hover: "oklch(83% 0.08 255)"
  primary-foreground: "oklch(23% 0.012 255)"
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

# Design System: CodeCora UI, dimmed theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `dimmed` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "Low Light"**

A dark for long sessions and dim rooms that never goes near black: mid-grey surfaces on hue 255, text at 88% lightness instead of near-white, and a lower-chroma accent set so nothing glows. Less glare than `neutral-dark` and `corin`, still AA everywhere.

**Key Characteristics:**
- Surfaces from 23% to 34% lightness; the page sits at 27%.
- Text softened to 88%; muted text at 77%.
- Its own accent and status set (`lowGlare`), about two thirds the chroma of the other dark themes.
- Tightest pair: danger on its soft tint, 5.02:1.

## Colors

Colour scheme: dark. Default accent: `blue`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme. Text on an accent fill uses the darkest surface step.

## Shapes

Radius 4px for inline pieces, 8px for controls and cards, 12px for dialogs, pill for chips, as in `neutral`.

### Shape hooks

- Badge: pill, sentence case.
- Focus ring: 3px, offset 2px; thicker than `neutral` because the surfaces sit closer to the ring in lightness.
- Selected table row: accent tint with a 2px bar.
