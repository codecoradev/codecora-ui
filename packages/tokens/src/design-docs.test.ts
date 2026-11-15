// docs/design/<theme>.md describes each theme; its colour frontmatter must
// match the token source so the design docs never drift from what ships.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { accentVariables, colorVariables, themeNames } from './schema.js';
import { themes } from './themes.js';

function frontmatterColors(path: URL): Record<string, string> {
  const text = readFileSync(path, 'utf8');
  const block = /^---\n[\s\S]*?^colors:\n((?: {2}.+\n)+)/m.exec(text)?.[1] ?? '';
  return Object.fromEntries(
    [...block.matchAll(/^ {2}([\w-]+): "(.+)"$/gm)].map((m) => [m[1]!, m[2]!]),
  );
}

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
      const doc = frontmatterColors(new URL(`../../../docs/design/${name}.md`, import.meta.url));
      expect(doc).toEqual(expected);
    });
});
