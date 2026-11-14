<!--
  A menu of actions (bits-ui): arrow keys, type-ahead, Escape. The trigger is
  yours; items report through `onselect`.

    <DropdownMenu label="Key actions" items={[{ label: 'Rename', onselect }]}>
      {#snippet trigger({ props })}<IconButton {...props} icon={More} label="Key actions" />{/snippet}
    </DropdownMenu>
-->
<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import Icon from './internal/Icon.svelte';
  import type { IconComponent } from './types.js';

  interface Item {
    label: string;
    onselect: () => void;
    icon?: IconComponent;
    /** Destructive action: drawn in the danger colour. */
    danger?: boolean;
    disabled?: boolean;
    /** Draws a rule above this item. */
    separatorBefore?: boolean;
  }

  interface Props {
    items: Item[];
    label: string;
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
    side?: 'top' | 'right' | 'bottom' | 'left';
  }

  let { items, label, trigger, side = 'bottom' }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}{@render trigger({ props })}{/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      {side}
      sideOffset={6}
      aria-label={label}
      class="cc-menu z-popover border-border bg-popover text-foreground shadow-popover animate-popover-in data-[state=closed]:animate-popover-out min-w-48 origin-[var(--bits-dropdown-menu-content-transform-origin)] rounded-md border p-1 font-sans motion-reduce:animate-none"
    >
      {#each items as item (item.label)}
        {#if item.separatorBefore}<DropdownMenu.Separator
            class="cc-menu-rule bg-border my-1 h-px"
          />{/if}
        <DropdownMenu.Item
          onSelect={item.onselect}
          disabled={item.disabled}
          class={[
            'cc-menu-item min-h-control px-control-x data-highlighted:bg-accent flex cursor-pointer items-center gap-2 rounded-sm data-disabled:cursor-not-allowed data-disabled:opacity-55',
            item.danger && 'cc-menu-danger text-destructive',
          ]}
        >
          {#if item.icon}<Icon icon={item.icon} />{/if}
          {item.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
