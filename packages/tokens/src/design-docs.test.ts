// docs/design/<theme>.md describes each theme; its colour and radius
// frontmatter must match the token source so the design docs never drift
// from what ships.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { accentVariables, colorVariables, themeNames } from './schema.js';
import { themes } from './themes.js';

/** Reads one top-level map (`colors:`, `rounded:`) of the frontmatter. */
function frontmatter(path: URL, key: string): Record<string, string> {
  const text = readFileSync(path, 'utf8');
  const block =
    new RegExp(`^---\\n[\\s\\S]*?^${key}:\\n((?: {2}.+\\n)+)`, 'm').exec(text)?.[1] ?? '';
  return Object.fromEntries(
    [...block.matchAll(/^ {2}([\w-]+): "(.+)"$/gm)].map((m) => [m[1]!, m[2]!]),
  );
}

const doc = (name: string) => new URL(`../../../docs/design/${name}.md`, import.meta.url);

describe('design docs match the tokens', () => {
  for (const name of themeNames)
    it(`docs/design/${name}.md`, () => {
      const theme = themes[name];
      // Keyed by the variable the theme declares (`background`, `primary`, ...).
      // overlay is translucent and ring repeats primary; neither is documented as a swatch.
      const expected: Record<string, string> = {};
      for (const [k, v] of Object.entries(theme.colors))
        expected[colorVariables[k as keyof typeof theme.colors]] = v;
      for (const [k, v] of Object.entries(theme.accents[theme.defaultAccent]))
        expected[accentVariables[k as keyof typeof accentVariables]] = v;
      delete expected.overlay;
      delete expected.ring;
      expect(frontmatter(doc(name), 'colors')).toEqual(expected);
    });

  // `full` is the pill every theme shares (`rounded-full`, which Tailwind
  // emits as calc(infinity * 1px)); the docs write it as 9999px.
  for (const name of themeNames)
    it(`docs/design/${name}.md radius`, () => {
      const r = themes[name].radius;
      expect(frontmatter(doc(name), 'rounded')).toEqual({ ...r, full: '9999px' });
    });

  it('DESIGN.md names only the shared pill radius', () => {
    expect(frontmatter(new URL('../../../DESIGN.md', import.meta.url), 'rounded')).toEqual({
      full: '9999px',
    });
  });
});
