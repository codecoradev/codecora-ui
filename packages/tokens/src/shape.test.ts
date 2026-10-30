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

  it('gives the themes distinct shapes beyond colour', () => {
    const shapes = Object.values(themes).map((t) => JSON.stringify(t.shape));
    expect(new Set(shapes).size).toBe(shapes.length);
  });
});
