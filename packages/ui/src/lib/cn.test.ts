import { describe, expect, it } from 'vitest';
import { cn } from './cn.js';

describe('cn', () => {
  it('joins strings, arrays, objects and skips falsy values', () => {
    const off = false as boolean;
    expect(cn('a', ['b', off && 'c'], { d: true, e: false }, undefined, null)).toBe('a b d');
  });

  it('lets a later utility override an earlier one of the same group', () => {
    expect(cn('rounded-md px-4 py-2', 'rounded-full px-2')).toBe('py-2 rounded-full px-2');
  });

  it('keeps variants apart from the base utility', () => {
    expect(cn('bg-primary hover:bg-primary-hover', 'bg-destructive')).toBe(
      'hover:bg-primary-hover bg-destructive',
    );
  });

  it('keeps classes that are not Tailwind utilities', () => {
    expect(cn('cc-button', 'cc-button-primary', 'px-2')).toBe('cc-button cc-button-primary px-2');
  });
});
