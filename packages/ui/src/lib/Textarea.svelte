<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { cn } from './cn.js';

  interface Props extends HTMLTextareaAttributes {
    value?: string | null;
    invalid?: boolean;
  }

  let { value = $bindable(), invalid = false, class: className, ...rest }: Props = $props();
</script>

<textarea
  rows="4"
  {...rest}
  bind:value
  aria-invalid={invalid || undefined}
  data-slot="textarea"
  class={cn(
    'border-input bg-card px-control-x font-inherit text-foreground min-h-[calc(var(--spacing-control)*2)] w-full resize-y rounded-md border py-2 leading-normal',
    'duration-fast ease-enter transition-[border-color,box-shadow] motion-reduce:transition-none',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-1',
    'disabled:bg-muted disabled:cursor-not-allowed',
    'aria-invalid:border-destructive aria-invalid:inset-ring-destructive aria-invalid:inset-ring',
    className,
  )}></textarea>
