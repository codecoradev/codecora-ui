---
name: CodeCora UI, sepia theme
description: The Reading Room.
colors:
  surface: "oklch(95% 0.02 85)"
  surface-raised: "oklch(97% 0.015 85)"
  surface-sunken: "oklch(91% 0.025 85)"
  surface-hover: "oklch(89% 0.028 85)"
  border: "oklch(85% 0.03 80)"
  border-strong: "oklch(50% 0.04 70)"
  text: "oklch(28% 0.03 60)"
  text-muted: "oklch(43% 0.035 60)"
  danger: "oklch(47% 0.18 27)"
  danger-text: "oklch(99% 0.004 27)"
  success: "oklch(46% 0.15 150)"
  success-text: "oklch(98% 0.006 150)"
  warning: "oklch(47% 0.1 70)"
  warning-text: "oklch(99% 0.004 70)"
  accent: "oklch(47% 0.15 50)"
  accent-hover: "oklch(41% 0.14 50)"
  accent-text: "oklch(99% 0.004 50)"
typography:
  body:
    fontFamily: "'Source Serif 4', 'Iowan Old Style', Charter, Georgia, serif"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
rounded:
  sm: "3px"
  md: "6px"
  lg: "10px"
  pill: "999px"
---

# Design System: CodeCora UI, sepia theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `sepia` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Reading Room"**

A warm printed page for long text: cream paper on hue 85, brown-black ink on hue 60, a serif for body and headings, orange as the default accent. Built for documents, notes and help pages rather than dense tools.

**Key Characteristics:**
- Cream paper, brown-black ink; no pure white or black.
- Serif text (Source Serif 4 when the app loads it, then Iowan Old Style, Charter, Georgia).
- Default accent orange; every other accent stays AA.
- Tightest pair: success on its soft tint, 4.58:1.

## Colors

Colour scheme: light. Default accent: `orange`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme.

## Shapes

Radius 3px for inline pieces, 6px for controls and cards, 10px for dialogs, pill for chips.

### Shape hooks

- Badge: 3px corners, sentence case, slight tracking.
- Focus ring: 2px, offset 3px.
- Selected table row: accent tint with a 3px rule.
