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
  },
  classGroups: {
    duration: [{ duration: ['instant', 'fast', 'normal', 'slow'] }],
    z: [{ z: ['sticky', 'overlay', 'modal', 'popover', 'tooltip', 'toast', 'skip'] }],
  },
};

const twMerge = extendTailwindMerge({ extend: twMergeExtension });

/**
 * Joins class values and resolves Tailwind conflicts, last one wins:
 * `cn('px-4', condition && 'px-2', props.class)`. Components merge the
 * caller's `class` prop last, so it overrides their own utilities.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
