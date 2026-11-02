import { existsSync, readFileSync } from 'node:fs';
// Source, not dist: release.yml runs the tests before the packages are built.
import { shadcnBridge } from '../packages/tokens/src/index.js';
import { describe, expect, it } from 'vitest';

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

  it('theme item writes the same map as @codecora/tokens/shadcn.css, in light and dark', () => {
    const expected = Object.fromEntries(
      Object.entries(shadcnBridge).map(([k, v]) => [k, `var(--cc-${v})`]),
    );
    expect(theme?.cssVars?.light).toEqual(expected);
    expect(theme?.cssVars?.dark).toEqual(expected);
  });

  it('theme item asks for the current @codecora/tokens minor', () => {
    // The theme item has no files to detect it from, so registry.json names it.
    // After a tokens release, update the range in registry.json.
    const { version } = JSON.parse(
      readFileSync(new URL('../packages/tokens/package.json', import.meta.url), 'utf8'),
    ) as { version: string };
    const minor = version.split('.').slice(0, 2).join('.');
    expect(theme?.dependencies).toEqual([`@codecora/tokens@^${minor}.0`]);
  });

  it('every block installs the theme and points at files that exist', () => {
    expect(blocks.map((b) => b.name).sort()).toEqual([
      'cc-dashboard-shell',
      'cc-data-table',
      'cc-login',
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
