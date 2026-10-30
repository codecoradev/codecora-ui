// Tier 1, colour primitives. The only place raw colour literals live; themes
// map semantic tokens onto these entries. Components never read them.

/** Cool grey for the `neutral` theme (OKLCH, hue 260). */
export const slate = {
  25: 'oklch(99.6% 0.001 260)',
  50: 'oklch(98.5% 0.003 260)',
  100: 'oklch(96.2% 0.005 260)',
  150: 'oklch(93.6% 0.007 260)',
  200: 'oklch(90% 0.008 260)',
  500: 'oklch(55% 0.012 260)',
  600: 'oklch(45% 0.014 260)',
  900: 'oklch(22% 0.012 260)',
} as const;

/** Green-tinted paper and ink, from uteke-cloud `web/src/lib/styles/tokens.css`. */
export const paper = {
  raised: 'oklch(99% 0.004 150)',
  base: 'oklch(97.5% 0.008 150)',
  sunken: 'oklch(94.6% 0.01 150)',
  hover: 'oklch(92% 0.012 150)',
  rule: 'oklch(88% 0.011 150)',
  neutral: 'oklch(45% 0.013 152)',
  ink: 'oklch(21% 0.015 155)',
} as const;

/**
 * Editor-grade dark chrome, from Corin `DESIGN.md` (dark palette). Two
 * departures: `crust` is a new sunken step below `base`, and `overlay` is
 * lighter than Corin's #5A6478 so control borders reach 3:1.
 */
export const night = {
  crust: '#0A0C10',
  base: '#0E1015',
  mantle: '#12151D',
  surface0: '#222836',
  surface1: '#2A3242',
  overlay: '#6A7489',
  subtext: '#8B93A7',
  text: '#E6E9EF',
} as const;

/** Accent and status hues tuned for light surfaces: fill, hover fill, text on fill. */
export const light = {
  blue: ['oklch(50% 0.16 260)', 'oklch(44% 0.16 260)', 'oklch(99% 0.003 260)'],
  green: ['oklch(46% 0.15 150)', 'oklch(40% 0.14 150)', 'oklch(98% 0.006 150)'],
  teal: ['oklch(47% 0.09 190)', 'oklch(41% 0.085 190)', 'oklch(98.5% 0.005 190)'],
  violet: ['oklch(50% 0.17 295)', 'oklch(44% 0.17 295)', 'oklch(99% 0.004 295)'],
  orange: ['oklch(47% 0.15 50)', 'oklch(41% 0.14 50)', 'oklch(99% 0.004 50)'],
  indigo: ['oklch(47% 0.17 275)', 'oklch(41% 0.16 275)', 'oklch(99% 0.004 275)'],
  cyan: ['oklch(47% 0.1 215)', 'oklch(41% 0.095 215)', 'oklch(98.5% 0.005 215)'],
  red: ['oklch(47% 0.18 27)', 'oklch(41% 0.17 27)', 'oklch(99% 0.004 27)'],
  amber: ['oklch(47% 0.1 70)', 'oklch(41% 0.09 70)', 'oklch(99% 0.004 70)'],
} as const;

/** Accent and status hues tuned for dark surfaces (Corin): fill, hover fill, text on fill. */
export const dark = {
  blue: ['#7CB2FF', '#A3C8FF', '#0E1015'],
  green: ['#34D399', '#6EE7B7', '#0E1015'],
  teal: ['#4FD8D2', '#7EE3DE', '#0E1015'],
  violet: ['#C4A7FF', '#D6C2FF', '#0E1015'],
  orange: ['oklch(80% 0.14 50)', 'oklch(86% 0.11 50)', '#0E1015'],
  indigo: ['oklch(80% 0.12 275)', 'oklch(86% 0.09 275)', '#0E1015'],
  cyan: ['oklch(80% 0.095 215)', 'oklch(86% 0.08 215)', '#0E1015'],
  red: ['#F87171', '#FCA5A5', '#0E1015'],
  amber: ['#E89B3C', '#F0B76E', '#0E1015'],
} as const;

/** Modal scrims (translucent; not part of the contrast check). */
export const scrim = {
  slate: 'oklch(22% 0.012 260 / 0.45)',
  paper: 'oklch(21% 0.015 155 / 0.45)',
  night: 'rgb(10 12 16 / 0.6)',
} as const;
