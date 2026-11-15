---
name: CodeCora UI, neutral theme
description: The default theme; a quiet workbench a product can build its identity on.
colors:
  background: "oklch(98.5% 0.003 260)"
  card: "oklch(99.6% 0.001 260)"
  muted: "oklch(96.2% 0.005 260)"
  accent: "oklch(93.6% 0.007 260)"
  border: "oklch(90% 0.008 260)"
  input: "oklch(55% 0.012 260)"
  foreground: "oklch(22% 0.012 260)"
  muted-foreground: "oklch(45% 0.014 260)"
  destructive: "oklch(47% 0.18 27)"
  destructive-foreground: "oklch(99% 0.004 27)"
  success: "oklch(46% 0.15 150)"
  success-foreground: "oklch(98% 0.006 150)"
  warning: "oklch(47% 0.1 70)"
  warning-foreground: "oklch(99% 0.004 70)"
  primary: "oklch(50% 0.16 260)"
  primary-hover: "oklch(44% 0.16 260)"
  primary-foreground: "oklch(99% 0.003 260)"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  mono:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontFeature: "'tnum'"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "6": "1.5rem"
  "8": "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0 0.875rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: "2.75rem"
---

# Design System: CodeCora UI, neutral theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `neutral` sets on top of them. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Plain Workbench"**

`neutral` is the theme a page gets without `data-theme`. It is a bench, not a showpiece. Cool greys sit just off white, ink is near-black with a hint of blue, and one blue accent marks the action a screen asks for. It commits to nothing a product would have to undo. When a product brings its own theme, `neutral` steps aside; until then, it keeps a screen honest and readable.

**Key Characteristics:**
- Cool grey surfaces on a 260° hue, chroma under 0.015.
- One blue accent; status colours carry meaning only.
- System fonts, so nothing loads before the first paint.
- Gently rounded corners (8px on controls).

## Colors

A cool, low-chroma grey field with a single saturated blue.

### Primary
- **Workbench Blue** (`primary`): primary buttons, links, the selected item and the focus ring. Darkens to `primary-hover` on hover; labels on it use `primary-foreground`.

### Neutral
- **Bench Paper** (`background`): the page.
- **Clean Sheet** (`card`): cards, popovers and inputs that sit above the page.
- **Tray Grey** (`muted`): sidebars, table headers and wells.
- **Hover Grey** (`accent`): row and menu hover.
- **Hairline** (`border`): decorative dividers only.
- **Edge Grey** (`input`): input and checkbox boundaries (3:1).
- **Blueprint Ink** (`foreground`) and **Pencil Grey** (`muted-foreground`): body text and secondary text.

### Named Rules
**The One Blue Rule.** Blue means "act here" or "you are here". Never use it for decoration or for a status.

## Typography

**Display Font:** system UI sans (no web font)
**Body Font:** system UI sans
**Label/Mono Font:** system monospace, tabular figures

**Character:** Familiar and native. The theme borrows the platform's voice, so product copy carries the personality.

### Hierarchy
- **Display** (600, 2.25rem, 1.2): page titles only.
- **Title** (600, 1.125rem, 1.2): section and card titles.
- **Body** (400, 1rem, 1.5): running text; keep lines near 65ch.
- **Label** (500, 0.875rem): form labels, buttons, table headers.
- **Mono** (0.875rem, tabular): IDs, timestamps, counts.

## Shapes

Soft but not round: 4px for small inline pieces, 8px for controls and cards, 12px for dialogs and sheets, pill only for badges and chips.

### Shape hooks

Neutral keeps every hook at its plain value, so it is the baseline the others are read against.

- **Badge:** pill, sentence case, system sans.
- **Focus ring:** 2px, offset 2px.
- **Selected table row:** accent tint with a 2px accent bar on the left.

## Components

### Buttons
- **Shape:** gently rounded (8px).
- **Primary:** Workbench Blue fill with near-white label, 44px tall at comfortable density (32px at compact).
- **Hover / Focus:** darker blue on hover; 2px blue focus ring offset 2px.

### Inputs / Fields
- **Style:** Clean Sheet fill, Edge Grey 1px border, 8px radius, 44px tall.
- **Focus:** the border and a 2px ring take the accent.

## Do's and Don'ts

### Do:
- **Do** use `input` for anything that marks a control's boundary.
- **Do** let a product theme replace `neutral` rather than restyling `neutral` per app.

### Don't:
- **Don't** add a second accent colour to `neutral`; switch `data-accent` instead.
- **Don't** use `border` (the hairline) as the only cue that a control exists.
