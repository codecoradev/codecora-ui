<script module lang="ts">
  import { tv } from './internal/variants.js';

  /** Enabled: neither :disabled nor aria-disabled (a disabled link). */
  const button = tv({
    base: [
      'min-h-control px-control-x font-inherit inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border leading-none font-medium whitespace-nowrap no-underline',
      // Colours ease, a press gives a little: it shrinks to --cc-press-scale (1 under reduced motion).
      'duration-fast ease-enter transition-[background-color,border-color,scale] [transition-duration:var(--cc-duration-fast),var(--cc-duration-fast),var(--cc-duration-instant)]',
      'not-disabled:not-aria-disabled:active:scale-press',
      'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-solid',
      'disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:cursor-not-allowed aria-disabled:opacity-55',
    ],
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground not-disabled:not-aria-disabled:hover:bg-primary-hover border-transparent',
        secondary:
          'border-input bg-card text-foreground not-disabled:not-aria-disabled:hover:bg-accent',
        ghost:
          'text-foreground not-disabled:not-aria-disabled:hover:bg-accent border-transparent bg-transparent',
        danger:
          'bg-destructive text-destructive-foreground border-transparent not-disabled:not-aria-disabled:hover:bg-[color-mix(in_srgb,var(--destructive)_88%,var(--foreground))]',
      },
    },
  });
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from './cn.js';
  import Icon from './internal/Icon.svelte';
  import Spinner from './Spinner.svelte';
  import type { IconComponent } from './types.js';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

  type Props = {
    variant?: Variant;
    /** Leading icon component. */
    icon?: IconComponent;
    /** Shows a spinner and blocks activation; the button keeps its width. */
    loading?: boolean;
    /** What a screen reader hears while loading, for example "Saving". */
    loadingLabel?: string;
    children: Snippet;
  } & Omit<HTMLButtonAttributes, 'children'> &
    Omit<HTMLAnchorAttributes, 'children' | 'type'>;

  let {
    variant = 'secondary',
    icon,
    loading = false,
    loadingLabel = 'Loading',
    href,
    type = 'button',
    disabled,
    onclick,
    class: className,
    children,
    ...rest
  }: Props = $props();

  const inactive = $derived(disabled || loading);
  const classes = $derived(cn(button({ variant }), className));
</script>

<!-- A link styled as a button when href is set; a disabled link drops its href. -->
{#if href !== undefined}
  <a
    data-slot="button"
    data-variant={variant}
    {...rest as HTMLAnchorAttributes}
    onclick={inactive ? undefined : (onclick as HTMLAnchorAttributes['onclick'])}
    href={inactive ? undefined : href}
    role={inactive ? 'link' : undefined}
    aria-disabled={inactive || undefined}
    class={classes}
  >
    {#if loading}<Spinner label={loadingLabel} />{:else if icon}<Icon {icon} />{/if}
    {@render children()}
  </a>
{:else}
  <button
    data-slot="button"
    data-variant={variant}
    {...rest as HTMLButtonAttributes}
    onclick={onclick as HTMLButtonAttributes['onclick']}
    {type}
    disabled={inactive}
    aria-busy={loading || undefined}
    class={classes}
  >
    {#if loading}<Spinner label={loadingLabel} />{:else if icon}<Icon {icon} />{/if}
    {@render children()}
  </button>
{/if}
