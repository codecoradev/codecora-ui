<!--
  Styles a native <table> you write inside it. The wrapper scrolls sideways on
  narrow screens and, only while it overflows, is a labelled focusable region so
  keyboard users can scroll it; a table that fits adds no tab stop.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** Names the table; shown to assistive technology and as the caption. */
    label: string;
    /**
     * Names the scroll region while the table overflows. Defaults to the label plus
     * "(scrollable)", so it differs from a heading or section that carries the same
     * words (landmarks on a page need distinct names).
     */
    regionLabel?: string;
    children: Snippet;
  }

  let { label, regionLabel, children }: Props = $props();

  let wrap = $state<HTMLElement>();
  let overflowing = $state(false);

  // A scroll region has to be reachable by keyboard (WCAG 2.1.1), but only while
  // there is something to scroll. Until it is measured (and without JavaScript) the
  // wrapper is a plain element, and the caption names the table. One pixel of slack
  // absorbs sub-pixel rounding.
  $effect(() => {
    if (!wrap) return;
    const element = wrap;
    const measure = () => {
      overflowing = element.scrollWidth - element.clientWidth > 1;
    };
    measure();
    // The wrapper changes with the viewport, the table with its rows and columns.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    return () => observer.disconnect();
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="cc-table-wrap"
  bind:this={wrap}
  role={overflowing ? 'region' : undefined}
  aria-label={overflowing ? (regionLabel ?? `${label} (scrollable)`) : undefined}
  tabindex={overflowing ? 0 : undefined}
>
  <table class="cc-table">
    <caption class="cc-table-caption">{label}</caption>
    {@render children()}
  </table>
</div>

<style>
  .cc-table-wrap {
    position: relative; /* contains the visually hidden caption and header labels */
    overflow-x: auto;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
  }
  .cc-table-wrap:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .cc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--cc-font-size-md);
  }
  .cc-table-caption {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .cc-table :global(th),
  .cc-table :global(td) {
    padding: var(--cc-cell-py) var(--cc-cell-px);
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid var(--cc-border);
  }
  .cc-table :global(thead th) {
    background: var(--cc-surface-sunken);
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
    white-space: nowrap;
  }
  .cc-table :global(tbody tr:last-child > *) {
    border-bottom: 0;
  }
  .cc-table :global(tbody tr) {
    transition:
      background-color var(--cc-duration-fast) var(--cc-ease-out),
      box-shadow var(--cc-duration-fast) var(--cc-ease-out);
  }
  .cc-table :global(tbody tr:hover) {
    background: var(--cc-surface-hover);
  }
  .cc-table :global(tbody tr[data-selected='true']),
  .cc-table :global(tbody tr[aria-selected='true']) {
    background: var(--cc-accent-soft);
    box-shadow: inset var(--cc-row-marker) 0 0 var(--cc-accent);
  }
  @media (prefers-reduced-motion: reduce) {
    .cc-table :global(tbody tr) {
      transition: none;
    }
  }
  .cc-table :global(.num) {
    text-align: right;
    font-family: var(--cc-font-mono);
    font-variant-numeric: tabular-nums;
  }
</style>
