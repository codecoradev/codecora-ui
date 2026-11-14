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
    <Dialog.Overlay
      class="cc-palette-overlay z-overlay bg-overlay animate-overlay-in data-[state=closed]:animate-overlay-out fixed inset-0 motion-reduce:animate-none"
    />
    <!-- Opacity eases; only the movement springs. Exits run one step shorter. -->
    <Dialog.Content
      class="cc-palette z-modal border-border bg-popover text-foreground shadow-modal animate-palette-in data-[state=closed]:animate-palette-out fixed top-[min(20%,2*var(--cc-space-16))] left-1/2 w-[min(36rem,calc(100vw-2*var(--cc-space-4)))] -translate-x-1/2 overflow-hidden rounded-lg border font-sans motion-reduce:animate-none"
      aria-label={label}
    >
      <Dialog.Title class="cc-palette-title sr-only">{label}</Dialog.Title>
      <Command.Root class="cc-palette-root">
        <!-- font: inherit is inline: a keyword reads no token, which the class lint asks of arbitrary values. -->
        <Command.Input
          {placeholder}
          class="cc-palette-input min-h-control border-border px-control-x focus-visible:outline-ring w-full border-0 border-b bg-transparent text-inherit focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:-outline-offset-2 focus-visible:outline-solid"
          style="font: inherit"
          aria-label={label}
        />
        <Command.List
          class="cc-palette-list max-h-[min(5*var(--cc-space-16),50dvh)] overflow-y-auto p-1"
        >
          <Command.Viewport>
            <Command.Empty
              class="cc-palette-empty px-control-x text-muted-foreground py-4 text-center"
              >{emptyText}</Command.Empty
            >
            {#each groups as group (group.heading)}
              <Command.Group>
                <Command.GroupHeading
                  class="cc-palette-heading px-control-x text-muted-foreground pt-2 pb-1 text-[length:var(--cc-font-size-xs)] font-semibold"
                  >{group.heading}</Command.GroupHeading
                >
                <Command.GroupItems>
                  {#each group.items as item (item.value)}
                    <Command.Item
                      value={item.value}
                      keywords={[item.label, ...(item.keywords ?? [])]}
                      onSelect={() => run(item)}
                      class="cc-palette-item min-h-control px-control-x data-selected:bg-accent flex cursor-pointer items-center gap-3 rounded-sm"
                    >
                      {#if item.icon}<Icon icon={item.icon} />{/if}
                      <span class="flex-1">{item.label}</span>
                      {#if item.hint}<kbd
                          class="text-muted-foreground font-mono text-[length:var(--cc-font-size-xs)]"
                          >{item.hint}</kbd
                        >{/if}
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
