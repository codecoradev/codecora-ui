# @codecora/tokens

Design tokens and themes for CodeCora products: one Tailwind 4 stylesheet,
`theme.css`, on the shadcn variable names, and the TypeScript token source it
is built from. See the [repository README](../../README.md) and
[docs/architecture.md](../../docs/architecture.md).

## Use

Every app runs Tailwind 4 (D13). Two imports after Tailwind:

```css
@import 'tailwindcss';
@import '@codecora/tokens/theme.css'; /* every theme, accent and density, the Tailwind keys */
@import '@codecora/ui/source.css'; /* Tailwind scans the components */
```

```html
<html data-theme="uteke">
  <aside data-theme="corin" data-accent="violet" data-density="compact">...</aside>
</html>
```

- `data-theme`: `neutral` (default), `uteke` (editorial light), `corin` (editor dark), `corin-light` (its warm-paper twin), `neutral-dark`, `uteke-dark`, `sepia` (serif reading), `contrast` (7:1 text), `dimmed` (low-glare dark), `slab` (brutalist print), `soft` (rounded consumer), `neutral-cvd` (colour-blind safe status), `gaira` (volt on ink, dark only) and `tagfold` (mint on slate, dark only). Themes nest per element; a themed element paints its own background and text colour. Without `data-theme` the page gets `neutral`.
- `data-accent`: `blue`, `green`, `teal`, `violet`, `orange`, `indigo`, `cyan`. Each is tuned per theme. A nested `data-theme` starts again from its own default accent.
- `data-density`: `comfortable` (default, 44 px controls) or `compact` (32 px).
- Fonts are referenced, not shipped: load Geist, Space Grotesk, JetBrains Mono or Nunito yourself when a theme names them; the stacks fall back to system fonts.

`theme.css` is the package's only stylesheet. The token layers sit inside
Tailwind's `base` layer (`base.cc.base` < `base.cc.theme` < `base.cc.modifier`),
so import order does not matter, a utility always beats a token, and unlayered
app CSS still overrides any token.

## Tiers

1. **Primitive** (`src/palette.ts`, `src/scale.ts`): colour palettes, spacing, motion. Raw colour literals live here and nowhere else.
2. **Semantic**: the variables below. Components read them through Tailwind utilities (`bg-primary`, `rounded-md`, `h-control`) and nothing else.
3. **Theme** (`src/themes.ts`): each theme maps the semantic variables onto palette entries. `bun run build` writes `dist/css/theme.css` from it.

## Variables and utilities

Every theme declares these variables on its element, and `data-accent` and
`data-density` change them where they are set, so a nested theme, accent or
density repaints its subtree.

**Colours** take the shadcn names; roles shadcn lacks follow its
`<role>` / `<role>-foreground` pattern. Each is a Tailwind colour
(`bg-*`, `text-*`, `border-*`, `ring-*`, `outline-*`, `fill-*`, with opacity
modifiers such as `bg-primary/90`), and `var(--primary)` works in your own CSS.

| Variable | Use |
|---|---|
| `--background`, `--foreground` | Page surface and body text |
| `--card`, `--popover` (+ `-foreground`) | Raised surfaces: cards, inputs, popovers |
| `--muted`, `--secondary`, `--sidebar` (+ `-foreground`), `--muted-foreground` | Sunken surfaces; secondary text |
| `--accent` (+ `-foreground`) | Hover tint (`hover:bg-accent`), not the brand colour |
| `--border`, `--input` | Decorative hairline; control boundary (3:1) |
| `--primary`, `--primary-foreground`, `--primary-hover`, `--primary-soft` | The accent: actions, links, selection |
| `--ring` | Focus ring |
| `--destructive`, `--success`, `--warning` (+ `-foreground`, `-soft`) | Status |
| `--overlay` | Scrim behind dialogs and sheets |
| `--chart-1` ... `--chart-5`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring` (+ `-foreground`) | The shadcn chart and sidebar names |

`data-accent` sets `--primary`, `--primary-hover`, `--primary-foreground` and
`--ring`; `--primary-soft`, `--chart-1` and the `--sidebar-primary*` and
`--sidebar-ring` names follow it.

**Tailwind theme keys** the themes declare as variables of the same name:

| Variable | Utility |
|---|---|
| `--radius-sm`, `--radius-md`, `--radius-lg` (`--radius` is md, shadcn's base) | `rounded-sm`, `rounded-md`, `rounded-lg`; a pill is `rounded-full` |
| `--font-sans`, `--font-display`, `--font-mono` | `font-sans`, `font-display`, `font-mono` |
| `--spacing-control`, `--spacing-control-x`, `--spacing-control-y`, `--spacing-stack`, `--spacing-cell-x`, `--spacing-cell-y` (switched by `data-density`) | `h-control`, `min-h-control`, `px-control-x`, `py-control-y`, `gap-stack`, `px-cell-x`, `py-cell-y` |
| `--shadow-popover`, `--shadow-modal` | `shadow-popover`, `shadow-modal` |
| `--ease-enter`, `--ease-exit`, `--ease-move`, `--ease-spring` | `ease-enter`, `ease-exit`, `ease-move`, `ease-spring` |

Further keys: `size-icon` (reads `--cc-icon-size`), `leading-heading` (1.2, for
headings and other tight text), `max-w-description` (40ch) and `max-w-measure`
(72ch). Everything else is Tailwind's default: the spacing scale
(`--spacing: 0.25rem`, so `p-4` is 1rem), the type scale (`text-xs` 0.75rem,
`sm` 0.875rem, `base` 1rem, `lg` 1.125rem, `xl` 1.25rem, `2xl` 1.5rem, `3xl`
1.875rem) with its line heights, `leading-tight` and `leading-normal`, and
Tailwind's own `ease-out` and `ease-in-out` curves.

**CodeCora-only tokens** keep the `--cc-` prefix: Tailwind has no namespace
for them, so `theme.css` gives each a named utility. Use the name, not an
arbitrary value: `outline-focus`, not `outline-[length:var(--cc-focus-width)]`
(the class lint rejects the long form).

| Variable | Use |
|---|---|
| `--cc-focus-width`, `--cc-focus-offset` | Focus ring thickness (at least 2px) and offset: `outline-focus`, `outline-offset-focus` |
| `--cc-icon-size`, `--cc-icon-stroke` | Icon size and stroke width: `size-icon`, `stroke-icon`; `@codecora/icons` reads them too |
| `--cc-badge-radius`, `--cc-badge-case`, `--cc-badge-tracking`, `--cc-badge-font` | The theme's badge and label shape: `rounded-badge`, `case-badge`, `tracking-badge`, `font-badge` |
| `--cc-row-marker` | Width of the accent bar on a selected row |
| `--cc-press-scale` | A pressed button's scale (0.98; 1 under reduced motion): `active:scale-press` |
| `--cc-duration-instant`, `-fast`, `-normal`, `-slow` | 70, 140, 240, 400 ms: `duration-instant` ... `duration-slow` |
| `--cc-layer-sticky`, `-overlay`, `-modal`, `-popover`, `-tooltip`, `-toast`, `-skip` | Stacking order: `z-sticky` ... `z-skip` |
| `--cc-primary-<accent>` (+ `-hover`, `-foreground`), `--cc-ring-<accent>` | Internal: each theme's tuned accent palette, read by `data-accent` |

## Motion

The same in every theme: `duration-instant|fast|normal|slow` and
`ease-enter|exit|move|spring`. `spring` is a `linear()` curve with a small
overshoot, for movement and scale only. Under `prefers-reduced-motion: reduce`
every duration is 0 ms, `--ease-spring` falls back to `--ease-enter` and
`--cc-press-scale` is 1.

Overlay enter and exit animations: `animate-overlay-in|out`, `dialog-`,
`palette-`, `sheet-right-|sheet-left-|sheet-bottom-`, `popover-` and `toast-`
(`-in` / `-out`), with their `cc-*` keyframes; add `motion-reduce:animate-none`
to drop the keyframes under reduced motion, and
`motion-reduce:data-[state=closed]:animate-none` next to a
`data-[state=closed]:animate-*-out` (that rule has a class and an attribute, so
a plain class cannot beat it). Components also use `animate-spinner`,
`animate-skeleton`, `animate-settle-in`, `animate-fade-in`, `animate-error-in`,
`animate-dot-in`, `animate-listbox-in|out` and `animate-accordion-open|close`.

Stacking: `z-sticky`, `z-overlay`, `z-modal`, `z-popover`, `z-tooltip`,
`z-toast`, `z-skip`. Helpers: `font-inherit`, `underline-offset-text`,
`ligatures-none`.

`dark:` follows the nearest theme: it applies inside a dark theme (`corin`,
`neutral-dark`, `uteke-dark`, `dimmed`, `gaira`, `tagfold`) or shadcn's
`.dark`, and not inside a light theme nested in one. A dark theme nested two
levels deeper reads as light, so components rely on the semantic colours, not
`dark:`.

## Text and UI pairs

| Pair | Minimum |
|---|---|
| `foreground`, `muted-foreground` on `background`, `card`, `muted` (and `foreground` on `accent`, `primary-soft`) | 4.5:1 |
| `primary`, `destructive`, `success`, `warning` as text on `background`, `card`, and status on its `-soft` tint | 4.5:1 |
| `primary-foreground` on `primary` and `primary-hover`; `<status>-foreground` on `<status>` | 4.5:1 |
| `input` and `ring` on the surfaces | 3:1 |

The `-soft` tints (`primary-soft`, `destructive-soft`, ...) are mixed with
`--background`, so the checked pairs hold on the page surface; on a raised card
they read slightly lighter or darker. `border` is a decorative hairline; use
`input` where the border identifies a control. `bun run contrast` prints the
report for every theme and accent (under the token source's role names), and
the unit tests fail when a pair drops below WCAG AA.

## Migrating from `--cc-*` (0.7)

`tokens.css`, `base.css`, `themes/*.css`, the `tailwind.css` preset
(`bg-cc-*`) and the `shadcn.css` bridge are gone: import `theme.css` after
`tailwindcss` instead. Rename overrides and reads of the old tokens:

| Before | After |
|---|---|
| `--cc-surface` | `--background` (`bg-background`) |
| `--cc-surface-raised` | `--card` and `--popover` (`bg-card`, `bg-popover`) |
| `--cc-surface-sunken` | `--muted`, `--secondary`, `--sidebar` (`bg-muted`) |
| `--cc-surface-hover` | `--accent` (`hover:bg-accent`) |
| `--cc-border`, `--cc-border-strong` | `--border`, `--input` |
| `--cc-text`, `--cc-text-muted` | `--foreground`, `--muted-foreground` |
| `--cc-accent`, `--cc-accent-hover`, `--cc-accent-text`, `--cc-accent-soft` | `--primary`, `--primary-hover`, `--primary-foreground`, `--primary-soft` |
| `--cc-focus` | `--ring` |
| `--cc-danger`, `--cc-danger-text`, `--cc-danger-soft` | `--destructive`, `--destructive-foreground`, `--destructive-soft` |
| `--cc-success`, `--cc-warning` (+ `-text`, `-soft`) | `--success`, `--warning` (+ `-foreground`, `-soft`) |
| `--cc-scrim` | `--overlay` |
| `--cc-radius-sm`, `-md`, `-lg`, `--cc-radius-pill` | `--radius-sm`, `-md`, `-lg` (`rounded-md`); `rounded-full` |
| `--cc-font-sans`, `-display`, `-mono` | `--font-sans`, `-display`, `-mono` |
| `--cc-font-size-xs ... 3xl` | Tailwind's `text-xs ... text-3xl`; `md` is `text-base`; `xl`, `2xl` and `3xl` are now 1.25, 1.5 and 1.875rem (were 1.375, 1.75, 2.25rem) |
| `--cc-leading-tight`, `--cc-leading-normal` | `leading-heading` (1.2), `leading-normal` (1.5) |
| `--cc-space-1 ... 16` | Tailwind spacing (`p-4`, `calc(var(--spacing) * 4)`) |
| `--cc-control-h`, `--cc-control-px`, `--cc-control-py` | `--spacing-control`, `--spacing-control-x`, `--spacing-control-y` |
| `--cc-gap`, `--cc-cell-px`, `--cc-cell-py` | `--spacing-stack`, `--spacing-cell-x`, `--spacing-cell-y` |
| `--cc-shadow-popover`, `-modal` | `--shadow-popover`, `-modal` |
| `--cc-ease-out`, `--cc-ease-in-out`, `--cc-ease-exit`, `--cc-ease-spring` | `--ease-enter`, `--ease-move`, `--ease-exit`, `--ease-spring` |
| `--cc-accent-<name>` (+ `-hover`, `-text`, `-focus`) | `--cc-primary-<name>` (+ `-hover`, `-foreground`), `--cc-ring-<name>` (internal) |
| `bg-cc-surface`, `rounded-cc-md`, `ease-cc-out` (preset) | `bg-background`, `rounded-md`, `ease-enter` |

Unchanged: `--cc-focus-width`, `--cc-focus-offset`, `--cc-icon-size`,
`--cc-icon-stroke`, `--cc-badge-*`, `--cc-row-marker`, `--cc-press-scale`,
`--cc-duration-*` and `--cc-layer-*`.

## TypeScript

```ts
import { themes, themeNames, accentNames, cssVar, checkTheme } from '@codecora/tokens';

cssVar('background'); // 'var(--background)'
checkTheme(themes.corin, 'violet'); // contrast results for every pair
```

`colorTokens` and `semanticTokens` list the variables, `colorVariables` and
`accentVariables` map the token source's role names (`surfaceRaised`) to them
(`card`), and `tailwindKeys`, `tailwindUtilities` and the `*Animations` exports
describe what `theme.css` adds to Tailwind.
