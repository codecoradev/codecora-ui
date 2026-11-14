<!-- Tabs with arrow-key navigation (bits-ui). `panel` renders the content for the active value. -->
<script lang="ts">
  import { Tabs } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import { cn, type ClassValue } from './cn.js';

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
    class?: ClassValue;
  }

  let { items, value = $bindable(), label, panel, class: className }: Props = $props();

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

<Tabs.Root bind:value class={cn('cc-tabs', className)}>
  <!-- The tabs sit 1px over the list's border (-mb-px), which would make the list
       scroll vertically too and draw a scrollbar: overflow-y-hidden. The underline
       is inside the box, so nothing is lost. -->
  <Tabs.List
    bind:ref={list}
    class="cc-tabs-list border-border relative flex gap-1 overflow-x-auto overflow-y-hidden border-b"
    aria-label={label}
    data-indicator={indicator ? '' : undefined}
  >
    {#each items as item (item.value)}
      <!-- A dashed underline tells "unavailable" apart from an unselected tab (none) and the selected one (solid). -->
      <Tabs.Trigger
        value={item.value}
        disabled={item.disabled}
        class={cn(
          'cc-tab min-h-control px-control-x font-inherit text-muted-foreground -mb-px flex-none cursor-pointer border-0 border-b-2 border-transparent bg-transparent font-medium',
          'not-data-disabled:hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground in-data-indicator:data-[state=active]:border-b-transparent',
          'data-disabled:cursor-not-allowed data-disabled:border-dashed data-disabled:border-b-current data-disabled:opacity-55',
          'focus-visible:outline-ring focus-visible:rounded-sm focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:-outline-offset-2',
        )}
      >
        {item.label}
      </Tabs.Trigger>
    {/each}
    {#if indicator}
      <!-- A 1px bar scaled to the tab's width: transform only, so the spring may move it. -->
      <span
        class={[
          'cc-tab-indicator bg-primary pointer-events-none absolute bottom-0 left-0 h-0.5 w-px origin-left',
          settled &&
            'duration-slow ease-spring transition-[translate,scale] motion-reduce:transition-none',
        ]}
        style:translate="{indicator.x}px 0"
        style:scale="{indicator.width} 1"
        aria-hidden="true"
      ></span>
    {/if}
  </Tabs.List>
  {#each items as item (item.value)}
    <Tabs.Content
      value={item.value}
      class="cc-tab-panel focus-visible:outline-ring pt-4 focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)]"
      >{@render panel(item.value)}</Tabs.Content
    >
  {/each}
</Tabs.Root>
