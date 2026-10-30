<!-- A row of related toggles (bits-ui): one choice, or several. Arrow keys move between them. -->
<script lang="ts">
  import { ToggleGroup } from 'bits-ui';

  interface Item {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    items: Item[];
    /** Names the group for assistive tech. */
    label: string;
    type?: 'single' | 'multiple';
    value?: string | string[];
  }

  let {
    items,
    label,
    type = 'single',
    value = $bindable(type === 'single' ? '' : []),
  }: Props = $props();
</script>

<!-- bits-ui types `value` per `type`; the union is narrowed by `type` at the call site. -->
<ToggleGroup.Root {type} bind:value={value as never} aria-label={label} class="cc-toggles">
  {#each items as item (item.value)}
    <ToggleGroup.Item value={item.value} disabled={item.disabled} class="cc-toggle">
      {item.label}
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>

<style>
  :global(.cc-toggles) {
    display: inline-flex;
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
  }
  :global(.cc-toggle) {
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 0;
    border-radius: 0;
    background: none;
    color: var(--cc-text);
    font: inherit;
    cursor: pointer;
  }
  :global(.cc-toggle + .cc-toggle) {
    border-inline-start: 1px solid var(--cc-border-strong);
  }
  :global(.cc-toggle:first-child) {
    border-start-start-radius: calc(var(--cc-radius-md) - 1px);
    border-end-start-radius: calc(var(--cc-radius-md) - 1px);
  }
  :global(.cc-toggle:last-child) {
    border-start-end-radius: calc(var(--cc-radius-md) - 1px);
    border-end-end-radius: calc(var(--cc-radius-md) - 1px);
  }
  :global(.cc-toggle:hover) {
    background: var(--cc-surface-hover);
  }
  :global(.cc-toggle[data-state='on']) {
    background: var(--cc-accent);
    color: var(--cc-accent-text);
  }
  :global(.cc-toggle:focus-visible) {
    position: relative;
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: -2px;
  }
  :global(.cc-toggle[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
</style>
