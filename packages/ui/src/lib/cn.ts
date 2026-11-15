import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

export type { ClassValue };

/**
 * tailwind-merge taught the names `@codecora/tokens/theme.css` adds, so
 * `h-control` and `h-8`, or `duration-fast` and `duration-150`, replace each
 * other. Kept in step with the tokens package by `cn.test.ts`.
 */
export const twMergeExtension = {
  theme: {
    spacing: ['control', 'control-x', 'control-y', 'stack', 'cell-x', 'cell-y', 'icon'],
    shadow: ['popover', 'modal'],
    ease: ['enter', 'exit', 'move', 'spring'],
    leading: ['heading'],
    container: ['description', 'measure'],
    radius: ['badge'],
    font: ['badge'],
    tracking: ['badge'],
  },
  classGroups: {
    duration: [{ duration: ['instant', 'fast', 'normal', 'slow'] }],
    z: [{ z: ['sticky', 'overlay', 'modal', 'popover', 'tooltip', 'toast', 'skip'] }],
    // font: inherit, not a font family: `font-mono` after it must not remove it.
    'font-inherit': ['font-inherit'],
    'outline-w': [{ outline: ['focus'] }],
    'outline-offset': [{ 'outline-offset': ['focus'] }],
    'stroke-w': [{ stroke: ['icon'] }],
    scale: [{ scale: ['press'] }],
    'text-transform': ['case-badge'],
  },
};

/**
 * In Tailwind 4 `leading-*` sets `--tw-leading`, which every `text-*` size
 * reads first, so a line height wins over a later font size whatever their
 * order. tailwind-merge's default drops the earlier `leading-*`; this keeps it.
 * A size with its own line height (`text-lg/7`) still replaces it.
 */
export const twMergeOverride = {
  conflictingClassGroups: { 'font-size': [] as const },
};

const twMerge = extendTailwindMerge({ extend: twMergeExtension, override: twMergeOverride });

/**
 * Joins class values and resolves Tailwind conflicts, last one wins:
 * `cn('px-4', condition && 'px-2', props.class)`. Components merge the
 * caller's `class` prop last, so it overrides their own utilities.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
