import { describe, expect, it } from 'vitest';
import { checkTheme, contrastRatio, parseColor } from './contrast.js';
import { accentNames, themeNames } from './schema.js';
import { themes } from './themes.js';

describe('contrast math', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio(parseColor('#000000'), parseColor('#FFFFFF'))).toBeCloseTo(21, 5);
    expect(contrastRatio(parseColor('#777777'), parseColor('#FFFFFF'))).toBeCloseTo(4.48, 2);
  });

  it('reads oklch like hex', () => {
    const [r, g, b] = parseColor('oklch(100% 0 0)');
    expect([r, g, b].map((v) => Math.round(v * 255))).toEqual([255, 255, 255]);
  });

  it('rejects colour formats it cannot check', () => {
    expect(() => parseColor('hsl(0 0% 0%)')).toThrow(/unsupported colour/);
  });
});

describe('WCAG AA in every theme', () => {
  for (const name of themeNames)
    for (const accent of accentNames)
      it(`${name} with the ${accent} accent`, () => {
        const failed = checkTheme(themes[name], accent).filter((r) => !r.pass);
        expect(failed.map((r) => `${r.fg} on ${r.bg} ${r.ratio.toFixed(2)}:1 < ${r.min}`)).toEqual(
          [],
        );
      });
});
