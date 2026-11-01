// @vitest-environment node
// Every `--cc-*` custom property a component reads must be one the tokens
// package emits; an unknown name silently turns the declaration into a no-op.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { baseCss, themeCss } from './css.js';
import { themes } from './themes.js';

const ui = join(import.meta.dirname, '../../ui/src/lib');

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'fixtures' ? [] : sources(path);
    return /\.svelte$/.test(entry.name) ? [path] : [];
  });
}

const emitted = new Set(
  [baseCss(), ...Object.values(themes).map(themeCss)].join('\n').match(/--cc-[\w-]+(?=:)/g),
);

describe('component token usage', () => {
  for (const file of sources(ui)) {
    it(`${file.slice(ui.length + 1)} reads only emitted tokens`, () => {
      const source = readFileSync(file, 'utf8');
      // Properties a component defines for itself (scoped custom properties) are allowed.
      const own = new Set(source.match(/--cc-[\w-]+(?=\s*:)/g));
      const used = [...source.matchAll(/var\((--cc-[\w-]+)/g)].map((m) => m[1]!);
      const unknown = used.filter((name) => !emitted.has(name) && !own.has(name));
      expect(unknown).toEqual([]);
    });
  }
});

// Motion reads the scale: a literal duration or curve would skip reduced motion.
// Endless loops (spinners, skeletons) keep their own pace and are exempt.
const motion = /(?:^|[\s;{])(transition|animation)\s*:\s*([^;]+);/g;

describe('component motion', () => {
  for (const file of sources(ui)) {
    const source = readFileSync(file, 'utf8');
    const declarations = [...source.matchAll(motion)].map((m) => ({ prop: m[1]!, value: m[2]! }));
    if (declarations.length === 0) continue;
    const name = file.slice(ui.length + 1);

    it(`${name} times motion with duration and easing tokens`, () => {
      const literal = declarations
        .filter(({ value }) => value !== 'none' && !/\binfinite\b/.test(value))
        .flatMap(({ value }) => value.split(/,(?![^(]*\))/))
        .filter((part) => !/var\(--cc-duration-/.test(part) || !/var\(--cc-ease-/.test(part));
      expect(literal).toEqual([]);
    });

    it(`${name} springs only movement, never opacity or colour`, () => {
      const offending = declarations.flatMap(({ prop, value }) =>
        value
          .split(/,(?![^(]*\))/)
          .filter((part) => part.includes('--cc-ease-spring'))
          .filter((part) => {
            const target = part.trim().split(/\s+/)[0]!;
            if (prop === 'transition') return !/^(transform|translate|scale|rotate)$/.test(target);
            const frames = source.match(
              new RegExp(`@keyframes ${target}\\s*\\{[\\s\\S]*?\\n  \\}`),
            );
            return !frames || /opacity|color|background/.test(frames[0]);
          }),
      );
      expect(offending).toEqual([]);
    });
  }
});
