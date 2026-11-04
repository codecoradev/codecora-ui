---
name: CodeCora UI, tagfold theme
description: tagfold's tool; near-black slate that steps up in tone, one mint accent, 9px controls and 12px cards, system fonts.
colors:
  surface: "#101014"
  surface-raised: "#17171D"
  surface-sunken: "#1E1E26"
  surface-hover: "#23232B"
  border: "#2A2A34"
  border-strong: "#70708A"
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

The shared rules every theme follows live in the root [DESIGN.md](../../DESIGN.md). This file records what `tagfold` sets on top of them. Source: tagfold's own design language (`docs/DESIGN.md` in `codecoradev/tagfold`, locked through its redesign), used as a reference (D10). The colour tokens in the frontmatter mirror `packages/tokens/src/themes.ts`, and a unit test fails when the two drift.

## Overview

**Creative North Star: "The Light Table"**

tagfold is where a photographer sorts a batch and tags it for stock sites. Its UI is a dark light table: the photos are the only bright things, the chrome steps back in near-black slate, and one mint marks what to do next. Layers are told apart by tone, not by shadow, so the screen stays flat and calm over hundreds of thumbnails.

**Key Characteristics:**
- Near-black slate with a faint violet cast; each layer a step lighter than the one below it.
- Mint is the only accent and the success colour; amber and red are only for status.
- System fonts, with tabular figures for counts and mono for tags and IDs.
- Dark only: tagfold has no light twin.

## Colors

Slate layers, one mint accent, status colours that stay out of mint's way.

### Primary
- **Mint** (`accent`): primary actions, the selected item and the focus ring. Brightens to `accent-hover`; text on it is always dark ink (`accent-text`), since white on mint fails 4.5:1. It is also the success colour.

### Neutral
- **Slate** (`surface`): the page.
- **Panel** (`surface-raised`): cards, popovers and inputs.
- **Well** (`surface-sunken`): inset areas and neutral badges, one step lighter than the panel.
- **Edge** (`surface-hover`, `border`): hover tint (`#23232B`) and hairlines (`#2A2A34`).
- **Steel** (`border-strong`): control boundaries (3:1).
- **Paper** (`text`) and **Mist** (`text-muted`): body and secondary text.

### Departure from tagfold's palette

Every value is tagfold's own except one. `border-strong` is `#70708A` instead of `#4A4A57`, which is 2.2:1 on the page, 2.1:1 on the panel and 1.9:1 on the well, all under the 3:1 a control boundary needs. The replacement is 4.0, 3.7 and 3.5:1.

### Named Rules
**The Mint Means Act Rule.** Mint marks what the user can do, and also what went well. Never put it on a large area, and keep amber and red for status only.

**The Ink On Mint Rule.** Labels and icons on a mint fill use dark ink, never white.

## Typography

**Display Font:** system UI sans
**Body Font:** system UI sans
**Label/Mono Font:** system mono, tabular figures

**Character:** No webfont to load. Plain, fast UI type, with tabular figures so counts do not jitter as a batch is tagged.

### Hierarchy
- **Display** (600, 2.25rem, 1.2): page titles.
- **Title** (600, 1.125rem, 1.2): panel and card titles.
- **Body** (400, 1rem, 1.5): running text.
- **Label** (500, 0.875rem): labels, buttons, table headers.
- **Mono** (0.875rem, tabular): tags, counts, IDs, dates.

## Shapes

9px for controls, 12px for cards, dialogs and sheets, pill for chips. The small step is 9px too, so inline code and keys round like controls.

### Shape hooks

- **Badge:** 9px corners, mono, no case change.
- **Focus ring:** 2px mint, offset 2px.
- **Selected table row:** accent tint with a 2px marker on the left.

## Components

### Buttons
- **Shape:** rounded (9px).
- **Primary:** mint with a dark label, 44px tall at comfortable density.
- **Hover / Focus:** lighter mint on hover; 2px mint focus ring offset 2px.

### Inputs / Fields
- **Style:** Panel fill, Steel 1px border, 9px radius.
- **Focus:** the ring takes mint.

## Do's and Don'ts

### Do:
- **Do** separate layers with a step of tone, not a shadow.
- **Do** set tag counts and batch totals in tabular figures.

### Don't:
- **Don't** put white text on mint.
- **Don't** use amber or red for anything but warnings and errors.
- **Don't** use Corin's or gaira's accent next to mint; one accent per screen.
