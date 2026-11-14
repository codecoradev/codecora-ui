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
  // The measure of a short description (EmptyState): max-w-description.
  'container-description': '40ch',
  // A comfortable reading measure for long text: max-w-measure.
  'container-measure': '72ch',
};

/**
 * Keyframes for the overlay motion in DESIGN.md, named `cc-*` so they never
 * meet an app's own. Entries fade with ease-out while only the movement
 * springs; exits end on their last frame (`forwards`), which bits-ui waits for
 * before it unmounts the content.
 */
export const tailwindKeyframes: Readonly<Record<string, Record<string, Record<string, string>>>> = {
  'cc-fade-in': { from: { opacity: '0' } },
  'cc-fade-out': { to: { opacity: '0' } },
  // Centered dialog and command palette: the movement adds to the element's
  // own centring (`-translate-1/2`), which sits in `translate`, not `transform`.
  'cc-dialog-in': { from: { transform: 'translateY(var(--cc-space-3)) scale(0.97)' } },
  'cc-dialog-out': {
    to: { opacity: '0', transform: 'translateY(var(--cc-space-2)) scale(0.98)' },
  },
  'cc-palette-in': {
    from: { transform: 'translateY(calc(-1 * var(--cc-space-2))) scale(0.97)' },
  },
  'cc-palette-out': {
    to: { opacity: '0', transform: 'translateY(calc(-1 * var(--cc-space-1))) scale(0.98)' },
  },
  'cc-sheet-right-in': { from: { transform: 'translateX(100%)' } },
  'cc-sheet-right-out': { to: { transform: 'translateX(100%)' } },
  'cc-sheet-left-in': { from: { transform: 'translateX(-100%)' } },
  'cc-sheet-left-out': { to: { transform: 'translateX(-100%)' } },
  'cc-sheet-bottom-in': { from: { transform: 'translateY(100%)' } },
  'cc-sheet-bottom-out': { to: { transform: 'translateY(100%)' } },
  // Popover, Tooltip, DropdownMenu: scale from the anchor (transform-origin).
  'cc-popover-in': { from: { opacity: '0', transform: 'scale(0.96)' } },
  'cc-popover-out': { to: { opacity: '0', transform: 'scale(0.96)' } },
  'cc-toast-in': { from: { transform: 'translateY(var(--cc-space-3))' } },
  'cc-toast-out': { to: { opacity: '0', transform: 'translateY(var(--cc-space-2))' } },
};

const enter = (name: string, d = 'normal', e = 'out') =>
  `${name} var(--cc-duration-${d}) var(--cc-ease-${e})`;
const exit = (name: string, d = 'fast') =>
  `${name} var(--cc-duration-${d}) var(--cc-ease-exit) forwards`;

/**
 * `animate-*` utilities for the overlays (`animate-dialog-in`,
 * `data-[state=closed]:animate-dialog-out`). Every one reads the duration and
 * easing tokens, so reduced motion drops them to 0ms; components also add
 * `motion-reduce:animate-none` (plus `motion-reduce:data-[state=closed]:animate-none`
 * beside an exit) to drop the keyframes, as DESIGN.md asks.
 */
export const tailwindAnimations: Readonly<Record<string, string>> = {
  'overlay-in': enter('cc-fade-in'),
  'overlay-out': exit('cc-fade-out'),
  'dialog-in': `${enter('cc-fade-in')}, ${enter('cc-dialog-in', 'slow', 'spring')}`,
  'dialog-out': exit('cc-dialog-out'),
  'palette-in': `${enter('cc-fade-in')}, ${enter('cc-palette-in', 'slow', 'spring')}`,
  'palette-out': exit('cc-palette-out'),
  'sheet-right-in': enter('cc-sheet-right-in'),
  'sheet-right-out': exit('cc-sheet-right-out'),
  'sheet-left-in': enter('cc-sheet-left-in'),
  'sheet-left-out': exit('cc-sheet-left-out'),
  'sheet-bottom-in': enter('cc-sheet-bottom-in'),
  'sheet-bottom-out': exit('cc-sheet-bottom-out'),
  'popover-in': enter('cc-popover-in', 'fast'),
  'popover-out': exit('cc-popover-out', 'instant'),
  'toast-in': `${enter('cc-fade-in')}, ${enter('cc-toast-in', 'slow', 'spring')}`,
  'toast-out': exit('cc-toast-out'),
};

/**
 * Keyframe animations, `animate-<name>`: the value and the keyframes Tailwind
 * emits once a component uses the utility. Endless ones keep literal timing
 * (a spinner is not a transition); entries read the motion tokens, so they
 * drop to 0ms under reduced motion. Components add `motion-reduce:` as the
 * plain CSS did (`animate-none`, or `animate-spinner-reduced`).
 */
export const displayAnimations: Readonly<Record<string, { value: string; keyframes: string }>> = {
  spinner: {
    value: 'cc-spin 0.8s linear infinite',
    keyframes: '@keyframes cc-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}',
  },
  // Under reduced motion the spinner keeps turning, three times slower.
  'spinner-reduced': {
    value: 'cc-spin 2.4s linear infinite',
    keyframes: '@keyframes cc-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}',
  },
  // Opacity runs on the compositor; a background-position shimmer repaints every frame.
  skeleton: {
    value: 'cc-pulse 1.4s ease-in-out infinite',
    keyframes: '@keyframes cc-pulse {\n  50% {\n    opacity: 0.45;\n  }\n}',
  },
  // Arrives where it stays: a short settle into place, no spring in the reading flow.
  'settle-in': {
    value: 'cc-settle-in var(--cc-duration-normal) var(--cc-ease-out)',
    keyframes:
      '@keyframes cc-settle-in {\n  from {\n    opacity: 0;\n    transform: translateY(calc(-1 * var(--cc-space-1)));\n  }\n}',
  },
  'fade-in': {
    value: 'cc-fade-in var(--cc-duration-normal) var(--cc-ease-out)',
    keyframes: '@keyframes cc-fade-in {\n  from {\n    opacity: 0;\n  }\n}',
  },
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
  // `font: inherit` for form controls, written as longhands: Tailwind sorts a
  // shorthand it does not know after every other utility, where it would undo
  // `text-sm` or `leading-*` on the same element.
  'font-inherit': Object.fromEntries(
    [
      'font-family',
      'font-size',
      'font-style',
      'font-weight',
      'font-stretch',
      'font-variant',
      'font-kerning',
      'font-size-adjust',
      'font-optical-sizing',
      'font-feature-settings',
      'font-variation-settings',
      'line-height',
    ].map((p) => [p, 'inherit']),
  ),
  'underline-offset-text': { 'text-underline-offset': '0.2em' },
  // Code shows the characters as typed: no ligature turns <!-- or -> into an arrow.
  'ligatures-none': { 'font-variant-ligatures': 'none' },
};

/**
 * Keyframe animations, as `animate-<name>` utilities (`--animate-<name>` in
 * the theme). Durations and curves are tokens, so they drop to 0 ms and lose
 * the spring under reduced motion; components still add
 * `motion-reduce:animate-none` where the motion should not run at all.
 */
export const formAnimations: Readonly<
  Record<string, { animation: string; keyframes: Record<string, string> }>
> = {
  // A field error arrives where it stays: a short settle, no spring.
  'error-in': {
    animation: 'cc-error-in var(--cc-duration-normal) var(--cc-ease-out)',
    keyframes: {
      'cc-error-in': 'from { opacity: 0; transform: translateY(calc(-1 * var(--cc-space-1))); }',
    },
  },
  // A radio dot: opacity eases, only the scale springs.
  'dot-in': {
    animation:
      'cc-dot-fade var(--cc-duration-fast) var(--cc-ease-out), cc-dot-pop var(--cc-duration-slow) var(--cc-ease-spring)',
    keyframes: {
      'cc-dot-fade': 'from { opacity: 0; }',
      'cc-dot-pop': 'from { scale: 0.4; }',
    },
  },
  // Select and Combobox lists; bits-ui keeps a list mounted until its exit ends.
  'listbox-in': {
    animation: 'cc-listbox-in var(--cc-duration-fast) var(--cc-ease-out)',
    keyframes: { 'cc-listbox-in': 'from { opacity: 0; transform: scale(0.96); }' },
  },
  'listbox-out': {
    animation: 'cc-listbox-out var(--cc-duration-instant) var(--cc-ease-exit) forwards',
    keyframes: { 'cc-listbox-out': 'to { opacity: 0; transform: scale(0.96); }' },
  },
};

/**
 * The accordion keyframe animations: `animate-<name>`. Tailwind emits the keyframes only
 * where a component uses the animation; the component adds the
 * `motion-reduce:` fallback its motion needs.
 */
export const accordionAnimations: Readonly<
  Record<string, { animation: string; keyframes: Record<string, Record<string, string>> }>
> = {
  // The accordion panel opens to the height bits-ui measures.
  'accordion-open': {
    animation: 'cc-accordion-open var(--cc-duration-normal) var(--cc-ease-out)',
    keyframes: {
      from: { height: '0', opacity: '0' },
      to: { height: 'var(--bits-accordion-content-height)' },
    },
  },
  // bits-ui keeps the panel mounted until the exit animation finishes.
  'accordion-close': {
    animation: 'cc-accordion-close var(--cc-duration-fast) var(--cc-ease-exit) forwards',
    keyframes: {
      from: { height: 'var(--bits-accordion-content-height)' },
      to: { height: '0', opacity: '0' },
    },
  },
};

/** Elements where a token can change, so the shadcn variables must be re-read there. */
const SCOPES = ':root, [data-theme], [data-accent]';

/**
 * `dark:` follows the nearest theme: it matches an element whose closest
 * `data-theme` (itself or an ancestor) is a dark theme, or shadcn's `.dark`.
 * CSS cannot ask for the closest ancestor, so the selector covers two levels
 * (a dark theme, and a light theme inside it); a dark theme nested inside
 * that light one reads as light. Components never use `dark:` (D13 plan).
 */
export function darkSelector(): string {
  const group = (scheme: 'light' | 'dark') =>
    `:where(${[
      ...(scheme === 'dark' ? ['.dark'] : []),
      ...themeNames.filter((n) => themes[n].colorScheme === scheme).map((n) => `[data-theme=${n}]`),
    ].join(',')})`;
  const d = group('dark');
  const l = group('light');
  return `${d},${d} *:not(${l},${d} ${l} *)`;
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
    ...Object.entries(tailwindAnimations).map(([k, v]) => `--animate-${k}: ${v};`),
    // Inside @theme, Tailwind emits a keyframe only when an animate-* utility uses it.
    ...Object.entries(tailwindKeyframes).flatMap(([name, frames]) => [
      `@keyframes ${name} {`,
      ...Object.entries(frames).flatMap(([at, decls]) => [
        `  ${at} {`,
        ...Object.entries(decls).map(([p, v]) => `    ${p}: ${v};`),
        '  }',
      ]),
      '}',
    ]),
    ...Object.entries(formAnimations).map(([k, a]) => `--animate-${k}: ${a.animation};`),
    ...Object.values(formAnimations).flatMap((a) =>
      Object.entries(a.keyframes).map(([name, body]) => `@keyframes ${name} { ${body} }`),
    ),
    ...Object.entries(accordionAnimations).flatMap(([k, { animation, keyframes }]) => [
      `--animate-${k}: ${animation};`,
      `@keyframes ${animation.split(' ')[0]} {`,
      ...Object.entries(keyframes).flatMap(([step, decls]) => [
        `  ${step} {`,
        ...Object.entries(decls).map(([p, v]) => `    ${p}: ${v};`),
        '  }',
      ]),
      '}',
    ]),
    ...Object.entries(displayAnimations).map(([k, { value }]) => `--animate-${k}: ${value};`),
    ...[...new Set(Object.values(displayAnimations).map((a) => a.keyframes))].flatMap((k) =>
      k.split('\n'),
    ),
  ])}\n}\n`;

  const utilities = Object.entries(tailwindUtilities)
    .map(
      ([name, decls]) =>
        `@utility ${name} {\n${indent(Object.entries(decls).map(([p, v]) => `${p}: ${v};`))}\n}`,
    )
    .join('\n');

  const variant = `@custom-variant dark (&:where(${darkSelector()}));\n`;

  // The duration utilities set --tw-duration; Tailwind registers it as
  // non-inheriting only when one of its own duration-<n> classes is used, so
  // register it here too, or a child's plain `transition` would inherit it.
  const property = '@property --tw-duration {\n  syntax: "*";\n  inherits: false;\n}\n';

  return [tokens, variables, theme, utilities, property, variant].join('\n');
}
