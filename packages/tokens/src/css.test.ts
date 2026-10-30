import { describe, expect, it } from 'vitest';
import { LAYERS, baseCss, shadcnCss, tailwindCss, themeCss } from './css.js';
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

  it('zeroes durations for reduced motion', () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]+--cc-duration-fast: 0ms/);
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
  });

  it('shadcn bridge maps its variables onto tokens in every scope', () => {
    const css = shadcnCss();
    expect(css).toContain('--primary: var(--cc-accent);');
    expect(css).toContain('--ring: var(--cc-focus);');
    expect(css).toContain(':root, [data-theme], [data-accent] {');
  });
});
