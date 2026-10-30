// WCAG 2.2 contrast for the token pairs components are allowed to combine.
// Parses the colour formats the palette uses (#hex and oklch()).
import { accentNames, statusNames, type AccentName, type Theme } from './schema.js';

/** Gamma-encoded sRGB channels in 0..1. */
type Rgb = [number, number, number];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const encode = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const decode = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

function oklchToRgb(l: number, c: number, h: number): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l3 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m3 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s3 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ].map((v) => encode(clamp(v))) as Rgb;
}

export function parseColor(value: string): Rgb {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
  }
  const ok = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/i.exec(value);
  if (ok) return oklchToRgb(Number(ok[1]) / 100, Number(ok[2]), Number(ok[3]));
  throw new Error(`unsupported colour for the contrast check: ${value}`);
}

/** `color-mix(in srgb, a <weight>, b)`, the same mix the CSS uses for `-soft` tints. */
export const mix = (a: Rgb, b: Rgb, weight: number): Rgb =>
  a.map((v, i) => v * weight + b[i]! * (1 - weight)) as Rgb;

const luminance = ([r, g, b]: Rgb) => 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b);

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Weight of the status or accent colour in a `-soft` tint. */
export const SOFT_WEIGHT = 0.14;

export interface PairResult {
  fg: string;
  bg: string;
  min: number;
  ratio: number;
  pass: boolean;
}

/** Every text and UI pair a theme must meet, for one accent. */
export function checkTheme(theme: Theme, accentName: AccentName = theme.defaultAccent) {
  const c = { ...theme.colors, ...theme.accents[accentName] };
  const rgb: Record<string, Rgb> = {};
  for (const [key, value] of Object.entries(c)) if (key !== 'scrim') rgb[key] = parseColor(value);
  for (const s of [...statusNames, 'accent'] as const)
    rgb[`${s}Soft`] = mix(rgb[s]!, rgb.surface!, SOFT_WEIGHT);

  const pairs: [fg: string, bg: string, min: number][] = [];
  const surfaces = ['surface', 'surfaceRaised', 'surfaceSunken'];
  const minText = theme.minText ?? 4.5;
  for (const bg of [...surfaces, 'surfaceHover', 'accentSoft']) pairs.push(['text', bg, minText]);
  for (const bg of surfaces) pairs.push(['textMuted', bg, minText], ['borderStrong', bg, 3]);
  for (const bg of ['surface', 'surfaceRaised']) pairs.push(['accent', bg, 4.5], ['focus', bg, 3]);
  pairs.push(['accentText', 'accent', 4.5], ['accentText', 'accentHover', 4.5]);
  for (const s of statusNames)
    pairs.push(
      [s, 'surface', 4.5],
      [s, 'surfaceRaised', 4.5],
      [s, `${s}Soft`, 4.5],
      [`${s}Text`, s, 4.5],
    );

  return pairs.map(([fg, bg, min]): PairResult => {
    const ratio = contrastRatio(rgb[fg]!, rgb[bg]!);
    return { fg, bg, min, ratio, pass: ratio >= min };
  });
}

/** `checkTheme` for every accent the theme defines. */
export const checkAllAccents = (theme: Theme) =>
  accentNames.map((name) => ({ accent: name, results: checkTheme(theme, name) }));
