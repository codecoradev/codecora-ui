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
      <Tooltip.Content {side} sideOffset={6} class="cc-tooltip">{content}</Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>

<style>
  :global(.cc-tooltip) {
    z-index: var(--cc-layer-tooltip);
    max-width: 18rem;
    padding: var(--cc-space-1) var(--cc-space-2);
    border-radius: var(--cc-radius-sm);
    background: var(--cc-text);
    color: var(--cc-surface);
    font-family: var(--cc-font-sans);
    font-size: var(--cc-font-size-sm);
    line-height: var(--cc-leading-tight);
    transform-origin: var(--bits-tooltip-content-transform-origin);
    animation: cc-tooltip-in var(--cc-duration-fast) var(--cc-ease-out);
  }
  /* bits-ui keeps the tooltip mounted until the exit animation finishes. */
  :global(.cc-tooltip[data-state='closed']) {
    animation: cc-tooltip-out var(--cc-duration-instant) var(--cc-ease-exit) forwards;
  }
  @keyframes cc-tooltip-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
  }
  @keyframes cc-tooltip-out {
    to {
      opacity: 0;
      transform: scale(0.96);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.cc-tooltip[data-state]) {
      animation: none;
    }
  }
</style>
