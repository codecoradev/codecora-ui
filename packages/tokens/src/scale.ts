// Tier 1, non-colour primitives. Theme-independent; emitted once on :root
// where Tailwind has no value of its own.
import type { Density } from './schema.js';

/** Tailwind's spacing scale (`--spacing: 0.25rem`), steps the components use. */
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

/**
 * Tailwind's default type scale (`text-xs` ... `text-3xl`), which the
 * components use since D13. Not emitted: Tailwind declares it.
 */
export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
} as const;

/**
 * Line heights Tailwind has no step for: `leading-heading` (1.2) for
 * headings and other tight text. Tailwind's own `leading-tight` (1.25) and
 * `leading-normal` (1.5) are unchanged.
 */
export const leading = { heading: '1.2' } as const;

/**
 * Durations drop to 0ms under `prefers-reduced-motion: reduce`. Entries take
 * `normal` (`slow` for a spring), exits one step shorter, hovers `fast` or
 * `instant`.
 */
export const duration = { instant: '70ms', fast: '140ms', normal: '240ms', slow: '400ms' } as const;
/**
 * Press feedback: a pressed button scales to this. Reduced motion sets it to 1,
 * so the press changes nothing there.
 */
export const press = { scale: '0.98' } as const;

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

/**
 * Step response of a damped spring (damping ratio `zeta`, natural frequency
 * `omega` per animation length), sampled into a CSS `linear()` curve. The
 * last point is pinned to 1 so the animation ends at rest.
 */
export function spring(zeta: number, omega: number, segments = 20): string {
  const damped = omega * Math.sqrt(1 - zeta * zeta);
  const at = (t: number) =>
    1 -
    Math.exp(-zeta * omega * t) *
      (Math.cos(damped * t) + ((zeta * omega) / damped) * Math.sin(damped * t));
  const points = Array.from({ length: segments + 1 }, (_, i) =>
    i === segments ? 1 : Number(at(i / segments).toFixed(3)),
  );
  return `linear(${points.join(', ')})`;
}

/**
 * `--ease-<name>`: `enter` for entries, `exit` for leaving, `move` for
 * movement between two resting places. `spring` overshoots by about 5% and is
 * for movement and scale only, never opacity or colour; reduced motion swaps
 * it for `enter`. New names, so Tailwind's own `ease-out` and `ease-in-out`
 * keep their documented curves.
 */
export const ease = {
  enter: 'cubic-bezier(0.22, 1, 0.36, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  move: 'cubic-bezier(0.33, 0, 0.67, 1)',
  spring: spring(0.7, 10),
} as const;

/**
 * Sizes that `data-density` switches. Comfortable keeps the 44 px touch
 * target; compact is for pointer-dense tools and stays above the 24 px
 * minimum of WCAG 2.5.8. `controlPy` is the block padding of rows whose
 * label can wrap (choices, accordion triggers): one 24 px line lands on
 * `controlH` in both densities.
 */
export const density: Record<
  Density,
  {
    controlH: string;
    controlPx: string;
    controlPy: string;
    gap: string;
    cellPy: string;
    cellPx: string;
  }
> = {
  comfortable: {
    controlH: '2.75rem',
    controlPx: '0.875rem',
    controlPy: '0.5rem',
    gap: '0.75rem',
    cellPy: '0.625rem',
    cellPx: '0.75rem',
  },
  compact: {
    controlH: '2rem',
    controlPx: '0.625rem',
    controlPy: '0.25rem',
    gap: '0.5rem',
    cellPy: '0.375rem',
    cellPx: '0.5rem',
  },
};
