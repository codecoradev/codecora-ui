---
name: CodeCora UI, corin-light theme
description: Corin by day; warm paper surfaces, teal only on actions, the same shape and mono as corin.
colors:
  surface: "#FBF8F1"
  surface-raised: "#FFFDF8"
  surface-sunken: "#F3EEE3"
  surface-hover: "#E7E0D2"
  border: "#E7E0D2"
  border-strong: "#8A826D"
  text: "#2E2A1F"
  text-muted: "#6E6650"
  danger: "oklch(51% 0.15 30)"
  danger-text: "oklch(99% 0.004 30)"
  success: "oklch(48% 0.115 157)"
  success-text: "oklch(98% 0.006 157)"
  warning: "oklch(49% 0.1 65)"
  warning-text: "oklch(99% 0.004 65)"
  accent: "#0E7C74"
  accent-hover: "#0A6660"
  accent-text: "#FFFDF8"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.25rem"
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
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontFeature: "'tnum'"
rounded:
  sm: "5px"
  md: "10px"
  lg: "14px"
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

# Design System: CodeCora UI, corin-light theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `corin-light` sets on top of them. Source: Corin's `DESIGN.md` (light palette B, warm paper), used as a reference (D10). It is the light twin of [`corin`](corin.md): same teal, radii, fonts, icon weight and shape hooks; only the colours change, which is Corin's palette-only rule. The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Paper Console"**

Corin by day is the same console on warm paper. Cream surfaces keep long sessions easy on the eyes, near-black brown text stays crisp, and teal appears only where the user can act. Status colours are signals, not decoration, and numbers, IDs and dates still sit in JetBrains Mono.

**Key Characteristics:**
- Warm paper layers: sunken, base, raised, hover, each a small step apart.
- Teal is the only action colour; amber is a warning, never a brand.
- System sans for UI, JetBrains Mono for data.
- Softer corners than the other light themes (10px on controls).

## Colors

Cream paper with a single deep teal and muted status signals.

### Primary
- **Paper Teal** (`accent`): primary actions, links, the selected item and the focus ring. Deepens to `accent-hover`; labels on it use cream `accent-text`.

### Neutral
- **Paper** (`surface`): the page.
- **Cream** (`surface-raised`): cards, popovers and inputs.
- **Deckle** (`surface-sunken`): wells and inset areas below the page.
- **Tea Stain** (`surface-hover`, also `border`): hover tint and hairlines.
- **Pencil** (`border-strong`): control boundaries (3:1).
- **Ink** (`text`) and **Umber** (`text-muted`): body and secondary text.

### Departures from Corin's light palette

Every surface, text and teal fill is Corin's own (the hover teal and the label colour on it are derived, since Corin has none). Four values are not, because Corin's do not pass WCAG AA:
- `border-strong` `#8A826D` replaces Corin's `overlay` `#A39A85`, which is 2.6:1 on the page (needs 3:1 for a control boundary).
- `danger` is `oklch(51% 0.15 30)` instead of `#C25B4E` (4.0:1 as text on the page, 3.4:1 on its own tint).
- `success` is `oklch(48% 0.115 157)` instead of `#3E9B6C` (3.2:1 and 2.8:1).
- `warning` is `oklch(49% 0.1 65)` instead of `#C07A3A` (3.3:1 and 2.8:1).

The status hues keep Corin's hue angles (30, 157 and 65) and only get darker. The other six accents (`blue`, `green`, `violet`, `orange`, `indigo`, `cyan`) are the shared light set, with `teal` set to Corin's `#0E7C74`. Every accent passes AA on this theme.

### Named Rules
**The Teal Means Act Rule.** Teal marks what the user can do. The other accents stay available through `data-accent`, never as a second action colour on the same screen.

**The Deepening Hover Rule.** On light surfaces, hover states get darker, not lighter.

## Typography

**Display Font:** system UI sans
**Body Font:** system UI sans
**Label/Mono Font:** JetBrains Mono (fallback: system mono), tabular figures

**Character:** Quiet UI type that leaves the stage to the content, with a mono voice for every machine value. Identical to `corin`.

### Hierarchy
- **Display** (600, 2.25rem, 1.2): page titles.
- **Title** (600, 1.125rem, 1.2): panel and card titles.
- **Body** (400, 1rem, 1.5): running text.
- **Label** (500, 0.875rem): labels, buttons, table headers.
- **Mono** (0.875rem, tabular): IDs, dates, counts, scores.

## Shapes

Three radii and a pill, from Corin: 5px for inline code and keys, 10px for controls and cards, 14px for dialogs and sheets, pill for chips and badges.

### Shape hooks

Identical to `corin`, so the two read as one brand.

- **Badge:** 5px corners, mono, no case change.
- **Focus ring:** 2px, offset 1px, tight to the control.
- **Selected table row:** accent tint with a 2px marker on the left, like an editor gutter.

## Components

### Buttons
- **Shape:** rounded (10px).
- **Primary:** Paper Teal with cream label, 44px tall at comfortable density.
- **Hover / Focus:** deeper teal on hover; 2px teal focus ring offset 1px.

### Inputs / Fields
- **Style:** Cream fill, Pencil 1px border, 10px radius.
- **Focus:** the ring takes Paper Teal.

## Do's and Don'ts

### Do:
- **Do** separate layers with surface steps, not shadows.
- **Do** set every ID, date and count in mono with tabular figures.

### Don't:
- **Don't** use Corin's `overlay` grey for borders or text; it fails 3:1 and 4.5:1.
- **Don't** use amber for anything but warnings and scores.
