<!-- Tabs with arrow-key navigation (bits-ui). `panel` renders the content for the active value. -->
<script lang="ts">
  import { Tabs } from 'bits-ui';
  import type { Snippet } from 'svelte';

  interface Item {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    items: Item[];
    value?: string;
    /** Names the tab list for assistive technology. */
    label: string;
    panel: Snippet<[string]>;
  }

  let { items, value = $bindable(), label, panel }: Props = $props();

  $effect.pre(() => {
    if (value === undefined) value = items[0]?.value;
  });
</script>

<Tabs.Root bind:value class="cc-tabs">
  <Tabs.List class="cc-tabs-list" aria-label={label}>
    {#each items as item (item.value)}
      <Tabs.Trigger value={item.value} disabled={item.disabled} class="cc-tab">
        {item.label}
      </Tabs.Trigger>
    {/each}
  </Tabs.List>
  {#each items as item (item.value)}
    <Tabs.Content value={item.value} class="cc-tab-panel">{@render panel(item.value)}</Tabs.Content>
  {/each}
</Tabs.Root>

<style>
  :global(.cc-tabs-list) {
    display: flex;
    gap: var(--cc-space-1);
    overflow-x: auto;
    border-bottom: 1px solid var(--cc-border);
  }
  :global(.cc-tab) {
    flex: none;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 0;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    background: transparent;
    color: var(--cc-text-muted);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
  :global(.cc-tab:hover:not([data-disabled])) {
    color: var(--cc-text);
  }
  :global(.cc-tab[data-state='active']) {
    color: var(--cc-text);
    border-bottom-color: var(--cc-accent);
  }
  :global(.cc-tab[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  :global(.cc-tab:focus-visible) {
    outline: 2px solid var(--cc-focus);
    outline-offset: -2px;
    border-radius: var(--cc-radius-sm);
  }
  :global(.cc-tab-panel) {
    padding-top: var(--cc-space-4);
  }
  :global(.cc-tab-panel:focus-visible) {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
  }
</style>
