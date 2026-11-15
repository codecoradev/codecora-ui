import { describe, expect, it } from 'vitest';
import { tailwindKeys, tailwindUtilities } from '@codecora/tokens';
import { cn, twMergeExtension } from './cn.js';

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

describe('cn with the CodeCora theme names', () => {
  it('replaces density sizes, durations, easing, shadows and layers like Tailwind ones', () => {
    expect(cn('h-control px-control-x', 'h-8')).toBe('px-control-x h-8');
    expect(cn('duration-fast', 'duration-150')).toBe('duration-150');
    expect(cn('duration-150', 'duration-slow')).toBe('duration-slow');
    expect(cn('ease-enter', 'ease-spring')).toBe('ease-spring');
    expect(cn('shadow-popover', 'shadow-modal')).toBe('shadow-modal');
    expect(cn('z-popover', 'z-toast')).toBe('z-toast');
  });

  it('keeps font-inherit when a caller adds a font family', () => {
    expect(cn('font-inherit', 'font-mono')).toBe('font-inherit font-mono');
    expect(cn('font-inherit text-sm', 'font-sans')).toBe('font-inherit text-sm font-sans');
  });

  it('replaces a max width with the measure keys', () => {
    expect(cn('max-w-md', 'max-w-measure')).toBe('max-w-measure');
    expect(cn('max-w-description', 'max-w-prose')).toBe('max-w-prose');
  });

  it('keeps a line height beside a later font size, as Tailwind 4 renders it', () => {
    expect(cn('leading-heading text-lg')).toBe('leading-heading text-lg');
    expect(cn('font-display leading-heading m-0 text-lg font-bold')).toContain('leading-heading');
    expect(cn('text-sm leading-[inherit]', 'text-lg')).toBe('leading-[inherit] text-lg');
    expect(cn('leading-heading', 'text-lg/7')).toBe('text-lg/7');
    expect(cn('leading-heading', 'leading-normal')).toBe('leading-normal');
  });

  it('keeps colour and size utilities apart', () => {
    expect(cn('text-muted-foreground', 'text-sm')).toBe('text-muted-foreground text-sm');
    expect(cn('shadow-popover', 'shadow-primary')).toBe('shadow-popover shadow-primary');
  });

  it('knows every name the tokens package adds', () => {
    const spacing = Object.keys(tailwindKeys)
      .filter((k) => k.startsWith('spacing-'))
      .map((k) => k.slice('spacing-'.length));
    const shadow = Object.keys(tailwindKeys)
      .filter((k) => k.startsWith('shadow-'))
      .map((k) => k.slice('shadow-'.length));
    const ease = Object.keys(tailwindKeys)
      .filter((k) => k.startsWith('ease-'))
      .map((k) => k.slice('ease-'.length));
    const leading = Object.keys(tailwindKeys)
      .filter((k) => k.startsWith('leading-'))
      .map((k) => k.slice('leading-'.length));
    const utilities = Object.keys(tailwindUtilities);
    expect(twMergeExtension.theme.spacing).toEqual(spacing);
    expect(twMergeExtension.theme.shadow).toEqual(shadow);
    expect(twMergeExtension.theme.ease).toEqual(ease);
    expect(twMergeExtension.theme.leading).toEqual(leading);
    expect(twMergeExtension.classGroups.duration[0]!.duration.map((d) => `duration-${d}`)).toEqual(
      utilities.filter((u) => u.startsWith('duration-')),
    );
    expect(twMergeExtension.classGroups.z[0]!.z.map((z) => `z-${z}`)).toEqual(
      utilities.filter((u) => u.startsWith('z-')),
    );
    const named = (ns: string) =>
      Object.keys(tailwindKeys)
        .filter((k) => k.startsWith(`${ns}-`) && k.endsWith('-badge'))
        .map((k) => k.slice(ns.length + 1));
    expect(twMergeExtension.theme.radius).toEqual(named('radius'));
    expect(twMergeExtension.theme.font).toEqual(named('font'));
    expect(twMergeExtension.theme.tracking).toEqual(named('tracking'));
    for (const u of [
      'outline-focus',
      'outline-offset-focus',
      'stroke-icon',
      'scale-press',
      'case-badge',
    ])
      expect(utilities).toContain(u);
  });

  it('replaces the named token utilities like the Tailwind ones of their group', () => {
    expect(cn('outline-focus', 'outline-2')).toBe('outline-2');
    expect(cn('outline-2', 'outline-focus')).toBe('outline-focus');
    expect(cn('outline-offset-focus', 'outline-offset-4')).toBe('outline-offset-4');
    expect(cn('stroke-icon', 'stroke-1')).toBe('stroke-1');
    expect(cn('active:scale-press', 'active:scale-95')).toBe('active:scale-95');
    expect(cn('rounded-badge', 'rounded-full')).toBe('rounded-full');
    expect(cn('font-badge', 'font-mono')).toBe('font-mono');
    expect(cn('tracking-badge', 'tracking-wide')).toBe('tracking-wide');
    expect(cn('case-badge', 'uppercase')).toBe('uppercase');
  });

  it('keeps the named token utilities apart from colours and weights', () => {
    expect(cn('outline-focus outline-ring')).toBe('outline-focus outline-ring');
    expect(cn('stroke-icon stroke-primary')).toBe('stroke-icon stroke-primary');
    expect(cn('font-badge font-medium')).toBe('font-badge font-medium');
  });
});
