import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

/**
 * Joins class values and resolves Tailwind conflicts, last one wins:
 * `cn('px-4', condition && 'px-2', props.class)`. Components merge the
 * caller's `class` prop last, so it overrides their own utilities.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
