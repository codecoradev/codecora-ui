<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from './cn.js';

  interface Props extends Omit<HTMLInputAttributes, 'value'> {
    value?: string | number | null;
    invalid?: boolean;
  }

  let { value = $bindable(), invalid = false, class: className, ...rest }: Props = $props();
</script>

<input
  {...rest}
  bind:value
  aria-invalid={invalid || undefined}
  class={cn(
    'cc-input min-h-control border-input bg-card px-control-x font-inherit text-foreground w-full rounded-md border',
    'duration-fast ease-enter transition-[border-color,box-shadow] motion-reduce:transition-none',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-ring focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-1',
    'disabled:bg-muted disabled:cursor-not-allowed',
    'aria-invalid:border-destructive aria-invalid:inset-ring-destructive aria-invalid:inset-ring',
    className,
  )}
/>
