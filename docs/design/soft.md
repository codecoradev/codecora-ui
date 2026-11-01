---
name: CodeCora UI, soft theme
description: The Pebble.
colors:
  surface: "oklch(98% 0.008 30)"
  surface-raised: "oklch(99.5% 0.004 30)"
  surface-sunken: "oklch(95.5% 0.012 30)"
  surface-hover: "oklch(93% 0.016 30)"
  border: "oklch(89% 0.018 30)"
  border-strong: "oklch(55% 0.03 30)"
  text: "oklch(25% 0.025 30)"
  text-muted: "oklch(46% 0.03 30)"
  danger: "oklch(47% 0.18 27)"
  danger-text: "oklch(99% 0.004 27)"
  success: "oklch(46% 0.15 150)"
  success-text: "oklch(98% 0.006 150)"
  warning: "oklch(47% 0.1 70)"
  warning-text: "oklch(99% 0.004 70)"
  accent: "oklch(50% 0.17 295)"
  accent-hover: "oklch(44% 0.17 295)"
  accent-text: "oklch(99% 0.004 295)"
typography:
  body:
    fontFamily: "ui-rounded, 'Nunito', 'SF Pro Rounded', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  mono:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
rounded:
  sm: "8px"
  md: "14px"
  lg: "22px"
  pill: "999px"
---

# Design System: CodeCora UI, soft theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `soft` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Pebble"**

A friendly consumer face: blush paper on hue 30, large round corners, a rounded sans and thin icons. Floating layers lift on wide, faint shadows. For sign-up flows, settings and apps used by people who are not developers.

**Key Characteristics:**
- Blush paper with warm ink; no pure white or black.
- Rounded sans (`ui-rounded` on Apple platforms, then Nunito when the app loads it, then the system sans).
- Default accent `violet`; icon stroke 1.5.
- Tightest pair: success on its soft tint, 4.96:1.

## Colors

Colour scheme: light. Default accent: `violet`; every accent in `accentNames` is available through `data-accent` and passes the contrast check on this theme.

## Shapes

Radius 8px for inline pieces, 14px for controls and cards, 22px for dialogs, pill for chips.

### Shadows

Popovers and dialogs use wider, fainter drops than the default (35% and 45% of the scrim, blurred over `--cc-space-8` and `--cc-space-16`).

### Shape hooks

- Badge: pill, sentence case.
- Focus ring: 2px, offset 3px, so it clears the round corners.
- Selected table row: accent tint with a 3px bar.
