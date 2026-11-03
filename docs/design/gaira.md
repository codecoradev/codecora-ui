---
name: CodeCora UI, gaira theme
description: gaira's console; ink surfaces, volt only on actions and focus, Inter and JetBrains Mono.
colors:
  surface: "#0E1110"
  surface-raised: "#151917"
  surface-sunken: "#0A0C0B"
  surface-hover: "#222826"
  border: "#2A302D"
  border-strong: "#6B736F"
  text: "#E8ECEA"
  text-muted: "#959E99"
  danger: "#F87171"
  danger-text: "#0E1110"
  success: "#4FD8D2"
  success-text: "#0E1110"
  warning: "#E89B3C"
  warning-text: "#0E1110"
  accent: "#D4FF3A"
  accent-hover: "#E2FF7A"
  accent-text: "#0E1110"
typography:
  display:
    fontFamily: "'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  mono:
    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontFeature: "'tnum'"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
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

# Design System: CodeCora UI, gaira theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `gaira` sets on top of them. Source: gaira's `web/src/app.css` and its logo (`static/logo.svg`: a volt "g" on ink). The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Volt Console"**

gaira runs billed AI tools: image generation, OCR, captions, decisions. Its UI is a dark console where the work and its result are the focus, and volt marks the one thing to do next: run, buy, confirm. Everything else stays in quiet ink and grey.

**Key Characteristics:**
- Near-black ink surfaces with a faint green cast, each layer a small step apart.
- Volt is the only action colour; it never fills large areas.
- Inter for UI, JetBrains Mono for prices, IDs and counts.
- Dark only: gaira has no light twin.

## Colors

Ink layers, one volt accent, status signals that stay out of volt's way.

### Primary
- **Volt** (`accent`): primary actions, the selected item and the focus ring. Brightens to `accent-hover`; text on it is always ink (`accent-text`), since white on volt fails 4.5:1.

### Neutral
- **Ink** (`surface`): the page; the same ink that sits on volt in the logo.
- **Panel** (`surface-raised`): cards, popovers and inputs.
- **Well** (`surface-sunken`): result stages and inset areas.
- **Edge** (`surface-hover`, `border`): hover tint and hairlines.
- **Steel** (`border-strong`): control boundaries (3:1).
- **Paper** (`text`) and **Ash** (`text-muted`): body and secondary text.

### Named Rules
**The Volt Means Act Rule.** Volt marks what the user can do. Success is teal, not green, so a completed run never reads as another button.

**The Ink On Volt Rule.** Labels and icons on a volt fill use ink, never white.

## Typography

**Display Font:** Inter Variable (fallback: system UI sans)
**Body Font:** Inter Variable
**Label/Mono Font:** JetBrains Mono Variable (fallback: system mono), tabular figures

**Character:** Neutral, precise UI type; mono for every coin amount and machine value.

### Hierarchy
- **Display** (600, 2.25rem, 1.2): page titles.
- **Title** (600, 1.125rem, 1.2): panel and card titles.
- **Body** (400, 1rem, 1.5): running text.
- **Label** (500, 0.875rem): labels, buttons, table headers.
- **Mono** (0.875rem, tabular): coin balances, prices, IDs, dates.

## Shapes

4px for inline code and keys, 8px for controls and cards, 12px for dialogs and sheets, pill for chips.

### Shape hooks

- **Badge:** 4px corners, sans, no case change.
- **Focus ring:** 2px volt, offset 2px.
- **Selected table row:** accent tint with a 2px marker on the left.

## Components

### Buttons
- **Shape:** rounded (8px).
- **Primary:** volt with an ink label, 44px tall at comfortable density.
- **Hover / Focus:** lighter volt on hover; 2px volt focus ring offset 2px.

### Inputs / Fields
- **Style:** Panel fill, Steel 1px border, 8px radius.
- **Focus:** the ring takes volt.

## Do's and Don'ts

### Do:
- **Do** keep volt to one primary action per view.
- **Do** set coin amounts and prices in mono with tabular figures.

### Don't:
- **Don't** put white text on volt.
- **Don't** use volt for success or for decoration; success is teal.
