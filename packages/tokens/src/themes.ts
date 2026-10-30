// Tier 3, themes: each maps the semantic tokens onto palette entries.
import {
  dark,
  dusk,
  graphite,
  light,
  night,
  paper,
  scrim,
  sepia as sepiaPaper,
  slate,
  stark,
} from './palette.js';
import type { AccentColors, AccentName, Theme, ThemeName } from './schema.js';

type Hue = readonly [fill: string, hover: string, onFill: string];

const accent = ([fill, hover, onFill]: Hue): AccentColors => ({
  accent: fill,
  accentHover: hover,
  accentText: onFill,
  focus: fill,
});

const accents = (set: Record<AccentName, Hue>): Record<AccentName, AccentColors> => ({
  blue: accent(set.blue),
  green: accent(set.green),
  teal: accent(set.teal),
  violet: accent(set.violet),
  orange: accent(set.orange),
  indigo: accent(set.indigo),
  cyan: accent(set.cyan),
});

const systemSans = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const systemMono = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
const jetbrainsMono = `'JetBrains Mono', ${systemMono}`;
const readingSerif = "'Source Serif 4', 'Iowan Old Style', Charter, Georgia, serif";

/** Quiet default: cool greys, blue accent, system fonts. */
const neutral: Theme = {
  name: 'neutral',
  label: 'Neutral',
  colorScheme: 'light',
  colors: {
    surface: slate[50],
    surfaceRaised: slate[25],
    surfaceSunken: slate[100],
    surfaceHover: slate[150],
    border: slate[200],
    borderStrong: slate[500],
    text: slate[900],
    textMuted: slate[600],
    danger: light.red[0],
    dangerText: light.red[2],
    success: light.green[0],
    successText: light.green[2],
    warning: light.amber[0],
    warningText: light.amber[2],
    scrim: scrim.slate,
  },
  accents: accents(light),
  defaultAccent: 'blue',
  radius: { sm: '4px', md: '8px', lg: '12px', pill: '999px' },
  font: { sans: systemSans, display: systemSans, mono: systemMono },
  icon: { stroke: '2', size: '1.25rem' },
  shape: {
    badgeRadius: 'var(--cc-radius-pill)',
    badgeCase: 'none',
    badgeTracking: '0',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '2px',
    focusOffset: '2px',
    rowMarker: '2px',
  },
  twin: 'neutral-dark',
};

/** Editorial light from uteke.app: green paper, ink, one green accent. */
const uteke: Theme = {
  name: 'uteke',
  label: 'Uteke',
  colorScheme: 'light',
  colors: {
    surface: paper.base,
    surfaceRaised: paper.raised,
    surfaceSunken: paper.sunken,
    surfaceHover: paper.hover,
    border: paper.rule,
    borderStrong: paper.neutral,
    text: paper.ink,
    textMuted: paper.neutral,
    danger: light.red[0],
    dangerText: light.red[2],
    success: light.green[0],
    successText: light.green[2],
    warning: light.amber[0],
    warningText: light.amber[2],
    scrim: scrim.paper,
  },
  accents: accents(light),
  defaultAccent: 'green',
  radius: { sm: '4px', md: '6px', lg: '10px', pill: '999px' },
  font: {
    sans: `'Geist', ${systemSans}`,
    display: `'Space Grotesk', ${systemSans}`,
    mono: jetbrainsMono,
  },
  icon: { stroke: '1.75', size: '1.25rem' },
  // Printed-label feel: small caps tags, a wider ring, a ruled marker on the selected row.
  shape: {
    badgeRadius: 'var(--cc-radius-sm)',
    badgeCase: 'uppercase',
    badgeTracking: '0.06em',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '2px',
    focusOffset: '3px',
    rowMarker: '3px',
  },
  twin: 'uteke-dark',
};

/** Editor-grade dark from Corin: deep chrome, teal accent, mono for data. */
const corin: Theme = {
  name: 'corin',
  label: 'Corin',
  colorScheme: 'dark',
  colors: {
    surface: night.base,
    surfaceRaised: night.mantle,
    surfaceSunken: night.crust,
    surfaceHover: night.surface0,
    border: night.surface0,
    borderStrong: night.overlay,
    text: night.text,
    textMuted: night.subtext,
    danger: dark.red[0],
    dangerText: dark.red[2],
    success: dark.green[0],
    successText: dark.green[2],
    warning: dark.amber[0],
    warningText: dark.amber[2],
    scrim: scrim.night,
  },
  accents: accents(dark),
  defaultAccent: 'teal',
  radius: { sm: '5px', md: '10px', lg: '14px', pill: '999px' },
  font: { sans: systemSans, display: systemSans, mono: jetbrainsMono },
  icon: { stroke: '1.75', size: '1.25rem' },
  // Console feel: mono data tags, a tight ring, a slim marker on the selected row.
  shape: {
    badgeRadius: 'var(--cc-radius-sm)',
    badgeCase: 'none',
    badgeTracking: '0',
    badgeFont: 'var(--cc-font-mono)',
    focusWidth: '2px',
    focusOffset: '1px',
    rowMarker: '2px',
  },
};

/** The Plain Workbench after dark: graphite surfaces, the neutral blue accent. */
const neutralDark: Theme = {
  ...neutral,
  name: 'neutral-dark',
  label: 'Neutral dark',
  colorScheme: 'dark',
  colors: {
    surface: graphite.base,
    surfaceRaised: graphite.mantle,
    surfaceSunken: graphite.crust,
    surfaceHover: graphite.hover,
    border: graphite.rule,
    borderStrong: graphite.strong,
    text: graphite.text,
    textMuted: graphite.muted,
    danger: dark.red[0],
    dangerText: dark.red[2],
    success: dark.green[0],
    successText: dark.green[2],
    warning: dark.amber[0],
    warningText: dark.amber[2],
    scrim: scrim.graphite,
  },
  accents: accents(dark),
  twin: 'neutral',
};

/** The Field Notebook by lamplight: green-black paper, the same type and label shapes. */
const utekeDark: Theme = {
  ...uteke,
  name: 'uteke-dark',
  label: 'Uteke dark',
  colorScheme: 'dark',
  colors: {
    surface: dusk.base,
    surfaceRaised: dusk.mantle,
    surfaceSunken: dusk.crust,
    surfaceHover: dusk.hover,
    border: dusk.rule,
    borderStrong: dusk.strong,
    text: dusk.text,
    textMuted: dusk.muted,
    danger: dark.red[0],
    dangerText: dark.red[2],
    success: dark.green[0],
    successText: dark.green[2],
    warning: dark.amber[0],
    warningText: dark.amber[2],
    scrim: scrim.dusk,
  },
  accents: accents(dark),
  twin: 'uteke',
};

/** The Reading Room: a warm printed page set in a serif, for long text. */
const sepia: Theme = {
  name: 'sepia',
  label: 'Sepia',
  colorScheme: 'light',
  colors: {
    surface: sepiaPaper.base,
    surfaceRaised: sepiaPaper.raised,
    surfaceSunken: sepiaPaper.sunken,
    surfaceHover: sepiaPaper.hover,
    border: sepiaPaper.rule,
    borderStrong: sepiaPaper.strong,
    text: sepiaPaper.ink,
    textMuted: sepiaPaper.muted,
    danger: light.red[0],
    dangerText: light.red[2],
    success: light.green[0],
    successText: light.green[2],
    warning: light.amber[0],
    warningText: light.amber[2],
    scrim: scrim.sepia,
  },
  accents: accents(light),
  defaultAccent: 'orange',
  radius: { sm: '3px', md: '6px', lg: '10px', pill: '999px' },
  font: { sans: readingSerif, display: readingSerif, mono: jetbrainsMono },
  icon: { stroke: '1.75', size: '1.25rem' },
  shape: {
    badgeRadius: 'var(--cc-radius-sm)',
    badgeCase: 'none',
    badgeTracking: '0.02em',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '2px',
    focusOffset: '3px',
    rowMarker: '3px',
  },
};

/** High Beam: nothing is ambiguous. White paper, near-black ink, 7:1 text, heavy rings. */
const contrast: Theme = {
  name: 'contrast',
  label: 'High contrast',
  colorScheme: 'light',
  colors: {
    surface: stark.white,
    surfaceRaised: stark.white,
    surfaceSunken: stark.sunken,
    surfaceHover: stark.hover,
    border: stark.rule,
    borderStrong: stark.strong,
    text: stark.ink,
    textMuted: stark.muted,
    danger: light.red[0],
    dangerText: light.red[2],
    success: light.green[0],
    successText: light.green[2],
    warning: light.amber[0],
    warningText: light.amber[2],
    scrim: scrim.stark,
  },
  accents: accents(light),
  defaultAccent: 'blue',
  radius: { sm: '3px', md: '6px', lg: '8px', pill: '999px' },
  font: { sans: systemSans, display: systemSans, mono: systemMono },
  icon: { stroke: '2.25', size: '1.25rem' },
  shape: {
    badgeRadius: 'var(--cc-radius-sm)',
    badgeCase: 'uppercase',
    badgeTracking: '0.06em',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '3px',
    focusOffset: '2px',
    rowMarker: '4px',
  },
  minText: 7,
};

export const themes: Record<ThemeName, Theme> = {
  neutral,
  uteke,
  corin,
  'neutral-dark': neutralDark,
  'uteke-dark': utekeDark,
  sepia,
  contrast,
};
