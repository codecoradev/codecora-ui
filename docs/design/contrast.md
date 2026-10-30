---
name: CodeCora UI, contrast theme
description: High Beam.
colors:
  surface: "oklch(100% 0 0)"
  surface-raised: "oklch(100% 0 0)"
  surface-sunken: "oklch(96% 0 0)"
  surface-hover: "oklch(92% 0 0)"
  border: "oklch(55% 0 0)"
  border-strong: "oklch(35% 0 0)"
  text: "oklch(15% 0 0)"
  text-muted: "oklch(32% 0 0)"
  danger: "oklch(47% 0.18 27)"
  danger-text: "oklch(99% 0.004 27)"
  success: "oklch(46% 0.15 150)"
  success-text: "oklch(98% 0.006 150)"
  warning: "oklch(47% 0.1 70)"
  warning-text: "oklch(99% 0.004 70)"
  accent: "oklch(50% 0.16 260)"
  accent-hover: "oklch(44% 0.16 260)"
  accent-text: "oklch(99% 0.003 260)"
typography:
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  mono:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
rounded:
  sm: "3px"
  md: "6px"
  lg: "8px"
  pill: "999px"
---

# Design System: CodeCora UI, contrast theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `contrast` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "High Beam"**

Nothing is ambiguous: white paper, near-black ink and greys that hold 7:1 for body and muted text, heavier icons, a 3px focus ring and a 4px selected-row bar. For people who need it and for bright rooms.

**Key Characteristics:**
- Text and muted text at 7:1 or more (`minText: 7` in the theme, enforced by the contrast check).
- Control borders at 35% lightness, well above 3:1.
- Icon stroke 2.25 so glyphs read at small sizes.
- System fonts; colour never carries meaning alone.

## Colors

Colour scheme: light. Default accent: `blue`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme.

## Shapes

Radius 3px for inline pieces, 6px for controls and cards, 8px for dialogs, pill for chips.

### Shape hooks

- Badge: 3px corners, uppercase with 0.06em tracking.
- Focus ring: 3px, offset 2px.
- Selected table row: accent tint with a 4px bar.
