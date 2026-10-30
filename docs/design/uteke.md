---
name: CodeCora UI, uteke theme
description: Editorial light from uteke.app; green paper, ink, and one green that marks what matters.
colors:
  surface: "oklch(97.5% 0.008 150)"
  surface-raised: "oklch(99% 0.004 150)"
  surface-sunken: "oklch(94.6% 0.01 150)"
  surface-hover: "oklch(92% 0.012 150)"
  border: "oklch(88% 0.011 150)"
  border-strong: "oklch(45% 0.013 152)"
  text: "oklch(21% 0.015 155)"
  text-muted: "oklch(45% 0.013 152)"
  danger: "oklch(47% 0.18 27)"
  danger-text: "oklch(99% 0.004 27)"
  success: "oklch(46% 0.15 150)"
  success-text: "oklch(98% 0.006 150)"
  warning: "oklch(47% 0.1 70)"
  warning-text: "oklch(99% 0.004 70)"
  accent: "oklch(46% 0.15 150)"
  accent-hover: "oklch(40% 0.14 150)"
  accent-text: "oklch(98% 0.006 150)"
typography:
  display:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontFeature: "'tnum'"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "6": "1.5rem"
  "8": "2rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0 0.875rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    height: "2.75rem"
---

# Design System: CodeCora UI, uteke theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `uteke` sets on top of them. Source: uteke-cloud `web/src/lib/styles/tokens.css` and its contrast gate. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Field Notebook"**

Uteke keeps memories, and its theme reads like a notebook kept by hand. Green-tinted paper, near-black ink, and a single green that marks what matters. Nothing is pure white or pure black. The page is calm and editorial: headings in Space Grotesk carry a little engineering in their shape, body copy in Geist stays plain, and numbers sit in JetBrains Mono so they line up.

**Key Characteristics:**
- Paper surfaces on a 150° green hue; no pure white or black.
- One green accent, shared with the success colour, used sparingly.
- Space Grotesk headings, Geist body, JetBrains Mono for figures.
- Tight corners (6px on controls), close to a printed page.

## Colors

Warm-green paper and ink with one green voice.

### Primary
- **Notebook Green** (`accent`): primary actions, links, the selected item and the focus ring. Deepens to `accent-hover`; labels on it use `accent-text`.

### Neutral
- **Field Paper** (`surface`): the page.
- **Fresh Leaf** (`surface-raised`): cards, inputs and popovers.
- **Pressed Leaf** (`surface-sunken`): wells, sidebars and table headers.
- **Margin Rule** (`border`): decorative rules between sections.
- **Pencil Line** (`border-strong`, also `text-muted`): control boundaries and secondary text.
- **Field Ink** (`text`): body text.

### Named Rules
**The One Ink Rule.** Green is the only colour that is not ink or paper, outside status messages. If a screen needs a second colour to make sense, the hierarchy is wrong.

**The No Pure Tones Rule.** Never pure white or pure black; every neutral carries the green tint.

## Typography

**Display Font:** Space Grotesk (fallback: system sans)
**Body Font:** Geist (fallback: system sans)
**Label/Mono Font:** JetBrains Mono (fallback: system mono), tabular figures

**Character:** An engineer's notebook. Geometric headings, plain body text, numbers that align.

The theme names these fonts; the app loads them. Without them the stacks fall back to system fonts.

### Hierarchy
- **Display** (600, 2.25rem, 1.2): page titles.
- **Title** (600, 1.125rem, 1.2): section and card titles.
- **Body** (400, 1rem, 1.5): running text at 65ch.
- **Label** (500, 0.875rem): labels and buttons.
- **Mono** (0.875rem, tabular): counts, IDs, dates.

## Shapes

Close to print: 4px for inline pieces, 6px for controls and cards, 10px for dialogs, pill for badges.

## Components

### Buttons
- **Shape:** tight corners (6px).
- **Primary:** Notebook Green with paper-white label, 44px tall at comfortable density.
- **Hover / Focus:** deeper green on hover; 2px green focus ring offset 2px.

### Inputs / Fields
- **Style:** Fresh Leaf fill, Pencil Line 1px border, 6px radius.
- **Focus:** the ring takes Notebook Green.

## Do's and Don'ts

### Do:
- **Do** use mono with tabular figures for every number that changes.
- **Do** keep the green rare: one primary action per view.

### Don't:
- **Don't** introduce pure white cards on the paper; use `surface-raised`.
- **Don't** use green to decorate headings or illustrations.
