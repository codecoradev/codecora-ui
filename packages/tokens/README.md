# @codecora/tokens

Design tokens and themes for CodeCora products. See the
[repository README](../../README.md) and [docs/architecture.md](../../docs/architecture.md).

> Status: pre-release (M0), first published as `0.1.0` once the npm scope exists.

## Tiers

1. **Primitive** (`src/palette.ts`, `src/scale.ts`): colour palettes, spacing, type scale, motion. Raw colour literals live here and nowhere else.
2. **Semantic**: `--cc-surface`, `--cc-text`, `--cc-accent`, `--cc-danger`, `--cc-radius-md`, `--cc-font-sans`, `--cc-control-h`, ... (full list: `semanticTokens`). Components read only these.
3. **Theme** (`src/themes.ts`): `neutral` (default), `uteke` (editorial light), `corin` (editor dark).

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

- `data-theme`: `neutral`, `uteke`, `corin`. Themes nest per element; a themed element paints its own surface and text colour. Without `data-theme` the page gets `neutral`.
- `data-accent`: `blue`, `green`, `teal`, `violet`, each tuned per theme. A nested `data-theme` starts again from its own default accent.
- `data-density`: `comfortable` (default, 44 px controls) or `compact` (32 px).
- Fonts are referenced, not shipped: load Geist, Space Grotesk or JetBrains Mono yourself when a theme names them; the stacks fall back to system fonts.

Tokens sit in cascade layers (`cc.base` < `cc.theme` < `cc.modifier`), so import order does not matter and unlayered app CSS can still override any token.

## Text and UI pairs

| Pair | Minimum |
|---|---|
| `text`, `text-muted` on `surface`, `surface-raised`, `surface-sunken` (and `text` on `surface-hover`, `accent-soft`) | 4.5:1 |
| `accent`, `danger`, `success`, `warning` as text on `surface`, `surface-raised`, and status on its `-soft` tint | 4.5:1 |
| `accent-text` on `accent` and `accent-hover`; `<status>-text` on `<status>` | 4.5:1 |
| `border-strong` and `focus` on the surfaces | 3:1 |

The `-soft` tints (`accent-soft`, `danger-soft`, ...) are mixed with `--cc-surface`, so the checked pairs hold on the page surface; on a raised card they read slightly lighter or darker. `border` is a decorative hairline; use `border-strong` where the border identifies a control. `bun run contrast` prints the report for every theme and accent, and the unit tests fail when a pair drops below WCAG AA.

## Tailwind 4 and shadcn-svelte

```css
@import 'tailwindcss';
@import '@codecora/tokens/tokens.css';
@import '@codecora/tokens/tailwind.css'; /* bg-cc-surface, text-cc-text-muted, rounded-cc-md, font-cc-mono */
@import '@codecora/tokens/shadcn.css'; /* --background, --primary, --ring, ... read --cc-* */
```

With the shadcn bridge, remove the colour variables shadcn wrote into your `app.css`: unlayered declarations there would override the bridge.

## TypeScript

```ts
import { themes, themeNames, accentNames, cssVar, checkTheme } from '@codecora/tokens';

cssVar('surface'); // 'var(--cc-surface)'
checkTheme(themes.corin, 'violet'); // contrast results for every pair
```
