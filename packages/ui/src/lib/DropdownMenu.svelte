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
    <DropdownMenu.Content {side} sideOffset={6} aria-label={label} class="cc-menu">
      {#each items as item (item.label)}
        {#if item.separatorBefore}<DropdownMenu.Separator class="cc-menu-rule" />{/if}
        <DropdownMenu.Item
          onSelect={item.onselect}
          disabled={item.disabled}
          class={['cc-menu-item', item.danger && 'cc-menu-danger']}
        >
          {#if item.icon}<Icon icon={item.icon} />{/if}
          {item.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>

<style>
  :global(.cc-menu) {
    z-index: var(--cc-layer-popover);
    min-width: 12rem;
    padding: var(--cc-space-1);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    box-shadow: var(--cc-shadow-popover);
    font-family: var(--cc-font-sans);
    transform-origin: var(--bits-dropdown-menu-content-transform-origin);
    animation: cc-menu-in var(--cc-duration-fast) var(--cc-ease-out);
  }
  /* bits-ui keeps the menu mounted until the exit animation finishes. */
  :global(.cc-menu[data-state='closed']) {
    animation: cc-menu-out var(--cc-duration-instant) var(--cc-ease-exit) forwards;
  }
  :global(.cc-menu-item) {
    display: flex;
    align-items: center;
    gap: var(--cc-space-2);
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border-radius: var(--cc-radius-sm);
    cursor: pointer;
  }
  :global(.cc-menu-item[data-highlighted]) {
    background: var(--cc-surface-hover);
  }
  :global(.cc-menu-item[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  :global(.cc-menu-danger) {
    color: var(--cc-danger);
  }
  :global(.cc-menu-rule) {
    height: 1px;
    margin: var(--cc-space-1) 0;
    background: var(--cc-border);
  }
  @keyframes cc-menu-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
  }
  @keyframes cc-menu-out {
    to {
      opacity: 0;
      transform: scale(0.96);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.cc-menu[data-state]) {
      animation: none;
    }
  }
</style>
