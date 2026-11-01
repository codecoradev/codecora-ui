import { describe, expect, it } from 'vitest';
import { LAYERS, baseCss, shadcnCss, tailwindCss, themeCss } from './css.js';
import { duration, ease, spring } from './scale.js';
import { accentNames, semanticTokens, themeNames } from './schema.js';
import { themes } from './themes.js';

const declared = (css: string) => new Set([...css.matchAll(/(--cc-[\w-]+):/g)].map((m) => m[1]));

describe('base.css', () => {
  const css = baseCss();

  it('declares the layer order first, so import order never matters', () => {
    expect(css.startsWith(LAYERS)).toBe(true);
  });

  it('puts density and accent modifiers in the modifier layer', () => {
    const modifier = css.slice(css.indexOf('@layer cc.modifier {'));
    expect(modifier).toContain("[data-density='compact']");
    for (const a of accentNames) expect(modifier).toContain(`[data-accent='${a}']`);
  });

  it('recomputes derived tints wherever a theme or accent changes', () => {
    expect(css).toMatch(/:root, \[data-theme\], \[data-accent\] \{\s+--cc-accent-soft:/);
  });

  it('declares the motion scale', () => {
    for (const k of ['instant', 'fast', 'normal', 'slow'])
      expect(css).toContain(`--cc-duration-${k}: ${duration[k as keyof typeof duration]};`);
    for (const k of ['out', 'in-out', 'exit', 'spring']) expect(css).toContain(`--cc-ease-${k}: `);
  });

  it('zeroes every duration and calms the spring for reduced motion', () => {
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    for (const k of Object.keys(duration)) expect(reduced).toContain(`--cc-duration-${k}: 0ms;`);
    expect(reduced).toContain('--cc-ease-spring: var(--cc-ease-out);');
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

describe('theme files', () => {
  for (const name of themeNames)
    it(`${name} defines every semantic token together with base.css`, () => {
      const all = declared(baseCss() + themeCss(themes[name]));
      const missing = semanticTokens.filter((t) => !all.has(`--cc-${t}`));
      expect(missing).toEqual([]);
    });

  it('applies neutral to the page at zero specificity, other themes by attribute', () => {
    expect(themeCss(themes.neutral)).toContain(":where(:root), [data-theme='neutral'] {");
    expect(themeCss(themes.corin)).toContain("[data-theme='corin'] {");
  });

  it('paints a themed region, so nested themes show their own surface', () => {
    expect(themeCss(themes.uteke)).toContain('background-color: var(--cc-surface);');
  });
});

describe('integrations', () => {
  it('Tailwind preset reads the variables under a cc- namespace', () => {
    const css = tailwindCss();
    expect(css).toMatch(/^@theme inline \{/);
    expect(css).toContain('--color-cc-surface: var(--cc-surface);');
    expect(css).toContain('--radius-cc-md: var(--cc-radius-md);');
    expect(css).toContain('--font-cc-mono: var(--cc-font-mono);');
    for (const k of Object.keys(ease))
      expect(css).toContain(`--ease-cc-${k}: var(--cc-ease-${k});`);
  });

  it('shadcn bridge maps its variables onto tokens in every scope', () => {
    const css = shadcnCss();
    expect(css).toContain('--primary: var(--cc-accent);');
    expect(css).toContain('--ring: var(--cc-focus);');
    expect(css).toContain(':root, [data-theme], [data-accent] {');
  });
});
