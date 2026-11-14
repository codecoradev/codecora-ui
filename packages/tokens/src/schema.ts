// Names and shapes shared by the theme data, the CSS generator and the
// contrast check.

export const themeNames = [
  'neutral',
  'uteke',
  'corin',
  'corin-light',
  'neutral-dark',
  'uteke-dark',
  'sepia',
  'contrast',
  'dimmed',
  'slab',
  'soft',
  'neutral-cvd',
  'gaira',
  'tagfold',
] as const;
export type ThemeName = (typeof themeNames)[number];

/** Values of `data-accent`. Every theme defines every accent. */
export const accentNames = ['blue', 'green', 'teal', 'violet', 'orange', 'indigo', 'cyan'] as const;
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

/** Shadows for layers that float above the page; resting surfaces use tone, not shadow. */
export interface ThemeShadow {
  popover: string;
  modal: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colorScheme: 'light' | 'dark';
  colors: ThemeColors;
  accents: Record<AccentName, AccentColors>;
  defaultAccent: AccentName;
  /** `--radius-sm|md|lg`; `rounded-full` is the pill in every theme. */
  radius: { sm: string; md: string; lg: string };
  font: { sans: string; display: string; mono: string };
  icon: { stroke: string; size: string };
  shape: ThemeShape;
  /** Floating-layer shadows; omitted, they are soft drops tinted by the scrim. */
  shadow?: ThemeShadow;
  /** The same brand in the other colour scheme, so an app can follow `prefers-color-scheme`. */
  twin?: ThemeName;
  /** Minimum ratio for body and muted text; 7 for the high-contrast theme, 4.5 otherwise. */
  minText?: number;
}

/** Status hues that get a `-soft` tint derived from the surface. */
export const statusNames = ['danger', 'success', 'warning'] as const;

/** The shadcn variable each theme colour is declared as (D13). */
export const colorVariables: Readonly<Record<keyof ThemeColors, string>> = {
  surface: 'background',
  surfaceRaised: 'card',
  surfaceSunken: 'muted',
  surfaceHover: 'accent',
  border: 'border',
  borderStrong: 'input',
  text: 'foreground',
  textMuted: 'muted-foreground',
  danger: 'destructive',
  dangerText: 'destructive-foreground',
  success: 'success',
  successText: 'success-foreground',
  warning: 'warning',
  warningText: 'warning-foreground',
  scrim: 'overlay',
};

/** The variable each accent colour is declared as; `data-accent` switches all four. */
export const accentVariables: Readonly<Record<keyof AccentColors, string>> = {
  accent: 'primary',
  accentHover: 'primary-hover',
  accentText: 'primary-foreground',
  focus: 'ring',
};

/**
 * shadcn variables that repeat another one, so shadcn components and blocks
 * find every name they read. Those that follow the accent are re-declared
 * wherever `data-accent` can change it.
 */
export const aliasVariables: Readonly<Record<string, string>> = {
  'card-foreground': 'foreground',
  popover: 'card',
  'popover-foreground': 'foreground',
  secondary: 'muted',
  'secondary-foreground': 'foreground',
  'accent-foreground': 'foreground',
  'chart-1': 'primary',
  'chart-2': 'success',
  'chart-3': 'warning',
  'chart-4': 'destructive',
  'chart-5': 'muted-foreground',
  sidebar: 'muted',
  'sidebar-foreground': 'foreground',
  'sidebar-primary': 'primary',
  'sidebar-primary-foreground': 'primary-foreground',
  'sidebar-accent': 'accent',
  'sidebar-accent-foreground': 'foreground',
  'sidebar-border': 'border',
  'sidebar-ring': 'ring',
};

/** Tints mixed from a colour and `--background`: `--primary-soft`, `--destructive-soft`, ... */
export const softVariables = ['primary', 'destructive', 'success', 'warning'] as const;

/**
 * Every colour variable `theme.css` declares (without `--`), each with a
 * Tailwind colour: `bg-background`, `text-muted-foreground`, `bg-primary-soft`.
 */
export const colorTokens = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'primary-hover',
  'primary-soft',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'destructive-soft',
  'success',
  'success-foreground',
  'success-soft',
  'warning',
  'warning-foreground',
  'warning-soft',
  'overlay',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const;
export type ColorToken = (typeof colorTokens)[number];

/**
 * Every custom property the themes declare, without `--`: the colours, the
 * Tailwind theme keys and the CodeCora-only tokens that keep the `cc-` prefix
 * (they have no Tailwind namespace).
 */
export const semanticTokens = [
  ...colorTokens,
  'radius',
  'radius-sm',
  'radius-md',
  'radius-lg',
  'font-sans',
  'font-display',
  'font-mono',
  'shadow-popover',
  'shadow-modal',
  'spacing-control',
  'spacing-control-x',
  'spacing-control-y',
  'spacing-stack',
  'spacing-cell-x',
  'spacing-cell-y',
  'ease-enter',
  'ease-exit',
  'ease-move',
  'ease-spring',
  'cc-icon-stroke',
  'cc-icon-size',
  'cc-badge-radius',
  'cc-badge-case',
  'cc-badge-tracking',
  'cc-badge-font',
  'cc-focus-width',
  'cc-focus-offset',
  'cc-row-marker',
  'cc-press-scale',
  'cc-duration-instant',
  'cc-duration-fast',
  'cc-duration-normal',
  'cc-duration-slow',
  'cc-layer-sticky',
  'cc-layer-overlay',
  'cc-layer-modal',
  'cc-layer-popover',
  'cc-layer-tooltip',
  'cc-layer-toast',
  'cc-layer-skip',
] as const;
export type SemanticToken = (typeof semanticTokens)[number];

/** `cssVar('background')` → `'var(--background)'`. */
export const cssVar = (token: SemanticToken): string => `var(--${token})`;

/** `surfaceRaised` → `surface-raised`. */
export const kebab = (name: string): string => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
