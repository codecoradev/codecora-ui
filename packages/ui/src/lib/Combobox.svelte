<!--
  Type to filter a list, then pick one (bits-ui). Use Select for a short list
  and Combobox when people know what they are looking for. Give it a `label`
  or put it in a Field.
-->
<script lang="ts">
  import { Combobox } from 'bits-ui';
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
  <div class="cc-combobox relative flex items-center">
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
      class={cn(
        'cc-combobox-input min-h-control border-input bg-card ps-control-x font-inherit text-foreground w-full rounded-md border pe-[calc(var(--cc-control-px)+1.75rem)]',
        'placeholder:text-muted-foreground',
        'aria-invalid:border-destructive aria-invalid:inset-ring-destructive aria-invalid:inset-ring',
        'focus-visible:outline-ring focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-1',
        'disabled:bg-muted disabled:cursor-not-allowed',
      )}
    />
    <Combobox.Trigger
      class="cc-combobox-trigger text-muted-foreground absolute end-2 inline-grid cursor-pointer place-items-center rounded-sm border-0 bg-transparent p-1"
      aria-label="Show options"
    >
      <Glyph name="chevron-down" />
    </Combobox.Trigger>
  </div>
  <Combobox.Portal>
    <Combobox.Content
      class={cn(
        'cc-combobox-content z-popover border-border bg-popover text-foreground shadow-popover max-h-[min(20rem,var(--bits-combobox-content-available-height))] min-w-[var(--bits-combobox-anchor-width)] origin-[var(--bits-combobox-content-transform-origin)] overflow-y-auto rounded-md border p-1 font-sans',
        // bits-ui keeps the list mounted until the exit animation finishes.
        'animate-listbox-in data-[state=closed]:animate-listbox-out motion-reduce:data-[state]:animate-none',
      )}
      sideOffset={4}
    >
      <Combobox.Viewport class="cc-combobox-viewport">
        {#each shown as item (item.value)}
          <Combobox.Item
            value={item.value}
            label={item.label}
            disabled={item.disabled}
            class="cc-combobox-item min-h-control px-control-x data-highlighted:bg-accent flex cursor-pointer items-center justify-between gap-3 rounded-sm data-disabled:cursor-not-allowed data-disabled:opacity-55"
          >
            {#snippet children({ selected })}
              <span>{item.label}</span>
              {#if selected}<Glyph name="check" />{/if}
            {/snippet}
          </Combobox.Item>
        {:else}
          <p class="px-control-x text-muted-foreground m-0 py-2" role="status">{emptyText}</p>
        {/each}
      </Combobox.Viewport>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
