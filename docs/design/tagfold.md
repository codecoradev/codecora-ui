---
name: CodeCora UI, tagfold theme
description: tagfold's darkroom tool; slate surfaces, one mint accent on action and focus, system fonts.
colors:
  surface: "#101014"
  surface-raised: "#17171D"
  surface-sunken: "#0C0C10"
  surface-hover: "#23232B"
  border: "#2A2A34"
  border-strong: "#6A6A78"
  text: "#ECECF1"
  text-muted: "#9A9AA8"
  danger: "#EF7B7B"
  danger-text: "#2A0D0D"
  success: "#7EE0A3"
  success-text: "#0C1510"
  warning: "#F0B45C"
  warning-text: "#241A08"
  accent: "#7EE0A3"
  accent-hover: "#A9ECBF"
  accent-text: "#0C1510"
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
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontFeature: "'tnum'"
rounded:
  sm: "9px"
  md: "9px"
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

# Design System: CodeCora UI, tagfold theme

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `tagfold` sets on top of them. Source: tagfold's `src/lib/design/app.css` (the audited fase 0-4 tokens). The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Darkroom Tool"**

tagfold is a photographer's dark utility: the photos are the colour, the interface stays out of the way. One mint accent marks what is active or what to do next; everything else is quiet slate.

**Key Characteristics:**
- Near-black slate surfaces with a slightly blue hue, each layer a small step apart.
- Mint is the only accent; it never fills large areas.
- System fonts: fast, native feel. Counts in tabular numerals.
- Flat surfaces, no shadows for depth.
- Dark only: tagfold has no light twin.

## Colors

Slate layers, one mint accent, status signals that stay quiet.

### Primary
- **Mint** (`accent`): primary actions, the active item and the focus ring. Brightens to `accent-hover`; text on it is always ink (`accent-text`).

### Neutral
- **Slate** (`surface`): the page.
- **Panel** (`surface-raised`): cards, popovers and inputs.
- **Well** (`surface-sunken`): inset areas and photo stages.
- **Edge** (`surface-hover`, `border`): hover tint and hairlines.
- **Steel** (`border-strong`): control boundaries (3:1).
- **Mist** (`text`) and **Haze** (`text-muted`): body and secondary text.

### Named Rules
**The Mint Means Active Rule.** Mint marks what is active or actionable. Success shares the mint hue, so a completed step reads as settled, not as a second button.

**The Ink On Mint Rule.** Labels and icons on a mint fill use ink, never white.

## Typography

**Display Font:** system UI sans
**Body Font:** system UI sans
**Label/Mono Font:** system mono, tabular figures

**Character:** Native and fast; tabular figures keep counts steady as they change.

### Hierarchy
- **Display** (600, 2.25rem, 1.2): page titles.
- **Title** (600, 1.125rem, 1.2): panel and card titles.
- **Body** (400, 1rem, 1.5): running text.
- **Label** (500, 0.875rem): labels, buttons, table headers.
- **Mono** (0.875rem, tabular): tag names, IDs, counts.

## Shapes

9px for controls and cards, 12px for dialogs and sheets, pill for chips and badges.

### Shape hooks

- **Badge:** pill, sans, no case change.
- **Focus ring:** 2px mint, offset 2px.
- **Selected table row:** accent tint with a 2px marker on the left.

## Components

### Buttons
- **Shape:** rounded (9px).
- **Primary:** mint with an ink label, 44px tall at comfortable density.
- **Hover / Focus:** lighter mint on hover; 2px mint focus ring offset 2px.

### Inputs / Fields
- **Style:** Panel fill, Steel 1px border, 9px radius.
- **Focus:** the ring takes mint.

## Do's and Don'ts

### Do:
- **Do** keep mint to the one active or primary thing per view.
- **Do** set counts in tabular numerals.

### Don't:
- **Don't** put white text on mint.
- **Don't** use mint for decoration or large fills.
