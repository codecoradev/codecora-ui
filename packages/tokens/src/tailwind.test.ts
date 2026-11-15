// @vitest-environment jsdom
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { semanticTokens } from './schema.js';
import {
  darkSelector,
  shadcnExtensions,
  tailwindAnimations,
  tailwindKeyframes,
  tailwindKeys,
  tailwindThemeCss,
  tailwindUtilities,
  themeVariables,
} from './tailwind.js';

const css = tailwindThemeCss();

/** Runs Tailwind on theme.css and returns the CSS for the given classes. */
async function build(candidates: string[]): Promise<string> {
  const compiler = await compile(`${css}\n@tailwind utilities;`);
  return compiler.build(candidates);
}

describe('theme.css', () => {
  it('keeps every token layer inside Tailwind base, so utilities win over tokens', () => {
    const layers = new Set([...css.matchAll(/@layer ([\w.]+)[ {,;]/g)].map((m) => m[1]));
    expect([...layers].sort()).toEqual(['base.cc.base', 'base.cc.modifier', 'base.cc.theme']);
    expect(css).not.toMatch(/@layer cc\./);
  });

  it('declares every shadcn and extension variable where a theme or accent can change', () => {
    for (const [name, token] of Object.entries(themeVariables))
      expect(css).toContain(`--${name}: var(--cc-${token});`);
    expect(css).toMatch(/:root, \[data-theme\], \[data-accent\] \{\s+--background:/);
  });

  it('reads only tokens that exist', () => {
    const known = new Set<string>(semanticTokens);
    for (const token of Object.values(themeVariables)) expect(known).toContain(token);
  });

  it('names extensions in the shadcn pattern', () => {
    for (const name of Object.keys(shadcnExtensions))
      expect(name).toMatch(/^[a-z]+(-(foreground|hover|soft))?$/);
  });

  it('leaves the Tailwind type scale and easing names alone', () => {
    expect(
      Object.keys(tailwindKeys).filter((k) => /^(text|ease-(out|in|in-out))$/.test(k)),
    ).toEqual([]);
    expect(css).not.toMatch(/--text-[\w-]+:/);
    expect(css).not.toMatch(/--ease-(in|out|in-out):/);
  });
});

describe('theme.css compiled by Tailwind', () => {
  it('turns shadcn names into colour utilities that read the variable', async () => {
    const out = await build([
      'bg-primary',
      'text-muted-foreground',
      'border-input',
      'bg-success-soft',
    ]);
    expect(out).toContain('background-color: var(--primary)');
    expect(out).toContain('color: var(--muted-foreground)');
    expect(out).toContain('border-color: var(--input)');
    expect(out).toContain('background-color: var(--success-soft)');
  });

  it('mixes opacity on a variable colour', async () => {
    expect(await build(['bg-primary/90'])).toMatch(
      /color-mix\(in (srgb|oklab), var\(--primary\) 90%/,
    );
  });

  it('sizes controls from the density tokens', async () => {
    const out = await build(['h-control', 'px-control-x', 'gap-stack', 'py-cell-y', 'size-icon']);
    expect(out).toContain('height: var(--cc-control-h)');
    expect(out).toContain('padding-inline: var(--cc-control-px)');
    expect(out).toContain('gap: var(--cc-gap)');
    expect(out).toContain('padding-block: var(--cc-cell-py)');
    expect(out).toContain('width: var(--cc-icon-size)');
  });

  it('reads radius, fonts, shadows and easing from the theme', async () => {
    const out = await build([
      'rounded-md',
      'font-display',
      'shadow-popover',
      'ease-spring',
      'ease-enter',
    ]);
    expect(out).toContain('border-radius: var(--cc-radius-md)');
    expect(out).toContain('font-family: var(--cc-font-display)');
    expect(out).toContain('var(--cc-shadow-popover)');
    expect(out).toContain('transition-timing-function: var(--cc-ease-spring)');
    expect(out).toContain('transition-timing-function: var(--cc-ease-out)');
  });

  it('times transitions with the duration tokens and stacks with the layer tokens', async () => {
    const names = Object.keys(tailwindUtilities);
    const out = await build(names);
    for (const name of names) expect(out).toContain(`.${name} {`);
    expect(out).toContain('transition-duration: var(--cc-duration-fast)');
    expect(out).toContain('z-index: var(--cc-layer-popover)');
  });

  it('emits dark: with the theme selector and registers --tw-duration', async () => {
    const out = await build(['dark:bg-card', 'duration-fast']);
    const rule = out.slice(out.indexOf('.dark\\:bg-card'));
    expect(rule).toContain('[data-theme=corin]');
    expect(out).toMatch(/@property --tw-duration \{\s+syntax: "\*";\s+inherits: false;/);
  });
});

describe('overlay animations', () => {
  const names = Object.keys(tailwindAnimations).map((k) => `animate-${k}`);

  it('compile to animate-* utilities with their keyframes', async () => {
    const out = await build(names);
    for (const [key, value] of Object.entries(tailwindAnimations))
      expect(out).toContain(`.animate-${key} {\n  animation: ${value};`);
    for (const name of Object.keys(tailwindKeyframes))
      expect(out).toContain(`@keyframes ${name} {`);
  });

  it('emit no keyframes nobody uses', async () => {
    const out = await build(['animate-popover-in']);
    expect(out).toContain('@keyframes cc-popover-in');
    expect(out).not.toContain('@keyframes cc-dialog-in');
  });

  it('use only keyframes that exist, timed by the duration and easing tokens', () => {
    for (const value of Object.values(tailwindAnimations))
      for (const part of value.split(/,(?![^(]*\))/)) {
        const [name] = part.trim().split(' ');
        expect(Object.keys(tailwindKeyframes)).toContain(name);
        expect(part).toMatch(/var\(--cc-duration-(instant|fast|normal|slow)\) var\(--cc-ease-/);
      }
  });

  it('spring only movement and run exits one step shorter with ease-exit', () => {
    const steps = ['instant', 'fast', 'normal', 'slow'];
    const step = (v: string) =>
      Math.max(...[...v.matchAll(/--cc-duration-(\w+)/g)].map((m) => steps.indexOf(m[1]!)));
    for (const [key, value] of Object.entries(tailwindAnimations)) {
      for (const part of value.split(/,(?![^(]*\))/).filter((p) => p.includes('ease-spring'))) {
        const frames = Object.values(tailwindKeyframes[part.trim().split(' ')[0]!]!);
        for (const decls of frames) expect(Object.keys(decls)).toEqual(['transform']);
      }
      if (!key.endsWith('-out')) continue;
      expect(value).toMatch(/var\(--cc-ease-exit\) forwards$/);
      const entry = tailwindAnimations[key.replace(/-out$/, '-in')]!;
      const enterStep = Math.min(
        ...[...entry.matchAll(/--cc-duration-(\w+)\) var\(--cc-ease-out/g)].map((m) =>
          steps.indexOf(m[1]!),
        ),
      );
      expect(step(value), key).toBe(enterStep - 1);
    }
  });

  it('honour reduced motion: durations drop to 0ms and the motion-reduce classes win', async () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[^}]*--cc-duration-normal: 0ms;[^}]*--cc-ease-spring: var\(--cc-ease-out\)/,
    );
    const out = await build([
      'animate-dialog-in',
      'data-[state=closed]:animate-dialog-out',
      'motion-reduce:animate-none',
      'motion-reduce:data-[state=closed]:animate-none',
    ]);
    const closed = out.indexOf(
      '.data-\\[state\\=closed\\]\\:animate-dialog-out[data-state="closed"]',
    );
    expect(closed).toBeGreaterThan(-1);
    // The open state: one class, so motion-reduce:animate-none (one class, emitted later) wins.
    expect(out).toMatch(/\.motion-reduce\\:animate-none \{\s+animation: none;/);
    // The closed state is class + attribute; only a rule with the same two parts, emitted
    // after it, beats it, so components add motion-reduce:data-[state=closed]:animate-none.
    const reduceClosed = out.indexOf(
      '.motion-reduce\\:data-\\[state\\=closed\\]\\:animate-none[data-state="closed"]',
    );
    expect(reduceClosed).toBeGreaterThan(closed);
    expect(out.slice(reduceClosed)).toMatch(/^[^{]*\{\s+animation: none;/);
    // ...and it sits inside the reduced-motion media block (no top-level `}` in between).
    const media = out.lastIndexOf('@media (prefers-reduced-motion: reduce)', reduceClosed);
    expect(media).toBeGreaterThan(-1);
    expect(out.slice(media, reduceClosed)).not.toMatch(/\n\}/);
  });
});

describe('dark: follows the nearest theme', () => {
  const selector = `:where(${darkSelector()})`;

  /** Builds nested elements from theme names (or `.dark`) and returns the innermost child. */
  function nest(...themes: string[]): Element {
    document.body.replaceChildren();
    let parent: Element = document.body;
    for (const t of themes) {
      const el = document.createElement('div');
      if (t === '.dark') el.className = 'dark';
      else el.setAttribute('data-theme', t);
      parent.append(el);
      parent = el;
    }
    const leaf = document.createElement('span');
    parent.append(leaf);
    return leaf;
  }

  it('stays short enough to repeat on every dark: utility', () => {
    expect(selector.length).toBeLessThan(1024);
  });

  it.each([
    [['corin'], true],
    [['neutral'], false],
    [['neutral', 'corin'], true],
    [['corin', 'neutral'], false],
    [['corin', 'dimmed'], true],
    [['uteke', 'corin', 'tagfold'], true],
    // Known limit: a dark theme inside a light one inside a dark one reads as light.
    [['corin', 'neutral', 'gaira'], false],
    [['.dark'], true],
    [['.dark', 'neutral'], false],
    [[], false],
  ])('%j -> %s', (themes, dark) => {
    expect(nest(...themes).matches(selector)).toBe(dark);
  });

  it('matches the themed element itself', () => {
    const leaf = nest('neutral', 'corin');
    expect(leaf.parentElement!.matches(selector)).toBe(true);
    expect(leaf.parentElement!.parentElement!.matches(selector)).toBe(false);
  });
});
