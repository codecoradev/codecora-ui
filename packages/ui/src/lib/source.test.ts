import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = import.meta.dirname;
const css = readFileSync(join(dir, 'source.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const sources = [...css.matchAll(/@source\s+(not\s+)?'([^']+)'/g)];

describe('source.css', () => {
  it('lists single component files, not folders or globs', () => {
    for (const [, not, path] of sources) {
      expect(not).toBeUndefined();
      expect(path).toMatch(/^\.\/[A-Z]\w*\.svelte$/);
    }
  });

  it('lists only components that exist and carry no <style> block', () => {
    for (const [, , path] of sources) {
      const file = join(dir, path!);
      expect(existsSync(file)).toBe(true);
      expect(readFileSync(file, 'utf8')).not.toMatch(/<style[\s>]/);
    }
  });
});
