# Tailwind-first migration (D13)

Status: accepted 2026-11-14, migration in progress. D13 replaces D7.

## Why

Plain CSS on `--cc-*` tokens was a house standard: every rule (which token,
which selector, which motion pair) had to be learned from this repository.
Most references, snippets and agent output in the fleet are Tailwind and
shadcn, so adopting a component meant translating them first. Tailwind 4 with
shadcn token names becomes the base standard: a snippet from the Tailwind or
shadcn docs works on a CodeCora theme without translation, and the rules can be
checked by the tools the ecosystem already uses.

What does not change: one system with many themes mixable per element (D8),
bits-ui (D5), npm packages for primitives plus a shadcn-svelte registry for
blocks (D6), WCAG AA for every theme and accent, the keyboard and 375 px
gates, the motion rules in DESIGN.md, and `memory -> ui -> tokens`.

## Target

### Consuming app

Every consuming app runs Tailwind 4. Two imports after Tailwind:

```css
@import 'tailwindcss';
@import '@codecora/tokens/theme.css'; /* themes, accents, density, @theme inline */
@import '@codecora/ui/source.css'; /* @source "./": Tailwind scans the shipped components */
```

`data-theme`, `data-accent` and `data-density` keep working per element.

### Token names

Colour roles take the shadcn names; roles shadcn lacks follow the same
`<role>` / `<role>-foreground` pattern. Themes set the raw variables on
`[data-theme]`, and `@theme inline` maps them to Tailwind colours, so a nested
theme repaints its subtree.

| Today (`--cc-*`) | Variable | Utility |
|---|---|---|
| `surface` | `--background` | `bg-background` |
| `text` | `--foreground` | `text-foreground` |
| `surface-raised` | `--card`, `--popover` (+ `-foreground`) | `bg-card`, `bg-popover` |
| `surface-sunken` | `--muted`, `--secondary`, `--sidebar` | `bg-muted` |
| `text-muted` | `--muted-foreground` | `text-muted-foreground` |
| `surface-hover` | `--accent` (+ `-foreground`) | `hover:bg-accent` |
| `border` | `--border` | `border-border` (default border colour) |
| `border-strong` | `--input` | `border-input` |
| `accent` / `accent-text` | `--primary` / `--primary-foreground` | `bg-primary text-primary-foreground` |
| `accent-hover` | `--primary-hover` (new) | `hover:bg-primary-hover` |
| `accent-soft` | `--primary-soft` (new) | `bg-primary-soft` |
| `focus` | `--ring` | `ring-ring`, `outline-ring` |
| `danger` / `-text` / `-soft` | `--destructive` / `-foreground` / `-soft` | `bg-destructive` |
| `success`, `warning` (+ `-text`, `-soft`) | `--success`, `--warning` (+ `-foreground`, `-soft`) (new) | `bg-success` |
| `scrim` | `--overlay` (new) | `bg-overlay` |
| chart and sidebar roles | as in the shadcn bridge today | `bg-sidebar`, `fill-chart-1` |

`data-accent` sets `--primary`, `--primary-hover`, `--primary-foreground` and
`--ring`, as it sets the accent tokens today.

Non-colour tokens use Tailwind's own theme namespaces wherever one exists:

| Today | Tailwind | Utility |
|---|---|---|
| `radius-sm/md/lg`, `radius-pill` | `--radius-sm/md/lg` (+ `--radius` = md) | `rounded-md`, `rounded-full` |
| `font-sans/display/mono` | `--font-sans/display/mono` | `font-display` |
| `space-1..16` (4 px) | `--spacing: 0.25rem` (same scale) | `p-4`, `gap-2` |
| `font-size-*` | Tailwind's default `--text-*` scale (decided 2026-11-14): `xs`, `sm`, `base`, `lg` unchanged; `xl` 1.25rem, `2xl` 1.5rem, `3xl` 1.875rem (from 1.375, 1.75, 2.25) | `text-sm`, `text-xl` |
| `shadow-popover/modal` | `--shadow-popover/modal` | `shadow-popover` |
| `ease-out/exit/in-out/spring` | new names, Tailwind's own curves untouched (decided 2026-11-14): `--ease-enter`, `--ease-exit`, `--ease-move`, `--ease-spring` | `ease-enter`, `ease-spring` |
| `control-h/px/py`, `cell-py/px`, `gap` | `--spacing-control`, `--spacing-control-x/y`, `--spacing-cell-x/y`, `--spacing-stack`, switched by `data-density` | `h-control px-control-x` |
| `duration-*`, layers (z-index) | no Tailwind namespace: `@utility` | `duration-fast`, `z-popover` |
| `icon-size`, `icon-stroke`, `focus-width/offset`, badge shape hooks | variables kept, read through `--spacing-icon` or `[stroke-width:var(--cc-icon-stroke)]` (`--icon-stroke` from phase 10) | `size-icon` |

`dark:` follows the nearest theme: a `@custom-variant dark` matches inside a
theme whose `colorScheme` is dark (or shadcn's `.dark`) and not inside a light
theme nested in it. CSS cannot ask for the closest ancestor, so the selector
covers two levels; a dark theme nested inside that light one reads as light.
Components and blocks therefore never use `dark:` (the semantic roles already
change per theme, D8); it is for app code, and the class lint rejects it in
`packages/` and `registry/`.

The token source stays TypeScript (`palette.ts`, `themes.ts`) because the
contrast gate checks every theme and accent from it; the build emits
`theme.css`. Raw colour literals still live only in `packages/tokens`.

### Components

- `@codecora/ui` stays an npm package (D1, D6). Components are written with
  Tailwind utilities, variants with `tailwind-variants`, and the `class` prop
  merged last through `cn()` (`clsx` + a `tailwind-merge` extended with our
  theme), so `<Button class="rounded-full">` overrides as it does in shadcn.
- bits-ui parts take their classes directly (`data-[state=open]:` variants), so
  the `:global` selectors for portalled content go away.
- Keyframes live in the tokens package as `--animate-*` with reduced-motion
  fallbacks; components do not declare their own `<style>`, except where a
  pattern has no utility form (documented per case).

### Rules and gates

The written rules stay; their enforcement moves to class strings:

- **Semantic Only:** colour utilities use theme roles only. Palette colours
  (`bg-blue-500`), arbitrary colours (`bg-[#fff]`) and arbitrary values that do
  not read a token are lint errors in `packages/`, `registry/` and the
  playground.
- **Token Timing / Spring Moves:** a transition or animation class carries a
  duration utility and an easing utility; numeric durations (`duration-150`)
  are rejected; `ease-spring` only with transform, translate, scale or rotate.
- Unknown classes (not in Tailwind or our theme) fail lint, so a typo is not a
  silent no-op.
- Class order is formatted by `prettier-plugin-tailwindcss`.
- The visual baselines in `e2e/` are the oracle: a migrated component must
  match its screenshot in every captured theme, and axe stays green.

## Phases

One issue and one PR per phase (batches may split further).

| # | Phase | Done when |
|---|---|---|
| 0 | D13, this plan, governing docs | Merged to `develop` |
| 1 | Tooling: `tailwindcss`, `@tailwindcss/vite`, `tailwind-variants`, `tailwind-merge`, `clsx`, Prettier and ESLint Tailwind plugins; Tailwind in the playground and component tests | Playground builds with Tailwind; gates green |
| 2 | Tokens: `theme.css` (shadcn names, themes, accents, density, motion utilities, dark variant), `@codecora/ui/source.css`. Until phase 10 the shadcn names read the `--cc-*` tokens, the same direction as `shadcn.css` and the `cc-theme` item, so loading them together never makes a variable loop | Contrast gate and design-doc test pass on the new names |
| 3 | Class lint gate (replaces `usage.test.ts` for migrated files) | A palette colour or literal duration fails CI |
| 4 | Components, batch A: Button, IconButton, Badge, Kbd, Link, Separator, Spinner, Skeleton, Card, Alert, Avatar, VisuallyHidden, EmptyState, Progress | Baselines unchanged, axe green |
| 5 | Batch B (forms): Field, FieldGroup, Input, Textarea, Checkbox, RadioGroup, Switch, Slider, Select, Combobox, ToggleGroup | Same |
| 6 | Batch C (overlays): Dialog, ConfirmDialog, Sheet, Popover, Tooltip, DropdownMenu, CommandPalette, Toaster | Same, motion checked under reduced motion |
| 7 | Batch D (navigation, shell, data): Tabs, Accordion, Breadcrumb, Pagination, AppShell, Sidebar, Table, DataTable, CodeBlock; then `@codecora/memory` components | Same |
| 8 | Registry: blocks on utilities and `cn()`; `cc-theme` installs `theme.css` instead of rewriting variables | `registry.test.ts` and a shadcn-svelte install smoke test pass |
| 9 | Playground pages on utilities | No `<style>` left except documented cases |
| 10 | Flip the direction (themes declare the shadcn names), remove `--cc-*`, `shadcn.css` and `tailwind.css` in the same release; update READMEs, DESIGN.md token names, CHANGELOG | Breaking release; the maintainer picks the version |

## Consumer impact

- **Uteke Cloud** and other apps without Tailwind add Tailwind 4
  (`@tailwindcss/vite`) and the two imports, or stay on the last plain-CSS
  release until they do.
- **titen, gaira, corin** delete the shadcn colour variables in their
  `app.css` (the `cc-theme` item does it), then shadcn components and
  CodeCora components share one set of variables.
- Apps that override `--cc-*` tokens rename the overrides with the table
  above before phase 10, while `--cc-*` still exists (phases 2 to 9).

## Decided

- **Type scale (2026-11-14):** Tailwind's defaults. `text-xl`, `text-2xl` and
  `text-3xl` match the Tailwind docs; headings get slightly smaller, and the
  baselines are re-approved where a migrated component shows it.
- **Easing names (2026-11-14):** new names, so Tailwind's `ease-out` and
  `ease-in-out` keep their documented curves: `ease-enter` (entries, the
  CodeCora `out`), `ease-exit`, `ease-move` (between two resting places, the
  CodeCora `in-out`) and `ease-spring`.

## Open points

- The impeccable detector must understand Tailwind sources; check before
  phase 4.
