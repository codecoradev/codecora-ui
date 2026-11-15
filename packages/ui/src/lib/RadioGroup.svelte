<!-- Single choice from a short list (bits-ui): arrow keys move and select. Give it a `label`. -->
<script lang="ts">
  import { RadioGroup } from 'bits-ui';
  import { cn } from './cn.js';

  interface Item {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }

  interface Props {
    items: Item[];
    /** Names the group for assistive tech; shown by the Field legend when used in one. */
    label: string;
    value?: string;
    name?: string;
    orientation?: 'vertical' | 'horizontal';
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    'aria-describedby'?: string;
  }

  let {
    items,
    label,
    value = $bindable(''),
    name,
    orientation = 'vertical',
    invalid = false,
    required = false,
    disabled = false,
    'aria-describedby': describedby,
  }: Props = $props();

  const uid = $props.id();
</script>

<RadioGroup.Root
  bind:value
  {name}
  {orientation}
  {required}
  {disabled}
  aria-label={label}
  aria-describedby={describedby}
  aria-invalid={invalid || undefined}
  class={cn(
    'cc-radios group/radios flex gap-x-6 gap-y-1',
    `cc-radios-${orientation}`,
    orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
  )}
>
  {#each items as item (item.value)}
    <div
      class="cc-choice group/choice min-h-control py-control-y flex items-start gap-3"
      data-disabled={disabled || item.disabled || undefined}
    >
      <RadioGroup.Item
        id="{uid}-{item.value}"
        value={item.value}
        disabled={item.disabled}
        aria-describedby={item.description ? `${uid}-${item.value}-hint` : undefined}
        class={cn(
          'cc-radio border-input bg-card inline-grid size-5 flex-none cursor-pointer place-items-center rounded-full border p-0',
          'duration-fast ease-enter transition-[border-color] motion-reduce:transition-none',
          // In an invalid group the danger border stays on the checked radio too.
          'not-group-aria-invalid/radios:data-[state=checked]:border-primary',
          'group-aria-invalid/radios:border-destructive group-aria-invalid/radios:inset-ring-destructive group-aria-invalid/radios:inset-ring',
          'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus',
          'data-disabled:cursor-not-allowed data-disabled:opacity-55',
        )}
      >
        {#snippet children({ checked })}
          {#if checked}<!-- Opacity eases; only the scale springs. The dot is gone the moment it is unchecked. -->
            <span
              class="dot animate-dot-in bg-primary size-2.5 rounded-full motion-reduce:animate-none"
            ></span>{/if}
        {/snippet}
      </RadioGroup.Item>
      <div class="grid gap-1">
        <label
          for="{uid}-{item.value}"
          class="group-data-disabled/choice:text-muted-foreground cursor-pointer group-data-disabled/choice:cursor-not-allowed"
          >{item.label}</label
        >
        {#if item.description}<p
            id="{uid}-{item.value}-hint"
            class="text-muted-foreground m-0 text-sm leading-[inherit]"
          >
            {item.description}
          </p>{/if}
      </div>
    </div>
  {/each}
</RadioGroup.Root>
