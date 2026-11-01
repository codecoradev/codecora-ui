---
name: CodeCora UI, slab theme
description: The Proof Sheet.
colors:
  surface: "oklch(97% 0.006 90)"
  surface-raised: "oklch(100% 0 0)"
  surface-sunken: "oklch(93% 0.008 90)"
  surface-hover: "oklch(90% 0.01 90)"
  border: "oklch(30% 0.004 90)"
  border-strong: "oklch(18% 0.003 90)"
  text: "oklch(16% 0.003 90)"
  text-muted: "oklch(38% 0.006 90)"
  danger: "oklch(47% 0.18 27)"
  danger-text: "oklch(99% 0.004 27)"
  success: "oklch(46% 0.15 150)"
  success-text: "oklch(98% 0.006 150)"
  warning: "oklch(47% 0.1 70)"
  warning-text: "oklch(99% 0.004 70)"
  accent: "oklch(47% 0.17 275)"
  accent-hover: "oklch(41% 0.16 275)"
  accent-text: "oklch(99% 0.004 275)"
typography:
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  display:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
rounded:
  sm: "0"
  md: "0"
  lg: "0"
  pill: "999px"
---

# Design System: CodeCora UI, slab theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `slab` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Proof Sheet"**

Brutalist print: bone paper, black ink, rules drawn in ink rather than grey, square corners and headings set in a monospace. Floating layers cast a hard offset shadow in the text colour, like a block laid on the page. For tools and marketing pages that want an opinion.

**Key Characteristics:**
- Bone paper (hue 90) with white raised panels; hairlines and control borders are near-black.
- Display font JetBrains Mono; body stays the system sans for reading.
- Default accent `indigo`; heavy icons (stroke 2.25).
- Tightest pair: success on its soft tint, 4.84:1.

## Colors

Colour scheme: light. Default accent: `indigo`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme.

## Shapes

Radius 0 for inline pieces, controls, cards and dialogs. The pill radius stays round, so radios, switches and avatars keep the shapes that tell them apart from checkboxes and squares.

### Shadows

The only theme that sets `shadow`: popovers cast `var(--cc-space-1)` and dialogs `var(--cc-space-2)` down and right, with no blur, in `--cc-text`. Resting surfaces stay flat (the Tone Before Shadow Rule).

### Shape hooks

- Badge: square, uppercase mono with 0.04em tracking.
- Focus ring: 3px, offset 2px.
- Selected table row: accent tint with a 4px bar.
