import { describe, expect, it } from 'vitest';
import { LAYERS, SCOPES, baseCss, themeCss } from './css.js';
import { duration, ease, spring } from './scale.js';
import {
  accentNames,
  accentVariables,
  aliasVariables,
  colorTokens,
  colorVariables,
  semanticTokens,
  softVariables,
  themeNames,
} from './schema.js';
import { themes } from './themes.js';

const declared = (css: string) => new Set([...css.matchAll(/--([\w-]+):/g)].map((m) => m[1]));

describe('base layer', () => {
  const css = baseCss();

  it('declares the layer order first, inside Tailwind base, so import order never matters', () => {
    expect(css.startsWith(LAYERS)).toBe(true);
    expect(LAYERS).toBe('@layer base.cc.base, base.cc.theme, base.cc.modifier;');
  });

  it('puts density and accent modifiers in the modifier layer', () => {
    const modifier = css.slice(css.indexOf('@layer base.cc.modifier {'));
    expect(modifier).toMatch(/\[data-density='compact'\] \{\s+--spacing-control: 2rem;/);
    for (const a of accentNames)
      expect(modifier).toContain(
        `[data-accent='${a}'] {\n    --primary: var(--cc-primary-${a});\n    --primary-hover: var(--cc-primary-${a}-hover);\n    --primary-foreground: var(--cc-primary-${a}-foreground);\n    --ring: var(--cc-ring-${a});`,
      );
  });

  it('re-declares tints and accent aliases wherever a theme or accent changes', () => {
    const scoped = css.slice(css.indexOf(`${SCOPES} {`));
    expect(SCOPES).toBe(':root, [data-theme], [data-accent]');
    for (const name of softVariables)
      expect(scoped).toContain(
        `--${name}-soft: color-mix(in srgb, var(--${name}) 14%, var(--background));`,
      );
    for (const name of ['chart-1', 'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-ring'])
      expect(scoped).toContain(`--${name}: var(--${aliasVariables[name]});`);
  });

  it('declares the motion scale under Tailwind easing names and cc- durations', () => {
    for (const k of ['instant', 'fast', 'normal', 'slow'])
      expect(css).toContain(`--cc-duration-${k}: ${duration[k as keyof typeof duration]};`);
    for (const k of ['enter', 'move', 'exit', 'spring']) expect(css).toContain(`--ease-${k}: `);
    expect(css).not.toMatch(/--ease-(in|out|in-out):/);
  });

  it('zeroes every duration and calms the spring for reduced motion', () => {
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    for (const k of Object.keys(duration)) expect(reduced).toContain(`--cc-duration-${k}: 0ms;`);
    expect(reduced).toContain('--ease-spring: var(--ease-enter);');
    // A press is scale, not time, so reduced motion turns it off by making it 1.
    expect(css).toContain('--cc-press-scale: 0.98;');
    expect(reduced).toContain('--cc-press-scale: 1;');
  });
});

describe('spring easing', () => {
  const points = (curve: string) => curve.slice('linear('.length, -1).split(', ').map(Number);

  it('starts at 0, ends at rest on 1 and overshoots by a small amount', () => {
    const p = points(ease.spring);
    expect(p[0]).toBe(0);
    expect(p.at(-1)).toBe(1);
    expect(Math.max(...p)).toBeGreaterThan(1);
    expect(Math.max(...p)).toBeLessThan(1.06);
  });

  it('samples the requested number of segments', () => {
    expect(points(spring(0.7, 10, 8))).toHaveLength(9);
  });
});

describe('themes', () => {
  it('list every colour variable once, from the colour, accent, alias and tint maps', () => {
    const derived = [
      ...Object.values(colorVariables),
      ...Object.values(accentVariables),
      ...Object.keys(aliasVariables),
      ...softVariables.map((v) => `${v}-soft`),
    ];
    expect([...colorTokens].sort()).toEqual([...new Set(derived)].sort());
    expect(derived).toHaveLength(colorTokens.length);
  });

  for (const name of themeNames)
    it(`${name} declares every semantic token together with the base layer`, () => {
      const all = declared(baseCss() + themeCss(themes[name]));
      const missing = semanticTokens.filter((t) => !all.has(t));
      expect(missing).toEqual([]);
    });

  it('declares only the shadcn names, Tailwind keys and cc- tokens', () => {
    const all = declared(baseCss() + themeNames.map((n) => themeCss(themes[n])).join('\n'));
    const known = new Set<string>(semanticTokens);
    const internal = /^cc-(primary|ring)-[a-z]+(-hover|-foreground)?$/;
    expect([...all].filter((v) => !known.has(v!) && !internal.test(v!))).toEqual([]);
  });

  it('writes the theme colours under their shadcn names', () => {
    const css = themeCss(themes.corin);
    expect(css).toContain(`--background: ${themes.corin.colors.surface};`);
    expect(css).toContain(`--muted-foreground: ${themes.corin.colors.textMuted};`);
    expect(css).toContain(`--popover: ${themes.corin.colors.surfaceRaised};`);
    expect(css).toContain(`--primary: var(--cc-primary-${themes.corin.defaultAccent});`);
    expect(css).toContain(`--radius: ${themes.corin.radius.md};`);
    expect(css).not.toMatch(/--cc-(surface|text|accent|danger|scrim|radius|font|shadow)/);
  });

  it('applies neutral to the page at zero specificity, other themes by attribute', () => {
    expect(themeCss(themes.neutral)).toContain(":where(:root), [data-theme='neutral'] {");
    expect(themeCss(themes.corin)).toContain("[data-theme='corin'] {");
  });

  it('paints a themed region, so nested themes show their own surface', () => {
    expect(themeCss(themes.uteke)).toContain('background-color: var(--background);');
  });
});
