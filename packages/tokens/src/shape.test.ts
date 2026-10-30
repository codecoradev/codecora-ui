import { describe, expect, it } from 'vitest';
import { themeCss } from './css.js';
import { themes } from './themes.js';

describe('shape hooks', () => {
  for (const theme of Object.values(themes)) {
    describe(theme.name, () => {
      const css = themeCss(theme);

      it('emits every hook as a custom property', () => {
        for (const name of [
          'badge-radius',
          'badge-case',
          'badge-tracking',
          'badge-font',
          'focus-width',
          'focus-offset',
          'row-marker',
        ]) {
          expect(css).toContain(`--cc-${name}:`);
        }
      });

      it('keeps the focus ring at least 2px thick', () => {
        expect(parseFloat(theme.shape.focusWidth)).toBeGreaterThanOrEqual(2);
      });

      it('marks a selected row by more than colour', () => {
        expect(parseFloat(theme.shape.rowMarker)).toBeGreaterThanOrEqual(2);
      });
    });
  }

  // A dark twin is the same brand, so it keeps its light theme's shape; brands must differ.
  const brands = Object.values(themes).filter((t) => !(t.twin && t.colorScheme === 'dark'));

  it('gives each brand a distinct shape beyond colour', () => {
    const shapes = brands.map((t) => JSON.stringify(t.shape));
    expect(new Set(shapes).size).toBe(shapes.length);
  });

  it('keeps a twin pair on the same shape and points both ways', () => {
    for (const theme of Object.values(themes)) {
      if (!theme.twin) continue;
      const twin = themes[theme.twin];
      expect(twin.twin).toBe(theme.name);
      expect(twin.shape).toEqual(theme.shape);
      expect(twin.colorScheme).not.toBe(theme.colorScheme);
    }
  });
});
