// Names and shapes shared by the theme data, the CSS generator and the
// contrast check.

export const themeNames = ['neutral', 'uteke', 'corin'] as const;
export type ThemeName = (typeof themeNames)[number];

/** Values of `data-accent`. Every theme defines every accent. */
export const accentNames = ['blue', 'green', 'teal', 'violet'] as const;
export type AccentName = (typeof accentNames)[number];

/** Values of `data-density`; `comfortable` is the default. */
export const densities = ['comfortable', 'compact'] as const;
export type Density = (typeof densities)[number];

/** One accent: fill (also link and icon colour), hover fill, text on the fill, focus ring. */
export interface AccentColors {
  accent: string;
  accentHover: string;
  accentText: string;
  focus: string;
}

export interface ThemeColors {
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  surfaceHover: string;
  /** Decorative hairlines; not relied on to identify a control. */
  border: string;
  /** Control boundaries (inputs, checkboxes); at least 3:1 on the surfaces. */
  borderStrong: string;
  text: string;
  textMuted: string;
  danger: string;
  dangerText: string;
  success: string;
  successText: string;
  warning: string;
  warningText: string;
  scrim: string;
}

/**
 * Structural hooks: what a theme may change beyond colour, type and radius.
 * Values are CSS; `badgeFont` and `badgeRadius` may reference other tokens.
 */
export interface ThemeShape {
  badgeRadius: string;
  badgeCase: 'none' | 'uppercase';
  badgeTracking: string;
  badgeFont: string;
  /** Focus ring thickness; at least 2px so it stays visible (WCAG 2.4.13). */
  focusWidth: string;
  focusOffset: string;
  /** Width of the accent bar on a selected row; at least 2px so selection is not colour alone. */
  rowMarker: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colorScheme: 'light' | 'dark';
  colors: ThemeColors;
  accents: Record<AccentName, AccentColors>;
  defaultAccent: AccentName;
  radius: { sm: string; md: string; lg: string; pill: string };
  font: { sans: string; display: string; mono: string };
  icon: { stroke: string; size: string };
  shape: ThemeShape;
}

/** Status hues that get a `-soft` tint derived from the surface. */
export const statusNames = ['danger', 'success', 'warning'] as const;

/** Every semantic custom property, without the `--cc-` prefix. */
export const semanticTokens = [
  'surface',
  'surface-raised',
  'surface-sunken',
  'surface-hover',
  'border',
  'border-strong',
  'text',
  'text-muted',
  'accent',
  'accent-hover',
  'accent-text',
  'accent-soft',
  'focus',
  'danger',
  'danger-text',
  'danger-soft',
  'success',
  'success-text',
  'success-soft',
  'warning',
  'warning-text',
  'warning-soft',
  'scrim',
  'radius-sm',
  'radius-md',
  'radius-lg',
  'radius-pill',
  'font-sans',
  'font-display',
  'font-mono',
  'icon-stroke',
  'icon-size',
  'badge-radius',
  'badge-case',
  'badge-tracking',
  'badge-font',
  'focus-width',
  'focus-offset',
  'row-marker',
  'control-h',
  'control-px',
  'gap',
  'cell-py',
  'cell-px',
] as const;
export type SemanticToken = (typeof semanticTokens)[number];

/** `cssVar('surface')` → `'var(--cc-surface)'`. */
export const cssVar = (token: SemanticToken): string => `var(--cc-${token})`;

/** `surfaceRaised` → `surface-raised`. */
export const kebab = (name: string): string => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
