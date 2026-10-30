<!--
  A small panel anchored to a trigger, for content or controls (a filter, a
  date, details). Use Dialog for anything that must be answered. The trigger
  is yours:

    <Popover label="Filters">
      {#snippet trigger({ props })}<Button {...props}>Filters</Button>{/snippet}
      …content…
    </Popover>
-->
<script lang="ts">
  import { Popover } from 'bits-ui';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Names the panel for assistive tech. */
    label: string;
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
    children: Snippet;
    open?: boolean;
    side?: 'top' | 'right' | 'bottom' | 'left';
  }

  let { label, trigger, children, open = $bindable(false), side = 'bottom' }: Props = $props();
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}{@render trigger({ props })}{/snippet}
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content {side} sideOffset={6} role="dialog" aria-label={label} class="cc-popover">
      {@render children()}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style>
  :global(.cc-popover) {
    z-index: 60;
    max-width: min(22rem, calc(100vw - 2rem));
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    box-shadow: 0 var(--cc-space-2) var(--cc-space-6)
      color-mix(in srgb, var(--cc-scrim) 50%, transparent);
    font-family: var(--cc-font-sans);
  }
</style>
