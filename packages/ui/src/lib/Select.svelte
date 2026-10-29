<!-- Single-value select (bits-ui): type-ahead, arrow keys, Escape. Give it a `label` or put it in a Field. -->
<script lang="ts">
  import { Select } from 'bits-ui';
  import Glyph from './internal/Glyph.svelte';

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
    class="cc-select-trigger"
  >
    <span class:placeholder={!selected}>{selected?.label ?? placeholder}</span>
    <Glyph name="chevron-down" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content class="cc-select-content" sideOffset={4}>
      <Select.Viewport class="cc-select-viewport">
        {#each items as item (item.value)}
          <Select.Item
            value={item.value}
            label={item.label}
            disabled={item.disabled}
            class="cc-select-item"
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

<style>
  :global(.cc-select-trigger) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-2);
    width: 100%;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  :global(.cc-select-trigger[aria-invalid='true']) {
    border-color: var(--cc-danger);
  }
  :global(.cc-select-trigger:focus-visible) {
    outline: 2px solid var(--cc-focus);
    outline-offset: 1px;
  }
  :global(.cc-select-trigger[data-disabled]) {
    background: var(--cc-surface-sunken);
    cursor: not-allowed;
  }
  .placeholder {
    color: var(--cc-text-muted);
  }
  :global(.cc-select-content) {
    z-index: 60;
    min-width: var(--bits-select-anchor-width);
    max-height: min(20rem, var(--bits-select-content-available-height));
    overflow-y: auto;
    padding: var(--cc-space-1);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    box-shadow: 0 var(--cc-space-2) var(--cc-space-6)
      color-mix(in srgb, var(--cc-scrim) 50%, transparent);
    font-family: var(--cc-font-sans);
  }
  :global(.cc-select-item) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border-radius: var(--cc-radius-sm);
    cursor: pointer;
  }
  :global(.cc-select-item[data-highlighted]) {
    background: var(--cc-surface-hover);
  }
  :global(.cc-select-item[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
</style>
