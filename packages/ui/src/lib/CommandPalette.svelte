<!--
  Jump to a page or run an action by typing (bits-ui Command in a dialog).
  Opens with the `shortcut` key (Cmd or Ctrl plus the key); arrow keys move,
  Enter runs, Escape closes.

    <CommandPalette bind:open groups={[{ heading: 'Go to', items: [{ value: 'keys', label: 'API keys', onselect }] }]} />
-->
<script lang="ts">
  import { Command, Dialog } from 'bits-ui';
  import Icon from './internal/Icon.svelte';
  import type { IconComponent } from './types.js';

  interface Item {
    value: string;
    label: string;
    /** Extra words that should find this item. */
    keywords?: string[];
    icon?: IconComponent;
    /** Shortcut hint shown on the right, for example "G K". */
    hint?: string;
    onselect: () => void;
  }

  interface Group {
    heading: string;
    items: Item[];
  }

  interface Props {
    groups: Group[];
    open?: boolean;
    /** Names the dialog for assistive tech. */
    label?: string;
    placeholder?: string;
    emptyText?: string;
    /** Key that opens the palette together with Cmd or Ctrl; empty to turn the shortcut off. */
    shortcut?: string;
  }

  let {
    groups,
    open = $bindable(false),
    label = 'Command palette',
    placeholder = 'Type a command or search…',
    emptyText = 'No results',
    shortcut = 'k',
  }: Props = $props();

  function onkeydown(event: KeyboardEvent) {
    if (shortcut && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut) {
      event.preventDefault();
      open = !open;
    }
  }

  function run(item: Item) {
    open = false;
    item.onselect();
  }
</script>

<svelte:window {onkeydown} />

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="cc-palette-overlay" />
    <Dialog.Content class="cc-palette" aria-label={label}>
      <Dialog.Title class="cc-palette-title">{label}</Dialog.Title>
      <Command.Root class="cc-palette-root">
        <Command.Input {placeholder} class="cc-palette-input" aria-label={label} />
        <Command.List class="cc-palette-list">
          <Command.Viewport>
            <Command.Empty class="cc-palette-empty">{emptyText}</Command.Empty>
            {#each groups as group (group.heading)}
              <Command.Group>
                <Command.GroupHeading class="cc-palette-heading"
                  >{group.heading}</Command.GroupHeading
                >
                <Command.GroupItems>
                  {#each group.items as item (item.value)}
                    <Command.Item
                      value={item.value}
                      keywords={[item.label, ...(item.keywords ?? [])]}
                      onSelect={() => run(item)}
                      class="cc-palette-item"
                    >
                      {#if item.icon}<Icon icon={item.icon} />{/if}
                      <span class="label">{item.label}</span>
                      {#if item.hint}<kbd class="hint">{item.hint}</kbd>{/if}
                    </Command.Item>
                  {/each}
                </Command.GroupItems>
              </Command.Group>
            {/each}
          </Command.Viewport>
        </Command.List>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.cc-palette-overlay) {
    position: fixed;
    inset: 0;
    z-index: var(--cc-layer-overlay);
    background: var(--cc-scrim);
  }
  :global(.cc-palette) {
    position: fixed;
    top: min(20%, 8rem);
    left: 50%;
    z-index: var(--cc-layer-modal);
    width: min(36rem, calc(100vw - 2 * var(--cc-space-4)));
    transform: translateX(-50%);
    overflow: hidden;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    box-shadow: var(--cc-shadow-modal);
    font-family: var(--cc-font-sans);
  }
  :global(.cc-palette-title) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  :global(.cc-palette-input) {
    width: 100%;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 0;
    border-bottom: 1px solid var(--cc-border);
    background: none;
    color: inherit;
    font: inherit;
  }
  :global(.cc-palette-input:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: -2px;
  }
  :global(.cc-palette-list) {
    max-height: min(20rem, 50dvh);
    overflow-y: auto;
    padding: var(--cc-space-1);
  }
  :global(.cc-palette-heading) {
    padding: var(--cc-space-2) var(--cc-control-px) var(--cc-space-1);
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
    font-weight: 600;
  }
  :global(.cc-palette-item) {
    display: flex;
    align-items: center;
    gap: var(--cc-space-3);
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border-radius: var(--cc-radius-sm);
    cursor: pointer;
  }
  :global(.cc-palette-item[data-selected]) {
    background: var(--cc-surface-hover);
  }
  :global(.cc-palette-item .label) {
    flex: 1;
  }
  :global(.cc-palette-item .hint) {
    color: var(--cc-text-muted);
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-xs);
  }
  :global(.cc-palette-empty) {
    padding: var(--cc-space-4) var(--cc-control-px);
    color: var(--cc-text-muted);
    text-align: center;
  }
</style>
