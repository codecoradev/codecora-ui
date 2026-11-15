<!-- Single-value select (bits-ui): type-ahead, arrow keys, Escape. Give it a `label` or put it in a Field. -->
<script lang="ts">
  import { Select } from 'bits-ui';
  import Glyph from './internal/Glyph.svelte';
  import { cn } from './cn.js';

  interface Item {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    items: Item[];
    value?: string;
    placeholder?: string;
    /** Accessible name when there is no Field label. */
    label?: string;
    id?: string;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    'aria-describedby'?: string;
  }

  let {
    items,
    value = $bindable(''),
    placeholder = 'Select…',
    label,
    id,
    invalid = false,
    required = false,
    disabled = false,
    'aria-describedby': describedby,
  }: Props = $props();

  const selected = $derived(items.find((item) => item.value === value));
</script>

<Select.Root type="single" bind:value {items} {disabled}>
  <Select.Trigger
    {id}
    aria-label={label}
    aria-describedby={describedby}
    aria-invalid={invalid || undefined}
    aria-required={required || undefined}
    class={cn(
      'cc-select-trigger min-h-control border-input bg-card px-control-x font-inherit text-foreground flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border text-left',
      'aria-invalid:border-destructive aria-invalid:inset-ring-destructive aria-invalid:inset-ring',
      'focus-visible:outline-ring focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-1',
      'data-disabled:bg-muted data-disabled:cursor-not-allowed',
    )}
  >
    <span class={selected ? undefined : 'text-muted-foreground'}
      >{selected?.label ?? placeholder}</span
    >
    <Glyph name="chevron-down" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content
      class={cn(
        'cc-select-content z-popover border-border bg-popover text-foreground shadow-popover max-h-[min(20rem,var(--bits-select-content-available-height))] min-w-[var(--bits-select-anchor-width)] origin-[var(--bits-select-content-transform-origin)] overflow-y-auto rounded-md border p-1 font-sans',
        // bits-ui keeps the list mounted until the exit animation finishes.
        'animate-listbox-in data-[state=closed]:animate-listbox-out motion-reduce:data-[state]:animate-none',
      )}
      sideOffset={4}
    >
      <Select.Viewport class="cc-select-viewport">
        {#each items as item (item.value)}
          <Select.Item
            value={item.value}
            label={item.label}
            disabled={item.disabled}
            class="cc-select-item min-h-control px-control-x data-highlighted:bg-accent flex cursor-pointer items-center justify-between gap-3 rounded-sm data-disabled:cursor-not-allowed data-disabled:opacity-55"
          >
            {#snippet children({ selected })}
              <span>{item.label}</span>
              {#if selected}<Glyph name="check" />{/if}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
