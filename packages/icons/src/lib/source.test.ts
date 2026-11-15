import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = import.meta.dirname;
const css = readFileSync(join(dir, 'source.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const sources = [...css.matchAll(/@source\s+(not\s+)?'([^']+)'/g)];

describe('source.css', () => {
  it('lists single component files, not folders or globs', () => {
    for (const [, not, path] of sources) {
      expect(not).toBeUndefined();
      expect(path).toMatch(/^\.\/(internal\/)?[A-Z]\w*\.svelte$/);
    }
  });

  it('lists only components that exist and carry no <style> block', () => {
    for (const [, , path] of sources) {
      const file = join(dir, path!);
      expect(existsSync(file)).toBe(true);
      expect(readFileSync(file, 'utf8')).not.toMatch(/<style[\s>]/);
    }
  });

  it('lists every component, so a new one cannot ship unstyled', () => {
    const listed = new Set(sources.map(([, , path]) => path));
    const components = readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter((f) => /^(internal\/)?[A-Z]\w*\.svelte$/.test(f))
      .map((f) => `./${f}`);
    expect(components.length).toBeGreaterThan(0);
    expect(components.filter((c) => !listed.has(c))).toEqual([]);
  });
});
