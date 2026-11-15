// The token layers of theme.css. Themes declare the shadcn variable names and
// Tailwind's theme keys directly (D13); tokens Tailwind has no namespace for
// keep the `--cc-` prefix. Cascade layers inside Tailwind's `base` make the
// result independent of import order: base (primitives, derived values) <
// theme < modifier (data-density, data-accent). Utilities always win over a
// token, and unlayered app CSS still overrides any token.
import { SOFT_WEIGHT } from './contrast.js';
import { density, duration, ease, layer as layers, press } from './scale.js';
import {
  accentNames,
  accentVariables,
  aliasVariables,
  colorVariables,
  densities,
  kebab,
  softVariables,
  type AccentName,
  type Density,
  type Theme,
  type ThemeShadow,
} from './schema.js';

export const LAYERS = '@layer base.cc.base, base.cc.theme, base.cc.modifier;';

/** Elements where a theme or an accent can change, so derived values are re-declared there. */
export const SCOPES = ':root, [data-theme], [data-accent]';

/** Soft drops tinted by the theme's overlay, for themes that set no `shadow`. */
const defaultShadow: ThemeShadow = {
  popover: '0 0.5rem 1.5rem color-mix(in srgb, var(--overlay) 50%, transparent)',
  modal: '0 1rem 2.5rem color-mix(in srgb, var(--overlay) 60%, transparent)',
};

/** Tailwind spacing keys `data-density` switches: `h-control`, `px-control-x`, `gap-stack`. */
export const densityVariables: Readonly<Record<keyof (typeof density)['comfortable'], string>> = {
  controlH: 'spacing-control',
  controlPx: 'spacing-control-x',
  controlPy: 'spacing-control-y',
  gap: 'spacing-stack',
  cellPx: 'spacing-cell-x',
  cellPy: 'spacing-cell-y',
};

/** Variables that follow `--primary` or `--ring`, so `data-accent` must re-declare them. */
const followsAccent = new Set(Object.values(accentVariables));

type Decls = [name: string, value: string][];

const block = (selector: string, decls: Decls, indent = '  ') =>
  `${indent}${selector} {\n${decls.map(([n, v]) => `${indent}  ${n}: ${v};`).join('\n')}\n${indent}}`;

const layer = (name: string, body: string[]) => `@layer ${name} {\n${body.join('\n\n')}\n}\n`;

const densityDecls = (d: Density): Decls =>
  Object.entries(density[d]).map(([k, v]) => [
    `--${densityVariables[k as keyof typeof densityVariables]}`,
    v,
  ]);

/** Internal per-theme palette of one accent, read by `data-accent`: `--cc-primary-violet`. */
const accentPalette = (a: AccentName) => ({
  accent: `--cc-primary-${a}`,
  accentHover: `--cc-primary-${a}-hover`,
  accentText: `--cc-primary-${a}-foreground`,
  focus: `--cc-ring-${a}`,
});

/** The four accent variables, read from one accent's palette. */
const accentDecls = (a: AccentName): Decls =>
  Object.entries(accentPalette(a)).map(([k, v]): [string, string] => [
    `--${accentVariables[k as keyof typeof accentVariables]}`,
    `var(${v})`,
  ]);

/** Motion, stacking, density defaults, derived values and the modifiers. */
export function baseCss(): string {
  const base = layer('base.cc.base', [
    block(':root', [
      ...Object.entries(ease).map(([k, v]): [string, string] => [`--ease-${k}`, v]),
      ...Object.entries(duration).map(([k, v]): [string, string] => [`--cc-duration-${k}`, v]),
      ...Object.entries(layers).map(([k, v]): [string, string] => [`--cc-layer-${k}`, v]),
      ['--cc-press-scale', press.scale],
      ...densityDecls('comfortable'),
    ]),
    block(SCOPES, [
      ...softVariables.map((name): [string, string] => [
        `--${name}-soft`,
        `color-mix(in srgb, var(--${name}) ${Math.round(SOFT_WEIGHT * 100)}%, var(--background))`,
      ]),
      ...Object.entries(aliasVariables)
        .filter(([, source]) => followsAccent.has(source))
        .map(([name, source]): [string, string] => [`--${name}`, `var(--${source})`]),
    ]),
    `  @media (prefers-reduced-motion: reduce) {\n${block(
      ':root',
      [
        ...Object.keys(duration).map((k): [string, string] => [`--cc-duration-${k}`, '0ms']),
        ['--ease-spring', 'var(--ease-enter)'],
        ['--cc-press-scale', '1'],
      ],
      '    ',
    )}\n  }`,
  ]);
  const modifier = layer('base.cc.modifier', [
    ...densities.map((d) => block(`[data-density='${d}']`, densityDecls(d))),
    ...accentNames.map((a) => block(`[data-accent='${a}']`, accentDecls(a))),
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
  const value: Record<string, string> = Object.fromEntries(
    Object.entries(colors).map(([k, v]) => [colorVariables[k as keyof typeof colors], v]),
  );
  const decls: Decls = [
    ['color-scheme', theme.colorScheme],
    ...Object.entries(value).map(([k, v]): [string, string] => [`--${k}`, v]),
    // Aliases of theme colours repeat the value; those that follow the accent live in base.
    ...Object.entries(aliasVariables)
      .filter(([, source]) => !followsAccent.has(source))
      .map(([name, source]): [string, string] => [`--${name}`, value[source]!]),
    ...accentNames.flatMap((a): Decls =>
      Object.entries(accentPalette(a)).map(([k, v]): [string, string] => [
        v,
        accents[a][k as keyof (typeof accents)[typeof a]],
      ]),
    ),
    ...accentDecls(defaultAccent),
    ...Object.entries(theme.radius).map(([k, v]): [string, string] => [`--radius-${k}`, v]),
    ['--radius', theme.radius.md],
    ...Object.entries(theme.font).map(([k, v]): [string, string] => [`--font-${k}`, v]),
    ...Object.entries(theme.icon).map(([k, v]): [string, string] => [`--cc-icon-${k}`, v]),
    ...Object.entries(theme.shape).map(([k, v]): [string, string] => [`--cc-${kebab(k)}`, v]),
    ...Object.entries(theme.shadow ?? defaultShadow).map(([k, v]): [string, string] => [
      `--shadow-${k}`,
      v,
    ]),
    // A themed region paints itself, so nested themes show their own surface.
    ['color', 'var(--foreground)'],
    ['background-color', 'var(--background)'],
  ];
  return `${LAYERS}\n\n${layer('base.cc.theme', [block(selector, decls)])}`;
}
