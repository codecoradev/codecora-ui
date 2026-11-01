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

  // One underline slides to the selected tab. Until it has been measured (and
  // without JavaScript) the selected tab draws its own border instead.
  let list = $state<HTMLElement | null>(null);
  let indicator = $state<{ x: number; width: number } | null>(null);
  let settled = $state(false);

  function measure() {
    const active = list?.querySelector<HTMLElement>(':scope > [data-state="active"]');
    indicator = active ? { x: active.offsetLeft, width: active.offsetWidth } : null;
  }

  $effect(() => {
    void value;
    void items;
    measure();
  });

  $effect(() => {
    if (!list) return;
    void items;
    const observer = new ResizeObserver(measure);
    for (const tab of list.children) observer.observe(tab);
    // Turn the slide on after the first placement, so the underline does not fly in on load.
    const frame = requestAnimationFrame(() => (settled = true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  });
</script>

<Tabs.Root bind:value class="cc-tabs">
  <Tabs.List
    bind:ref={list}
    class="cc-tabs-list"
    aria-label={label}
    data-indicator={indicator ? '' : undefined}
  >
    {#each items as item (item.value)}
      <Tabs.Trigger value={item.value} disabled={item.disabled} class="cc-tab">
        {item.label}
      </Tabs.Trigger>
    {/each}
    {#if indicator}
      <span
        class={['cc-tab-indicator', settled && 'settled']}
        style:translate="{indicator.x}px 0"
        style:scale="{indicator.width} 1"
        aria-hidden="true"
      ></span>
    {/if}
  </Tabs.List>
  {#each items as item (item.value)}
    <Tabs.Content value={item.value} class="cc-tab-panel">{@render panel(item.value)}</Tabs.Content>
  {/each}
</Tabs.Root>

<style>
  :global(.cc-tabs-list) {
    position: relative;
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
  :global(.cc-tabs-list[data-indicator] .cc-tab[data-state='active']) {
    border-bottom-color: transparent;
  }
  /* A 1px bar scaled to the tab's width: transform only, so the spring may move it. */
  .cc-tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 2px;
    background: var(--cc-accent);
    transform-origin: left;
    pointer-events: none;
  }
  .cc-tab-indicator.settled {
    transition:
      translate var(--cc-duration-slow) var(--cc-ease-spring),
      scale var(--cc-duration-slow) var(--cc-ease-spring);
  }
  :global(.cc-tab[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
    /* A dashed underline tells "unavailable" apart from an unselected tab (none) and the selected one (solid). */
    border-bottom-style: dashed;
    border-bottom-color: currentColor;
  }
  :global(.cc-tab:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: -2px;
    border-radius: var(--cc-radius-sm);
  }
  :global(.cc-tab-panel) {
    padding-top: var(--cc-space-4);
  }
  :global(.cc-tab-panel:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  @media (prefers-reduced-motion: reduce) {
    .cc-tab-indicator.settled {
      transition: none;
    }
  }
</style>
