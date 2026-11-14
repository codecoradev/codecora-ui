// Tailwind 4 theme (D13): shadcn variable names, Tailwind theme keys, our
// utilities and the `dark` variant, on top of every CodeCora theme.
//
// Transition (phases 2 to 9 of #155): the shadcn names read the `--cc-*`
// tokens, which stay the source the contrast gate checks. Phase 10 flips it:
// the themes then declare the shadcn names directly and `--cc-*` goes away.
import { baseCss, shadcnBridge, themeCss } from './css.js';
import { duration, layer as layers } from './scale.js';
import { themeNames, type SemanticToken } from './schema.js';
import { themes } from './themes.js';

/** Roles shadcn has no variable for, named in its `<role>` / `<role>-foreground` pattern. */
export const shadcnExtensions: Readonly<Record<string, SemanticToken>> = {
  'primary-hover': 'accent-hover',
  'primary-soft': 'accent-soft',
  'destructive-soft': 'danger-soft',
  success: 'success',
  'success-foreground': 'success-text',
  'success-soft': 'success-soft',
  warning: 'warning',
  'warning-foreground': 'warning-text',
  'warning-soft': 'warning-soft',
  overlay: 'scrim',
};

/** Every variable `theme.css` declares, without `--`, and the token it reads. */
export const themeVariables: Readonly<Record<string, SemanticToken>> = {
  ...shadcnBridge,
  ...shadcnExtensions,
};

/** Variables that are not colours (`--radius` is the shadcn base radius). */
const nonColour = new Set(['radius']);

/**
 * Tailwind theme keys and the CodeCora token each reads. Keys outside these
 * stay Tailwind's defaults, including the type scale (`text-xl` is 1.25rem as
 * in the Tailwind docs).
 */
export const tailwindKeys: Readonly<Record<string, string>> = {
  'radius-sm': 'var(--cc-radius-sm)',
  'radius-md': 'var(--cc-radius-md)',
  'radius-lg': 'var(--cc-radius-lg)',
  'font-sans': 'var(--cc-font-sans)',
  'font-display': 'var(--cc-font-display)',
  'font-mono': 'var(--cc-font-mono)',
  // Sizes `data-density` switches: h-control, px-control-x, gap-stack, py-cell-y.
  'spacing-control': 'var(--cc-control-h)',
  'spacing-control-x': 'var(--cc-control-px)',
  'spacing-control-y': 'var(--cc-control-py)',
  'spacing-stack': 'var(--cc-gap)',
  'spacing-cell-x': 'var(--cc-cell-px)',
  'spacing-cell-y': 'var(--cc-cell-py)',
  'spacing-icon': 'var(--cc-icon-size)',
  'shadow-popover': 'var(--cc-shadow-popover)',
  'shadow-modal': 'var(--cc-shadow-modal)',
  // New names, so Tailwind's own ease-out and ease-in-out keep their curves.
  'ease-enter': 'var(--cc-ease-out)',
  'ease-exit': 'var(--cc-ease-exit)',
  'ease-move': 'var(--cc-ease-in-out)',
  'ease-spring': 'var(--cc-ease-spring)',
};

/** Utilities with no Tailwind theme namespace: `duration-fast`, `z-popover`. */
export const tailwindUtilities: Readonly<Record<string, Record<string, string>>> = {
  ...Object.fromEntries(
    Object.keys(duration).map((k) => [
      `duration-${k}`,
      {
        '--tw-duration': `var(--cc-duration-${k})`,
        'transition-duration': `var(--cc-duration-${k})`,
      },
    ]),
  ),
  ...Object.fromEntries(
    Object.keys(layers).map((k) => [`z-${k}`, { 'z-index': `var(--cc-layer-${k})` }]),
  ),
};

/** Elements where a token can change, so the shadcn variables must be re-read there. */
const SCOPES = ':root, [data-theme], [data-accent]';

/** `dark:` matches inside a dark theme (and shadcn's `.dark`). */
export function darkSelector(): string {
  const dark = themeNames.filter((n) => themes[n].colorScheme === 'dark');
  return [
    '.dark',
    '.dark *',
    ...dark.flatMap((n) => [`[data-theme='${n}']`, `[data-theme='${n}'] *`]),
  ].join(', ');
}

/**
 * `@codecora/tokens/theme.css`: import it after `tailwindcss`. The token
 * layers sit inside Tailwind's `base` layer, so utilities always win over them
 * and unlayered app CSS still overrides any token.
 */
export function tailwindThemeCss(): string {
  const tokens = [baseCss(), ...themeNames.map((n) => themeCss(themes[n]))]
    .join('\n')
    .replace(/(?<![\w.-])cc\.(base|theme|modifier)\b/g, 'base.cc.$1');
  const indent = (lines: string[]) => lines.map((l) => `  ${l}`).join('\n');

  const variables = `@layer base.cc.base {\n  ${SCOPES} {\n${indent(
    Object.entries(themeVariables).map(([k, v]) => `  --${k}: var(--cc-${v});`),
  )}\n  }\n}\n`;

  const theme = `@theme inline {\n${indent([
    ...Object.keys(themeVariables)
      .filter((k) => !nonColour.has(k))
      .map((k) => `--color-${k}: var(--${k});`),
    ...Object.entries(tailwindKeys).map(([k, v]) => `--${k}: ${v};`),
  ])}\n}\n`;

  const utilities = Object.entries(tailwindUtilities)
    .map(
      ([name, decls]) =>
        `@utility ${name} {\n${indent(Object.entries(decls).map(([p, v]) => `${p}: ${v};`))}\n}`,
    )
    .join('\n');

  const variant = `@custom-variant dark (&:where(${darkSelector()}));\n`;

  return [tokens, variables, theme, utilities, variant].join('\n');
}
