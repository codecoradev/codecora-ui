# @codecora/tokens

Design tokens and themes for CodeCora products. See the
[repository README](../../README.md) and [docs/architecture.md](../../docs/architecture.md).

> Status: `0.3.0`, installed from the GitHub Release tarballs until the npm scope exists (see the repository README).

## Tiers

1. **Primitive** (`src/palette.ts`, `src/scale.ts`): colour palettes, spacing, type scale, motion. Raw colour literals live here and nowhere else.
2. **Semantic**: `--cc-surface`, `--cc-text`, `--cc-accent`, `--cc-danger`, `--cc-radius-md`, `--cc-font-sans`, `--cc-control-h`, ... (full list: `semanticTokens`). Components read only these.
3. **Theme** (`src/themes.ts`): `neutral` (default), `uteke` (editorial light), `corin` (editor dark), `corin-light` (its warm-paper twin), `neutral-dark`, `uteke-dark`, `sepia` (serif reading), `contrast` (7:1 text), `dimmed` (low-glare dark), `slab` (brutalist print), `soft` (rounded consumer), `neutral-cvd` (colour-blind safe status) `gaira` (volt on ink, dark only) and `tagfold` (mint on slate, dark only).

## Use

```css
@import '@codecora/tokens/tokens.css'; /* base + every theme */
/* or only what you ship: */
@import '@codecora/tokens/base.css';
@import '@codecora/tokens/themes/uteke.css';
```

```html
<html data-theme="uteke">
  <aside data-theme="corin" data-accent="violet" data-density="compact">...</aside>
</html>
```

- `data-theme`: `neutral`, `uteke`, `corin`, `corin-light`, `neutral-dark`, `uteke-dark`, `sepia`, `contrast`, `dimmed`, `slab`, `soft`, `neutral-cvd`, `gaira`, `tagfold`. Themes nest per element; a themed element paints its own surface and text colour. Without `data-theme` the page gets `neutral`.
- `data-accent`: `blue`, `green`, `teal`, `violet`, `orange`, `indigo`, `cyan`. Each is tuned per theme. A nested `data-theme` starts again from its own default accent.
- `data-density`: `comfortable` (default, 44 px controls) or `compact` (32 px).
- Fonts are referenced, not shipped: load Geist, Space Grotesk, JetBrains Mono or Nunito yourself when a theme names them; the stacks fall back to system fonts.

Motion is the same in every theme: `--cc-duration-instant|fast|normal|slow` (70, 140, 240, 400 ms) and `--cc-ease-out|exit|in-out|spring`. `spring` is a `linear()` curve with a small overshoot, for movement and scale only. Under `prefers-reduced-motion: reduce` every duration is 0 ms and `spring` falls back to `out`. The Tailwind preset exposes the curves as `ease-cc-*`.

Tokens sit in cascade layers (`cc.base` < `cc.theme` < `cc.modifier`), so import order does not matter and unlayered app CSS can still override any token.

## Text and UI pairs

| Pair | Minimum |
|---|---|
| `text`, `text-muted` on `surface`, `surface-raised`, `surface-sunken` (and `text` on `surface-hover`, `accent-soft`) | 4.5:1 |
| `accent`, `danger`, `success`, `warning` as text on `surface`, `surface-raised`, and status on its `-soft` tint | 4.5:1 |
| `accent-text` on `accent` and `accent-hover`; `<status>-text` on `<status>` | 4.5:1 |
| `border-strong` and `focus` on the surfaces | 3:1 |

The `-soft` tints (`accent-soft`, `danger-soft`, ...) are mixed with `--cc-surface`, so the checked pairs hold on the page surface; on a raised card they read slightly lighter or darker. `border` is a decorative hairline; use `border-strong` where the border identifies a control. `bun run contrast` prints the report for every theme and accent, and the unit tests fail when a pair drops below WCAG AA.

## Tailwind 4: `theme.css`

The Tailwind-first setup (D13, [docs/tailwind-migration.md](../../docs/tailwind-migration.md)):

```css
@import 'tailwindcss';
@import '@codecora/tokens/theme.css'; /* every theme, shadcn names, Tailwind keys, utilities */
@import '@codecora/ui/source.css'; /* Tailwind scans the components */
```

`theme.css` already contains everything in `tokens.css` (the token layers moved inside Tailwind's `base`), so it **replaces** `tokens.css`: import one or the other, never both. Loading `tokens.css` as well would add top-level `cc.*` layers after Tailwind's, and their colours on `[data-theme]` would then beat utilities such as `bg-card`.

- Colours take the shadcn names: `bg-background`, `text-foreground`, `bg-card`, `bg-muted`, `text-muted-foreground`, `bg-accent` (hover tint), `border-border`, `border-input`, `ring-ring`, `bg-primary text-primary-foreground`, `bg-destructive`, plus `primary-hover`, `primary-soft`, `destructive-soft`, `success`, `warning` (each with `-foreground` and `-soft`) and `overlay`. The raw variables (`var(--primary)`) work in your own CSS too.
- Theme keys: `rounded-sm|md|lg` and `font-sans|display|mono` follow the theme; `h-control`, `px-control-x`, `py-control-y`, `gap-stack`, `px-cell-x`, `py-cell-y` and `size-icon` follow `data-density`; `shadow-popover`, `shadow-modal`.
- Motion: `duration-instant|fast|normal|slow` and `ease-enter|exit|move|spring` (Tailwind's own `ease-out` and `ease-in-out` are unchanged); all drop to 0 ms under reduced motion. Overlay enter and exit animations: `animate-overlay-in|out`, `dialog-`, `palette-`, `sheet-right-|sheet-left-|sheet-bottom-`, `popover-` and `toast-` (`-in` / `-out`), with their `cc-*` keyframes; add `motion-reduce:animate-none` to drop the keyframes under reduced motion, and `motion-reduce:data-[state=closed]:animate-none` next to a `data-[state=closed]:animate-*-out` (that rule has a class and an attribute, so a plain class cannot beat it).
- Stacking: `z-sticky`, `z-overlay`, `z-modal`, `z-popover`, `z-tooltip`, `z-toast`, `z-skip`.
- `dark:` follows the nearest theme: it applies inside a dark theme (`corin`, `neutral-dark`, `uteke-dark`, `dimmed`, `gaira`, `tagfold`) or shadcn's `.dark`, and not inside a light theme nested in one. A dark theme nested two levels deeper reads as light, so components rely on the semantic colours, not `dark:`.
- The type scale is Tailwind's (`text-xl` is 1.25rem).

The token layers sit inside Tailwind's `base` layer, so a utility always beats a token and unlayered app CSS still overrides any token. While the migration runs, these names read the `--cc-*` tokens; the exports `themeVariables`, `tailwindKeys` and `tailwindUtilities` list them.

## Tailwind 4 and shadcn-svelte (bridge)

```css
@import 'tailwindcss';
@import '@codecora/tokens/tokens.css';
@import '@codecora/tokens/tailwind.css'; /* bg-cc-surface, text-cc-text-muted, rounded-cc-md, font-cc-mono */
@import '@codecora/tokens/shadcn.css'; /* --background, --primary, --ring, ... read --cc-* */
```

With the shadcn bridge, remove the colour variables shadcn wrote into your `app.css`: unlayered declarations there would override the bridge. The `cc-theme` item of the [registry](../../registry) does this for you: it rewrites those variables in `:root` and `.dark` to read `--cc-*`. The map, chart and sidebar variables included, is exported as `shadcnBridge`.

## TypeScript

```ts
import { themes, themeNames, accentNames, cssVar, checkTheme } from '@codecora/tokens';

cssVar('surface'); // 'var(--cc-surface)'
checkTheme(themes.corin, 'violet'); // contrast results for every pair
```
