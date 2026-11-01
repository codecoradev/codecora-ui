---
name: CodeCora UI, corin theme
description: Editor-grade dark from Corin; deep chrome for long sessions, teal only on actions.
colors:
  surface: "#0E1015"
  surface-raised: "#12151D"
  surface-sunken: "#0A0C10"
  surface-hover: "#222836"
  border: "#222836"
  border-strong: "#6A7489"
  text: "#E6E9EF"
  text-muted: "#8B93A7"
  danger: "#F87171"
  danger-text: "#0E1015"
  success: "#34D399"
  success-text: "#0E1015"
  warning: "#E89B3C"
  warning-text: "#0E1015"
  accent: "#4FD8D2"
  accent-hover: "#7EE3DE"
  accent-text: "#0E1015"
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

# Design System: CodeCora UI, corin theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `corin` sets on top of them. Source: Corin's `DESIGN.md` (dark palette), used as a reference (D10). The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Night Console"**

Corin is where people work for hours, so its theme is a console at night. Deep blue-black chrome recedes, light grey text stays easy on the eyes, and teal appears only where the user can act. Status colours are signals, not decoration. Numbers, IDs and dates sit in JetBrains Mono so a scanning eye lands on them.

**Key Characteristics:**
- Layered dark chrome: sunken, base, raised, hover, each a small step apart.
- Teal is the only action colour; amber is a warning, never a brand.
- System sans for UI, JetBrains Mono for data.
- Softer corners than the light themes (10px on controls).

## Colors

Blue-black layers with a single teal and bright status signals.

### Primary
- **Console Teal** (`accent`): primary actions, links, the selected item and the focus ring. Brightens to `accent-hover`; labels on it use dark `accent-text`.

### Neutral
- **Night** (`surface`): the page.
- **Panel** (`surface-raised`): cards, popovers and inputs.
- **Deep Well** (`surface-sunken`): wells and inset areas below the page.
- **Chrome Edge** (`surface-hover`, also `border`): hover tint and hairlines.
- **Steel Edge** (`border-strong`): control boundaries (3:1).
- **Starlight** (`text`) and **Dusk Grey** (`text-muted`): body and secondary text.

### Named Rules
**The Teal Means Act Rule.** Teal marks what the user can do. The other accents stay available through `data-accent`, never as a second action colour on the same screen.

**The Lightening Hover Rule.** On dark surfaces, hover states get lighter, not darker.

## Typography

**Display Font:** system UI sans
**Body Font:** system UI sans
**Label/Mono Font:** JetBrains Mono (fallback: system mono), tabular figures

**Character:** Quiet UI type that leaves the stage to the content, with a mono voice for every machine value.

### Hierarchy
- **Display** (600, 2.25rem, 1.2): page titles.
- **Title** (600, 1.125rem, 1.2): panel and card titles.
- **Body** (400, 1rem, 1.5): running text.
- **Label** (500, 0.875rem): labels, buttons, table headers.
- **Mono** (0.875rem, tabular): IDs, dates, counts, scores.

## Shapes

Three radii and a pill, from Corin: 5px for inline code and keys, 10px for controls and cards, 14px for dialogs and sheets, pill for chips and badges.

### Shape hooks

Corin is a console, so tags look like data.

- **Badge:** 5px corners, mono, no case change.
- **Focus ring:** 2px, offset 1px, tight to the control.
- **Selected table row:** accent tint with a 2px marker on the left, like an editor gutter.

## Components

### Buttons
- **Shape:** rounded (10px).
- **Primary:** Console Teal with dark label, 44px tall at comfortable density.
- **Hover / Focus:** lighter teal on hover; 2px teal focus ring offset 2px.

### Inputs / Fields
- **Style:** Panel fill, Steel Edge 1px border, 10px radius.
- **Focus:** the ring takes Console Teal.

## Do's and Don'ts

### Do:
- **Do** separate layers with surface steps, not shadows.
- **Do** set every ID, date and count in mono with tabular figures.

### Don't:
- **Don't** use `text-muted` darker than Dusk Grey; Corin's old overlay grey fails 4.5:1 as text.
- **Don't** use amber or yellow for anything but warnings and scores.
