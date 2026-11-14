<script module lang="ts">
  import { tv } from './internal/variants.js';

  /** The shape (radius, font, case, tracking) comes from the theme's badge tokens. */
  const badge = tv({
    base: 'cc-badge inline-flex items-center rounded-[var(--cc-badge-radius)] px-2 py-0.5 font-[family-name:var(--cc-badge-font)] text-xs leading-[calc(var(--cc-font-size-xs)*1.4)] font-medium tracking-[var(--cc-badge-tracking)] whitespace-nowrap [text-transform:var(--cc-badge-case)]',
    variants: {
      tone: {
        neutral: 'bg-muted text-foreground inset-ring-border inset-ring',
        accent: 'bg-primary-soft text-primary',
        success: 'bg-success-soft text-success',
        warning: 'bg-warning-soft text-warning',
        danger: 'bg-destructive-soft text-destructive',
      },
    },
  });
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from './cn.js';
  import type { Tone } from './types.js';

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    tone?: Tone;
    children: Snippet;
  }

  let { tone = 'neutral', class: className, children, ...rest }: Props = $props();
</script>

<span {...rest} class={cn(badge({ tone }), `cc-badge-${tone}`, className)}
  >{@render children()}</span
>
