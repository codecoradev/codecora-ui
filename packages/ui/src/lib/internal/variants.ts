import { createTV } from 'tailwind-variants';

/**
 * `tv()` for the components. It only joins classes: merging (and the theme
 * names tailwind-merge has to know) happens once, in `cn()`, where the
 * caller's `class` prop is added last:
 *
 *   const button = tv({ base: '…', variants: { variant: { primary: '…' } } });
 *   <button class={cn(button({ variant }), className)}>
 */
export const tv = createTV({ twMerge: false });
export type { VariantProps } from 'tailwind-variants';
