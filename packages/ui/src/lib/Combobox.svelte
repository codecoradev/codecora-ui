<!--
  Type to filter a list, then pick one (bits-ui). Use Select for a short list
  and Combobox when people know what they are looking for. Give it a `label`
  or put it in a Field.
-->
<script lang="ts">
  import { Combobox } from 'bits-ui';
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
    required?: boolean;
    disabled?: boolean;
    /** Shown when nothing matches the typed text. */
    emptyText?: string;
    'aria-describedby'?: string;
  }

  let {
    items,
    value = $bindable(''),
    placeholder = 'Search…',
    label,
    id,
    invalid = false,
    required = false,
    disabled = false,
    emptyText = 'No matches',
    'aria-describedby': describedby,
  }: Props = $props();

  let search = $state('');
  let open = $state(false);

  const selected = $derived(items.find((item) => item.value === value));
  const shown = $derived(
    search.trim() === ''
      ? items
      : items.filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase())),
  );
</script>

<Combobox.Root
  type="single"
  bind:value
  bind:open
  {items}
  {disabled}
  inputValue={open ? search : (selected?.label ?? '')}
  onOpenChange={(next) => {
    if (next) search = '';
  }}
>
  <div class="cc-combobox">
    <Combobox.Input
      {id}
      {placeholder}
      aria-label={label}
      aria-describedby={describedby}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
      oninput={(event) => {
        search = event.currentTarget.value;
        open = true;
      }}
      class="cc-combobox-input"
    />
    <Combobox.Trigger class="cc-combobox-trigger" aria-label="Show options">
      <Glyph name="chevron-down" />
    </Combobox.Trigger>
  </div>
  <Combobox.Portal>
    <Combobox.Content class="cc-combobox-content" sideOffset={4}>
      <Combobox.Viewport class="cc-combobox-viewport">
        {#each shown as item (item.value)}
          <Combobox.Item
            value={item.value}
            label={item.label}
            disabled={item.disabled}
            class="cc-combobox-item"
          >
            {#snippet children({ selected })}
              <span>{item.label}</span>
              {#if selected}<Glyph name="check" />{/if}
            {/snippet}
          </Combobox.Item>
        {:else}
          <p class="empty" role="status">{emptyText}</p>
        {/each}
      </Combobox.Viewport>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>

<style>
  .cc-combobox {
    position: relative;
    display: flex;
    align-items: center;
  }
  :global(.cc-combobox-input) {
    width: 100%;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px) calc(var(--cc-control-px) + 1.75rem);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font: inherit;
  }
  :global(.cc-combobox-input[aria-invalid='true']) {
    border-color: var(--cc-danger);
    box-shadow: inset 0 0 0 1px var(--cc-danger);
  }
  :global(.cc-combobox-input:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: 1px;
  }
  :global(.cc-combobox-input:disabled) {
    background: var(--cc-surface-sunken);
    cursor: not-allowed;
  }
  :global(.cc-combobox-trigger) {
    position: absolute;
    inset-inline-end: var(--cc-space-2);
    display: inline-grid;
    place-items: center;
    padding: var(--cc-space-1);
    border: 0;
    border-radius: var(--cc-radius-sm);
    background: none;
    color: var(--cc-text-muted);
    cursor: pointer;
  }
  :global(.cc-combobox-content) {
    z-index: 60;
    min-width: var(--bits-combobox-anchor-width);
    max-height: min(20rem, var(--bits-combobox-content-available-height));
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
  :global(.cc-combobox-item) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border-radius: var(--cc-radius-sm);
    cursor: pointer;
  }
  :global(.cc-combobox-item[data-highlighted]) {
    background: var(--cc-surface-hover);
  }
  :global(.cc-combobox-item[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .empty {
    margin: 0;
    padding: var(--cc-space-2) var(--cc-control-px);
    color: var(--cc-text-muted);
  }
</style>
