import { existsSync, readFileSync } from 'node:fs';
// Source, not dist: release.yml runs the tests before the packages are built.
import { shadcnBridge, tailwindKeys, themeVariables } from '../packages/tokens/src/index.js';
import { describe, expect, it } from 'vitest';
import { withTheme } from './theme.js';

interface Item {
  name: string;
  dependencies?: string[];
  type: string;
  registryDependencies: string[];
  files: { path: string; type: string }[];
  css?: Record<string, unknown>;
  cssVars?: {
    theme: Record<string, string>;
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

const registry: { items: Item[] } = JSON.parse(
  readFileSync(new URL('registry.json', import.meta.url), 'utf8'),
);
const theme = registry.items.find((item) => item.name === 'cc-theme');
const blocks = registry.items.filter((item) => item.type === 'registry:block');
const built = (tokens = '0.7.0', ui = '0.6.0') =>
  withTheme(registry, { tokens, ui }).items.find((item) => item.name === 'cc-theme');

describe('registry', () => {
  it('has unique item names under the cc- prefix', () => {
    const names = registry.items.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name).toMatch(/^cc-[a-z-]+$/);
  });

  it('theme item imports theme.css and the ui sources, not the plain-CSS bridge', () => {
    expect(Object.keys(theme?.css ?? {})).toEqual([
      '@import "@codecora/tokens/theme.css"',
      '@import "@codecora/ui/source.css"',
    ]);
  });

  it('theme item hands every shadcn variable back to theme.css, in light and dark', () => {
    // theme.css declares them; the values shadcn wrote into :root and .dark would win.
    const names = Object.keys(themeVariables).sort();
    expect(names).toEqual(expect.arrayContaining(Object.keys(shadcnBridge)));
    for (const mode of ['light', 'dark'] as const) {
      const vars = built()?.cssVars?.[mode] ?? {};
      expect(Object.keys(vars).sort(), mode).toEqual(names);
      for (const value of Object.values(vars)) expect(value, mode).toBe('revert-layer');
    }
  });

  it("theme item writes theme.css's radius and fonts over shadcn's @theme keys", () => {
    const keys = built()?.cssVars?.theme ?? {};
    expect(Object.keys(keys).sort()).toEqual(
      ['font-display', 'font-mono', 'font-sans', 'radius-lg', 'radius-md', 'radius-sm'].sort(),
    );
    for (const [key, value] of Object.entries(keys)) expect(value, key).toBe(tailwindKeys[key]);
  });

  it('theme item asks for the package versions it is built with', () => {
    // A minor bump (0.4.0 -> 0.5.0) moves the range with it; ^0.4.0 would exclude 0.5.0.
    for (const [tokens, ui] of [
      ['0.4.0', '0.3.0'],
      ['0.5.0', '0.6.1'],
      ['1.2.3', '2.0.0'],
    ])
      expect(built(tokens, ui)?.dependencies).toEqual([
        `@codecora/tokens@^${tokens}`,
        `@codecora/ui@^${ui}`,
      ]);
    expect(theme?.dependencies, 'registry.json leaves the ranges to build.ts').toBeUndefined();
    expect(theme?.cssVars, 'registry.json leaves the variables to build.ts').toBeUndefined();
  });

  it('every block installs the theme and points at files that exist', () => {
    expect(blocks.map((b) => b.name).sort()).toEqual([
      'cc-console-overview',
      'cc-dashboard-shell',
      'cc-data-table',
      'cc-login',
      'cc-resource-detail',
      'cc-settings',
      'cc-status-panel',
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
