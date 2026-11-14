// @vitest-environment jsdom
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { colorTokens } from './schema.js';
import {
  darkSelector,
  accordionAnimations,
  tailwindAnimations,
  tailwindKeyframes,
  formAnimations,
  displayAnimations,
  tailwindKeys,
  themeKeys,
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

  it('maps every colour variable to a Tailwind colour that reads it', () => {
    for (const name of colorTokens) expect(css).toContain(`--color-${name}: var(--${name});`);
    expect(themeVariables).toEqual([...colorTokens, 'radius']);
  });

  it('keeps the theme-declared keys out of :root, so no key reads itself there', () => {
    const block = css.slice(css.indexOf('@theme inline reference {'));
    for (const key of themeKeys) expect(block).toContain(`--${key}: var(--${key});`);
    expect(css.match(/@theme inline reference \{/g)).toHaveLength(1);
  });

  it('names extensions in the shadcn pattern', () => {
    for (const name of colorTokens)
      expect(name).toMatch(
        /^[a-z]+(-[a-z]+)?(-(\d|foreground|hover|soft|primary|accent|border|ring))*$/,
      );
  });

  it('leaves no --cc- name that has a Tailwind namespace', () => {
    expect(css).not.toMatch(
      /--cc-(surface|text|accent|danger|scrim|border|radius|font|space|leading|shadow|ease|control|gap|cell)/,
    );
  });

  it('leaves the Tailwind type scale and easing names alone', () => {
    expect(
      Object.keys(tailwindKeys).filter((k) => /^(text|ease-(out|in|in-out))$/.test(k)),
    ).toEqual([]);
    expect(css).not.toMatch(/--text-[\w-]+:/);
    expect(css).not.toMatch(/--ease-(in|out|in-out):/);
    expect(css).not.toMatch(/--leading-(tight|normal|snug|relaxed|loose|none):/);
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
    expect(out).toContain('height: var(--spacing-control)');
    expect(out).toContain('padding-inline: var(--spacing-control-x)');
    expect(out).toContain('gap: var(--spacing-stack)');
    expect(out).toContain('padding-block: var(--spacing-cell-y)');
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
    expect(out).toContain('border-radius: var(--radius-md)');
    expect(out).toContain('font-family: var(--font-display)');
    expect(out).toContain('var(--shadow-popover)');
    expect(out).toContain('transition-timing-function: var(--ease-spring)');
    expect(out).toContain('transition-timing-function: var(--ease-enter)');
    // The variables come from the themes, not from Tailwind's :root.
    expect(out).not.toMatch(/--radius-md: var\(--radius-md\)/);
  });

  it('times transitions with the duration tokens and stacks with the layer tokens', async () => {
    const names = Object.keys(tailwindUtilities);
    const out = await build(names);
    for (const name of names) expect(out).toContain(`.${name} {`);
    expect(out).toContain('transition-duration: var(--cc-duration-fast)');
    expect(out).toContain('z-index: var(--cc-layer-popover)');
  });

  it('animates with token timing and emits the keyframes an animation uses', async () => {
    for (const [name, { animation, keyframes }] of Object.entries(formAnimations)) {
      expect(animation, name).toMatch(/var\(--cc-duration-\w+\) var\(--ease-\w+\)/);
      const out = await build([`animate-${name}`]);
      for (const k of Object.keys(keyframes)) expect(out, name).toContain(`@keyframes ${k}`);
    }
    expect(await build(['animate-error-in'])).not.toContain('@keyframes cc-dot-pop');
  });

  it('inherits the font in longhands, so a text or leading utility still wins', async () => {
    const out = await build(['font-inherit', 'text-[length:var(--text-sm)]', 'leading-heading']);
    expect(out).not.toMatch(/\bfont: inherit/);
    const inherit = out.indexOf('line-height: inherit');
    expect(inherit).toBeGreaterThan(-1);
    expect(out.indexOf('font-size: var(--text-sm)')).toBeGreaterThan(inherit);
    expect(out.indexOf('line-height: 1.2')).toBeGreaterThan(inherit);
  });

  it('animates the accordion with the motion tokens and emits only the keyframes in use', async () => {
    const out = await build(['data-[state=open]:animate-accordion-open']);
    expect(out).toContain(
      'animation: cc-accordion-open var(--cc-duration-normal) var(--ease-enter)',
    );
    expect(out).toMatch(/@keyframes cc-accordion-open \{/);
    expect(out).not.toContain('@keyframes cc-accordion-close');
    for (const name of Object.keys(accordionAnimations))
      expect(await build([`animate-${name}`])).toContain(`.animate-${name} {`);
  });

  it('compiles every display animation with its keyframes, and only when used', async () => {
    expect(await build(['p-4'])).not.toContain('@keyframes');
    for (const [name, { value, keyframes }] of Object.entries(displayAnimations)) {
      const out = await build([`animate-${name}`, `motion-reduce:animate-${name}`]);
      expect(out).toMatch(
        new RegExp(`\\.animate-${name} \\{\\s+animation: ${value.replace(/[()]/g, '\\$&')};`),
      );
      expect(out).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
      const kf = keyframes.match(/@keyframes ([\w-]+)/)![1]!;
      expect(value.startsWith(`${kf} `)).toBe(true);
      expect(out).toContain(`@keyframes ${kf} {`);
    }
  });

  it('keeps the spinner, skeleton and entry timings of the plain CSS', async () => {
    const out = await build([
      'animate-spinner',
      'motion-reduce:animate-spinner-reduced',
      'animate-skeleton',
      'animate-settle-in',
      'animate-fade-in',
    ]);
    expect(out).toContain('animation: cc-spin 0.8s linear infinite');
    expect(out).toContain('animation: cc-spin 2.4s linear infinite');
    expect(out).toContain('animation: cc-pulse 1.4s ease-in-out infinite');
    expect(out).toContain('animation: cc-settle-in var(--cc-duration-normal) var(--ease-enter)');
    expect(out).toContain('animation: cc-fade-in var(--cc-duration-normal) var(--ease-enter)');
    expect(out).toMatch(/@keyframes cc-spin \{\s+to \{\s+transform: rotate\(360deg\);/);
    expect(out).toMatch(/@keyframes cc-pulse \{\s+50% \{\s+opacity: 0\.45;/);
    // One cc-spin, though two animations use it.
    expect(out.match(/@keyframes cc-spin/g)).toHaveLength(1);
  });

  it('adds the measure, font-inherit and underline helpers', async () => {
    const out = await build([
      'max-w-description',
      'max-w-measure',
      'font-inherit',
      'underline-offset-text',
      'leading-heading',
    ]);
    expect(out).toContain('max-width: 40ch');
    expect(out).toContain('max-width: 72ch');
    expect(out).toContain('font-family: inherit');
    expect(out).toContain('text-underline-offset: 0.2em');
    expect(out).toContain('line-height: 1.2');
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
        expect(part).toMatch(/var\(--cc-duration-(instant|fast|normal|slow)\) var\(--ease-/);
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
      expect(value).toMatch(/var\(--ease-exit\) forwards$/);
      const entry = tailwindAnimations[key.replace(/-out$/, '-in')]!;
      const enterStep = Math.min(
        ...[...entry.matchAll(/--cc-duration-(\w+)\) var\(--ease-enter/g)].map((m) =>
          steps.indexOf(m[1]!),
        ),
      );
      expect(step(value), key).toBe(enterStep - 1);
    }
  });

  it('honour reduced motion: durations drop to 0ms and the motion-reduce classes win', async () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[^}]*--cc-duration-normal: 0ms;[^}]*--ease-spring: var\(--ease-enter\)/,
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
