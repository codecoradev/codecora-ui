<!-- Checkbox (bits-ui) with its label and optional description; supports a mixed state. -->
<script lang="ts">
  import { Checkbox } from 'bits-ui';
  import Glyph from './internal/Glyph.svelte';
  import { cn } from './cn.js';

  interface Props {
    label: string;
    /** Keep the label for assistive tech only, for a checkbox in a table row. */
    labelHidden?: boolean;
    description?: string;
    checked?: boolean;
    /** Mixed state, for a parent whose children are partly selected. */
    indeterminate?: boolean;
    name?: string;
    value?: string;
    id?: string;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    /** Called with the new state when the user toggles it. */
    onchange?: (checked: boolean) => void;
    'aria-describedby'?: string;
  }

  let {
    label,
    labelHidden = false,
    description,
    checked = $bindable(false),
    indeterminate = $bindable(false),
    name,
    value,
    id,
    invalid = false,
    required = false,
    disabled = false,
    onchange,
    'aria-describedby': describedby,
  }: Props = $props();

  const uid = $props.id();
  const controlId = $derived(id ?? `${uid}-box`);
  const hintId = $derived(`${uid}-hint`);
  const described = $derived(
    [description ? hintId : '', describedby].filter(Boolean).join(' ') || undefined,
  );
</script>

<div
  class="cc-choice group/choice min-h-control py-control-y flex items-start gap-3"
  data-disabled={disabled || undefined}
>
  <Checkbox.Root
    id={controlId}
    bind:checked
    bind:indeterminate
    {name}
    {value}
    {required}
    {disabled}
    onCheckedChange={onchange}
    aria-describedby={described}
    aria-invalid={invalid || undefined}
    class={cn(
      'cc-box border-input bg-card text-primary-foreground inline-grid size-5 flex-none cursor-pointer place-items-center rounded-sm border p-0',
      'duration-fast ease-enter transition-[background-color,border-color] motion-reduce:transition-none',
      // An invalid box keeps its danger border when checked.
      'data-[state=checked]:bg-primary not-aria-invalid:data-[state=checked]:border-primary',
      'data-[state=indeterminate]:bg-primary not-aria-invalid:data-[state=indeterminate]:border-primary',
      'aria-invalid:border-destructive aria-invalid:inset-ring-destructive aria-invalid:inset-ring',
      'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus',
      'data-disabled:cursor-not-allowed data-disabled:opacity-55',
      // The mark: opacity eases, only the scale springs. Unchecking takes the shorter exit.
      '[&_svg]:[transition:opacity_var(--cc-duration-fast)_var(--ease-enter),scale_var(--cc-duration-slow)_var(--ease-spring)]',
      'data-[state=unchecked]:[&_svg]:scale-50 data-[state=unchecked]:[&_svg]:opacity-0',
      'data-[state=unchecked]:[&_svg]:duration-instant data-[state=unchecked]:[&_svg]:ease-exit',
      'motion-reduce:data-[state]:[&_svg]:transition-none',
    )}
  >
    {#snippet children({ indeterminate })}
      <!-- The check stays in the DOM while unchecked, hidden, so checking it can animate. -->
      {#if indeterminate}<Glyph name="minus" />{:else}<Glyph name="check" />{/if}
    {/snippet}
  </Checkbox.Root>
  <div class={cn('grid gap-1', labelHidden && 'sr-only')}>
    <label
      for={controlId}
      class="group-data-disabled/choice:text-muted-foreground cursor-pointer group-data-disabled/choice:cursor-not-allowed"
      >{label}</label
    >
    {#if description}<p id={hintId} class="text-muted-foreground m-0 text-sm leading-[inherit]">
        {description}
      </p>{/if}
  </div>
</div>
