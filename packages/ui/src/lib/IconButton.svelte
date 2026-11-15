<!-- A button with an icon and no visible text; `label` is its accessible name and tooltip-free title. -->
<script module lang="ts">
  import { tv } from './internal/variants.js';

  const iconButton = tv({
    base: [
      'size-control inline-flex cursor-pointer items-center justify-center rounded-md border p-0',
      // The background eases; a press shrinks to --cc-press-scale (1 under reduced motion).
      'duration-fast ease-enter transition-[background-color,scale] [transition-duration:var(--cc-duration-fast),var(--cc-duration-instant)]',
      'not-disabled:hover:bg-accent not-disabled:active:scale-press',
      'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-solid',
      'disabled:cursor-not-allowed disabled:opacity-55',
    ],
    variants: {
      variant: {
        ghost: 'text-foreground border-transparent bg-transparent',
        secondary: 'border-input bg-card text-foreground',
        danger: 'text-destructive border-transparent bg-transparent',
      },
    },
  });
</script>

<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from './cn.js';
  import Icon from './internal/Icon.svelte';
  import type { IconComponent } from './types.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    icon: IconComponent;
    /** Required accessible name, for example "Close". */
    label: string;
    variant?: 'secondary' | 'ghost' | 'danger';
  }

  let {
    icon,
    label,
    variant = 'ghost',
    type = 'button',
    class: className,
    ...rest
  }: Props = $props();
</script>

<button
  data-slot="icon-button"
  data-variant={variant}
  {...rest}
  {type}
  aria-label={label}
  class={cn(iconButton({ variant }), className)}
>
  <Icon {icon} />
</button>
