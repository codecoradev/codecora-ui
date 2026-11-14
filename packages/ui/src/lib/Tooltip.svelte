<!--
  Short text shown on hover and keyboard focus. Tooltips never carry
  essential information or controls. The trigger is yours:

    <Tooltip content="Copy link">
      {#snippet trigger({ props })}<button {...props}>…</button>{/snippet}
    </Tooltip>
-->
<script lang="ts">
  import { Tooltip } from 'bits-ui';
  import type { Snippet } from 'svelte';

  interface Props {
    content: string;
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
    side?: 'top' | 'right' | 'bottom' | 'left';
    delayDuration?: number;
  }

  let { content, trigger, side = 'top', delayDuration = 400 }: Props = $props();
</script>

<Tooltip.Provider {delayDuration}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}{@render trigger({ props })}{/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        {side}
        sideOffset={6}
        class="cc-tooltip z-tooltip bg-foreground text-background animate-popover-in data-[state=closed]:animate-popover-out max-w-72 origin-[var(--bits-tooltip-content-transform-origin)] rounded-sm px-2 py-1 font-sans text-sm leading-[var(--cc-leading-tight)] motion-reduce:animate-none"
        >{content}</Tooltip.Content
      >
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
