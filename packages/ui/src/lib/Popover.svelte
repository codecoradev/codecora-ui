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
    <Popover.Content
      {side}
      sideOffset={6}
      role="dialog"
      aria-label={label}
      class="cc-popover z-popover border-border bg-popover text-foreground shadow-popover animate-popover-in data-[state=closed]:animate-popover-out max-w-[min(22rem,calc(100vw-2*var(--cc-space-4)))] origin-[var(--bits-popover-content-transform-origin)] rounded-md border p-4 font-sans motion-reduce:animate-none"
    >
      {@render children()}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
