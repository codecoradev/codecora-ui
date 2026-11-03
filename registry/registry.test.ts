import { existsSync, readFileSync } from 'node:fs';
// Source, not dist: release.yml runs the tests before the packages are built.
import { shadcnBridge } from '../packages/tokens/src/index.js';
import { describe, expect, it } from 'vitest';
import { withTheme } from './theme.js';

interface Item {
  name: string;
  dependencies?: string[];
  type: string;
  registryDependencies: string[];
  files: { path: string; type: string }[];
  cssVars?: { light: Record<string, string>; dark: Record<string, string> };
}

const registry: { items: Item[] } = JSON.parse(
  readFileSync(new URL('registry.json', import.meta.url), 'utf8'),
);
const theme = registry.items.find((item) => item.name === 'cc-theme');
const blocks = registry.items.filter((item) => item.type === 'registry:block');

describe('registry', () => {
  it('has unique item names under the cc- prefix', () => {
    const names = registry.items.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name).toMatch(/^cc-[a-z-]+$/);
  });

  it('theme item gets the bridge map from @codecora/tokens, in light and dark', () => {
    const expected = Object.fromEntries(
      Object.entries(shadcnBridge).map(([k, v]) => [k, `var(--cc-${v})`]),
    );
    const built = withTheme(registry, '0.4.0').items.find((item) => item.name === 'cc-theme');
    expect(built?.cssVars?.light).toEqual(expected);
    expect(built?.cssVars?.dark).toEqual(expected);
  });

  it('theme item asks for the tokens version it is built with', () => {
    // A minor bump (0.4.0 -> 0.5.0) moves the range with it; ^0.4.0 would exclude 0.5.0.
    for (const version of ['0.4.0', '0.5.0', '1.2.3']) {
      const built = withTheme(registry, version).items.find((item) => item.name === 'cc-theme');
      expect(built?.dependencies).toEqual([`@codecora/tokens@^${version}`]);
    }
    expect(theme?.dependencies, 'registry.json leaves the range to build.ts').toBeUndefined();
  });

  it('every block installs the theme and points at files that exist', () => {
    expect(blocks.map((b) => b.name).sort()).toEqual([
      'cc-console-overview',
      'cc-dashboard-shell',
      'cc-data-table',
      'cc-login',
      'cc-resource-detail',
      'cc-settings',
    ]);
    for (const block of blocks) {
      expect(block.registryDependencies).toContain('local:cc-theme');
      for (const file of block.files)
        expect(existsSync(new URL(file.path, import.meta.url))).toBe(true);
    }
  });

  it('blocks read semantic tokens only: no colour literals', () => {
    for (const block of blocks)
      for (const file of block.files) {
        const source = readFileSync(new URL(file.path, import.meta.url), 'utf8');
        expect(source, file.path).not.toMatch(/#[0-9a-f]{3,8}\b|\b(rgb|hsl|oklch)a?\(/i);
      }
  });
});
