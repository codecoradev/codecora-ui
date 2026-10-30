// CSS output. Cascade layers make the result independent of import order:
// base (primitives, derived tints) < theme < modifier (data-density,
// data-accent). Unlayered app CSS still overrides any token.
import { SOFT_WEIGHT } from './contrast.js';
import { density, duration, ease, fontSize, leading, space } from './scale.js';
import {
  accentNames,
  densities,
  kebab,
  semanticTokens,
  statusNames,
  type Density,
  type Theme,
} from './schema.js';

export const LAYERS = '@layer cc.base, cc.theme, cc.modifier;';

/** Elements where a token can change, so derived values must be recomputed there. */
const SCOPES = ':root, [data-theme], [data-accent]';

type Decls = [name: string, value: string][];

const block = (selector: string, decls: Decls, indent = '  ') =>
  `${indent}${selector} {\n${decls.map(([n, v]) => `${indent}  ${n}: ${v};`).join('\n')}\n${indent}}`;

const layer = (name: string, body: string[]) => `@layer ${name} {\n${body.join('\n\n')}\n}\n`;

const prefixed = (prefix: string, entries: Record<string, string>): Decls =>
  Object.entries(entries).map(([k, v]) => [`--cc-${prefix}-${k}`, v]);

const densityDecls = (d: Density): Decls =>
  Object.entries(density[d]).map(([k, v]) => [`--cc-${kebab(k)}`, v]);

/** Primitives, density and accent modifiers, derived tints. Required by every theme file. */
export function baseCss(): string {
  const soft = (name: string): [string, string] => [
    `--cc-${name}-soft`,
    `color-mix(in srgb, var(--cc-${name}) ${Math.round(SOFT_WEIGHT * 100)}%, var(--cc-surface))`,
  ];
  const base = layer('cc.base', [
    block(':root', [
      ...prefixed('space', space),
      ...prefixed('font-size', fontSize),
      ...prefixed('leading', leading),
      ...prefixed('duration', duration),
      ...prefixed('ease', ease),
      ...densityDecls('comfortable'),
    ]),
    block(SCOPES, ['accent', ...statusNames].map(soft)),
    `  @media (prefers-reduced-motion: reduce) {\n${block(
      ':root',
      Object.keys(duration).map((k) => [`--cc-duration-${k}`, '0ms']),
      '    ',
    )}\n  }`,
  ]);
  const modifier = layer('cc.modifier', [
    ...densities.map((d) => block(`[data-density='${d}']`, densityDecls(d))),
    ...accentNames.map((a) =>
      block(`[data-accent='${a}']`, [
        ['--cc-accent', `var(--cc-accent-${a})`],
        ['--cc-accent-hover', `var(--cc-accent-${a}-hover)`],
        ['--cc-accent-text', `var(--cc-accent-${a}-text)`],
        ['--cc-focus', `var(--cc-accent-${a}-focus)`],
      ]),
    ),
  ]);
  return `${LAYERS}\n\n${base}\n${modifier}`;
}

/**
 * One theme. `neutral` also styles `:root` (at zero specificity) so a page
 * without `data-theme` gets it, while any `data-theme` on <html> still wins.
 */
export function themeCss(theme: Theme): string {
  const { colors, accents, defaultAccent } = theme;
  const selector =
    theme.name === 'neutral'
      ? `:where(:root), [data-theme='neutral']`
      : `[data-theme='${theme.name}']`;
  const decls: Decls = [
    ['color-scheme', theme.colorScheme],
    ...Object.entries(colors).map(([k, v]): [string, string] => [`--cc-${kebab(k)}`, v]),
    ...accentNames.flatMap((a): Decls => [
      [`--cc-accent-${a}`, accents[a].accent],
      [`--cc-accent-${a}-hover`, accents[a].accentHover],
      [`--cc-accent-${a}-text`, accents[a].accentText],
      [`--cc-accent-${a}-focus`, accents[a].focus],
    ]),
    ['--cc-accent', `var(--cc-accent-${defaultAccent})`],
    ['--cc-accent-hover', `var(--cc-accent-${defaultAccent}-hover)`],
    ['--cc-accent-text', `var(--cc-accent-${defaultAccent}-text)`],
    ['--cc-focus', `var(--cc-accent-${defaultAccent}-focus)`],
    ...prefixed('radius', theme.radius),
    ...prefixed('font', theme.font),
    ...prefixed('icon', theme.icon),
    ...Object.entries(theme.shape).map(([k, v]): [string, string] => [`--cc-${kebab(k)}`, v]),
    // A themed region paints itself, so nested themes show their own surface.
    ['color', 'var(--cc-text)'],
    ['background-color', 'var(--cc-surface)'],
  ];
  return `${LAYERS}\n\n${layer('cc.theme', [block(selector, decls)])}`;
}

const isColor = (t: string) => !/^(radius|font|icon|control|gap|cell|badge|focus-|row)/.test(t);

/** Tailwind 4 preset: `bg-cc-surface`, `text-cc-text-muted`, `rounded-cc-md`, `font-cc-mono`. */
export function tailwindCss(): string {
  const decls: Decls = [
    ...semanticTokens
      .filter(isColor)
      .map((t): [string, string] => [`--color-cc-${t}`, `var(--cc-${t})`]),
    ...semanticTokens
      .filter((t) => /^(radius|font)-/.test(t))
      .map((t): [string, string] => [`--${t.replace('-', '-cc-')}`, `var(--cc-${t})`]),
    ['--ease-cc-out', 'var(--cc-ease-out)'],
  ];
  // `inline` makes utilities read the variables, so nested themes repaint.
  return `${block('@theme inline', decls, '')}\n`;
}

/** shadcn-svelte variables mapped onto CodeCora tokens. */
export function shadcnCss(): string {
  const map: Record<string, string> = {
    background: 'surface',
    foreground: 'text',
    card: 'surface-raised',
    'card-foreground': 'text',
    popover: 'surface-raised',
    'popover-foreground': 'text',
    primary: 'accent',
    'primary-foreground': 'accent-text',
    secondary: 'surface-sunken',
    'secondary-foreground': 'text',
    muted: 'surface-sunken',
    'muted-foreground': 'text-muted',
    accent: 'surface-hover',
    'accent-foreground': 'text',
    destructive: 'danger',
    'destructive-foreground': 'danger-text',
    border: 'border',
    input: 'border-strong',
    ring: 'focus',
    radius: 'radius-md',
    sidebar: 'surface-sunken',
    'sidebar-foreground': 'text',
    'sidebar-primary': 'accent',
    'sidebar-primary-foreground': 'accent-text',
    'sidebar-accent': 'surface-hover',
    'sidebar-accent-foreground': 'text',
    'sidebar-border': 'border',
    'sidebar-ring': 'focus',
  };
  const decls = Object.entries(map).map(([k, v]): [string, string] => [`--${k}`, `var(--cc-${v})`]);
  return `${LAYERS}\n\n${layer('cc.base', [block(SCOPES, decls)])}`;
}
