// docs/design/<theme>.md describes each theme; its colour frontmatter must
// match the token source so the design docs never drift from what ships.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { kebab, themeNames } from './schema.js';
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
      const expected: Record<string, string> = {};
      // scrim is translucent and focus repeats the accent; neither is documented as a swatch.
      for (const [k, v] of Object.entries({
        ...theme.colors,
        ...theme.accents[theme.defaultAccent],
      }))
        if (k !== 'scrim' && k !== 'focus') expected[kebab(k)] = v;
      const doc = frontmatterColors(new URL(`../../../docs/design/${name}.md`, import.meta.url));
      expect(doc).toEqual(expected);
    });
});
