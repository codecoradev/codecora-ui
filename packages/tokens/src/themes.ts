// Tier 3, themes: each maps the semantic tokens onto palette entries.
import {
  blush,
  bone,
  cvd,
  dark,
  dusk,
  fog,
  graphite,
  ink,
  light,
  lowGlare,
  mint,
  night,
  paperHues,
  paper,
  scrim,
  sepia as sepiaPaper,
  slate,
  slateDark,
  stark,
  volt,
  warmPaper,
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
const roundedSans = `ui-rounded, 'Nunito', 'SF Pro Rounded', ${systemSans}`;

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
  twin: 'corin-light',
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

/**
 * Corin by day: warm paper surfaces and the same teal, shape and fonts as `corin`.
 * Status hues are Corin's hue angles at AA lightness (see `paperHues`).
 */
const corinLight: Theme = {
  ...corin,
  name: 'corin-light',
  label: 'Corin light',
  colorScheme: 'light',
  colors: {
    surface: warmPaper.base,
    surfaceRaised: warmPaper.mantle,
    surfaceSunken: warmPaper.crust,
    surfaceHover: warmPaper.surface0,
    border: warmPaper.surface0,
    borderStrong: warmPaper.overlay,
    text: warmPaper.text,
    textMuted: warmPaper.subtext,
    danger: paperHues.red[0],
    dangerText: paperHues.red[2],
    success: paperHues.green[0],
    successText: paperHues.green[2],
    warning: paperHues.amber[0],
    warningText: paperHues.amber[2],
    scrim: scrim.warm,
  },
  accents: accents({ ...light, teal: paperHues.teal }),
  twin: 'corin',
};

/**
 * gaira's console: ink surfaces, the volt accent on actions and focus, Inter
 * and JetBrains Mono. Volt rides the `green` accent slot so `data-accent`
 * keeps working; ink is the text on every fill.
 */
const gaira: Theme = {
  name: 'gaira',
  label: 'Gaira',
  colorScheme: 'dark',
  colors: {
    surface: ink.base,
    surfaceRaised: ink.mantle,
    surfaceSunken: ink.crust,
    surfaceHover: ink.hover,
    border: ink.rule,
    borderStrong: ink.strong,
    text: ink.text,
    textMuted: ink.muted,
    danger: dark.red[0],
    dangerText: ink.base,
    success: dark.teal[0],
    successText: ink.base,
    warning: dark.amber[0],
    warningText: ink.base,
    scrim: scrim.ink,
  },
  accents: accents({ ...dark, green: volt }),
  defaultAccent: 'green',
  radius: { sm: '4px', md: '8px', lg: '12px', pill: '999px' },
  font: {
    sans: `'Inter Variable', 'Inter', ${systemSans}`,
    display: `'Inter Variable', 'Inter', ${systemSans}`,
    mono: `'JetBrains Mono Variable', ${jetbrainsMono}`,
  },
  icon: { stroke: '1.75', size: '1.25rem' },
  shape: {
    badgeRadius: 'var(--cc-radius-sm)',
    badgeCase: 'none',
    badgeTracking: '0',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '2px',
    focusOffset: '2px',
    rowMarker: '2px',
  },
};

/**
 * tagfold's darkroom tool: slate surfaces, one mint accent on action and
 * focus, system fonts, flat. Mint rides the `green` accent slot so
 * `data-accent` keeps working.
 */
const tagfold: Theme = {
  name: 'tagfold',
  label: 'Tagfold',
  colorScheme: 'dark',
  colors: {
    surface: slateDark.base,
    surfaceRaised: slateDark.mantle,
    surfaceSunken: slateDark.crust,
    surfaceHover: slateDark.hover,
    border: slateDark.rule,
    borderStrong: slateDark.strong,
    text: slateDark.text,
    textMuted: slateDark.muted,
    danger: '#EF7B7B',
    dangerText: '#2A0D0D',
    success: mint[0],
    successText: '#0C1510',
    warning: '#F0B45C',
    warningText: '#241A08',
    scrim: 'rgb(8 8 12 / 0.66)',
  },
  accents: accents({ ...dark, green: mint }),
  defaultAccent: 'green',
  radius: { sm: '9px', md: '9px', lg: '12px', pill: '999px' },
  font: { sans: systemSans, display: systemSans, mono: systemMono },
  icon: { stroke: '2', size: '1.25rem' },
  shape: {
    badgeRadius: 'var(--cc-radius-pill)',
    badgeCase: 'none',
    badgeTracking: '0.01em',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '2px',
    focusOffset: '2px',
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
  // Square corners read as edges: nothing about a control's outline is soft.
  radius: { sm: '2px', md: '4px', lg: '6px', pill: '999px' },
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

/** Low Light: a mid-grey dark for long sessions, softer text and quieter accents. */
const dimmed: Theme = {
  name: 'dimmed',
  label: 'Dimmed',
  colorScheme: 'dark',
  colors: {
    surface: fog.base,
    surfaceRaised: fog.mantle,
    surfaceSunken: fog.crust,
    surfaceHover: fog.hover,
    border: fog.rule,
    borderStrong: fog.strong,
    text: fog.text,
    textMuted: fog.muted,
    danger: lowGlare.red[0],
    dangerText: lowGlare.red[2],
    success: lowGlare.green[0],
    successText: lowGlare.green[2],
    warning: lowGlare.amber[0],
    warningText: lowGlare.amber[2],
    scrim: scrim.fog,
  },
  accents: accents(lowGlare),
  defaultAccent: 'blue',
  radius: { sm: '4px', md: '8px', lg: '12px', pill: '999px' },
  font: { sans: systemSans, display: systemSans, mono: systemMono },
  icon: { stroke: '1.75', size: '1.25rem' },
  // Lower contrast surfaces, so the ring is thicker to stay easy to find.
  shape: {
    badgeRadius: 'var(--cc-radius-pill)',
    badgeCase: 'none',
    badgeTracking: '0',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '3px',
    focusOffset: '2px',
    rowMarker: '2px',
  },
};

/** The Proof Sheet: bone paper, ink rules, square corners, mono headings, hard shadows. */
const slab: Theme = {
  name: 'slab',
  label: 'Slab',
  colorScheme: 'light',
  colors: {
    surface: bone.base,
    surfaceRaised: bone.white,
    surfaceSunken: bone.sunken,
    surfaceHover: bone.hover,
    border: bone.rule,
    borderStrong: bone.strong,
    text: bone.ink,
    textMuted: bone.muted,
    danger: light.red[0],
    dangerText: light.red[2],
    success: light.green[0],
    successText: light.green[2],
    warning: light.amber[0],
    warningText: light.amber[2],
    scrim: scrim.bone,
  },
  accents: accents(light),
  defaultAccent: 'indigo',
  // Pill stays round so radios, switches and avatars keep their shape.
  radius: { sm: '0', md: '0', lg: '0', pill: '999px' },
  font: { sans: systemSans, display: jetbrainsMono, mono: jetbrainsMono },
  icon: { stroke: '2.25', size: '1.25rem' },
  shape: {
    badgeRadius: 'var(--cc-radius-sm)',
    badgeCase: 'uppercase',
    badgeTracking: '0.04em',
    badgeFont: 'var(--cc-font-mono)',
    focusWidth: '3px',
    focusOffset: '2px',
    rowMarker: '4px',
  },
  // Printed offsets in ink: no blur, so a floating layer reads as a block laid on top.
  shadow: {
    popover: 'var(--cc-space-1) var(--cc-space-1) 0 var(--cc-text)',
    modal: 'var(--cc-space-2) var(--cc-space-2) 0 var(--cc-text)',
  },
};

/** The Pebble: blush paper, round corners and a rounded sans for consumer apps. */
const soft: Theme = {
  name: 'soft',
  label: 'Soft',
  colorScheme: 'light',
  colors: {
    surface: blush.base,
    surfaceRaised: blush.raised,
    surfaceSunken: blush.sunken,
    surfaceHover: blush.hover,
    border: blush.rule,
    borderStrong: blush.strong,
    text: blush.ink,
    textMuted: blush.muted,
    danger: light.red[0],
    dangerText: light.red[2],
    success: light.green[0],
    successText: light.green[2],
    warning: light.amber[0],
    warningText: light.amber[2],
    scrim: scrim.blush,
  },
  accents: accents(light),
  defaultAccent: 'violet',
  radius: { sm: '8px', md: '14px', lg: '22px', pill: '999px' },
  font: { sans: roundedSans, display: roundedSans, mono: systemMono },
  icon: { stroke: '1.5', size: '1.25rem' },
  shape: {
    badgeRadius: 'var(--cc-radius-pill)',
    badgeCase: 'none',
    badgeTracking: '0',
    badgeFont: 'var(--cc-font-sans)',
    focusWidth: '2px',
    focusOffset: '3px',
    rowMarker: '3px',
  },
  // Wide, faint drops: floating layers lift rather than cast.
  shadow: {
    popover:
      '0 var(--cc-space-3) var(--cc-space-8) color-mix(in srgb, var(--cc-scrim) 35%, transparent)',
    modal:
      '0 var(--cc-space-6) var(--cc-space-16) color-mix(in srgb, var(--cc-scrim) 45%, transparent)',
  },
};

/**
 * Neutral for red/green colour vision deficiency: success is blue, danger is
 * vermillion, and the default accent is violet so it never reads as success.
 */
const neutralCvd: Theme = {
  ...neutral,
  name: 'neutral-cvd',
  label: 'Neutral (colour-blind safe)',
  colors: {
    ...neutral.colors,
    danger: cvd.danger[0],
    dangerText: cvd.danger[2],
    success: cvd.success[0],
    successText: cvd.success[2],
  },
  defaultAccent: 'violet',
  // A heavier selection rule, so state leans less on hue.
  shape: { ...neutral.shape, rowMarker: '3px' },
  twin: undefined,
};

export const themes: Record<ThemeName, Theme> = {
  neutral,
  uteke,
  corin,
  'corin-light': corinLight,
  'neutral-dark': neutralDark,
  'uteke-dark': utekeDark,
  sepia,
  contrast,
  dimmed,
  slab,
  soft,
  'neutral-cvd': neutralCvd,
  gaira,
  tagfold,
};
