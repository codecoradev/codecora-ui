// Tier 1, non-colour primitives. Theme-independent; emitted once on :root.
import type { Density } from './schema.js';

export const space = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.375rem',
  '2xl': '1.75rem',
  '3xl': '2.25rem',
} as const;

export const leading = { tight: '1.2', normal: '1.5' } as const;

/** Durations drop to 0ms under `prefers-reduced-motion: reduce`. */
export const duration = { fast: '140ms', normal: '240ms' } as const;
/** Stacking order, lowest first; components read these instead of numbers. */
export const layer = {
  sticky: '40',
  overlay: '50',
  modal: '51',
  popover: '60',
  tooltip: '70',
  toast: '80',
  skip: '90',
} as const;

export const ease = { out: 'cubic-bezier(0.22, 1, 0.36, 1)' } as const;

/**
 * Sizes that `data-density` switches. Comfortable keeps the 44 px touch
 * target; compact is for pointer-dense tools and stays above the 24 px
 * minimum of WCAG 2.5.8.
 */
export const density: Record<
  Density,
  { controlH: string; controlPx: string; gap: string; cellPy: string; cellPx: string }
> = {
  comfortable: {
    controlH: '2.75rem',
    controlPx: '0.875rem',
    gap: '0.75rem',
    cellPy: '0.625rem',
    cellPx: '0.75rem',
  },
  compact: {
    controlH: '2rem',
    controlPx: '0.625rem',
    gap: '0.5rem',
    cellPy: '0.375rem',
    cellPx: '0.5rem',
  },
};
