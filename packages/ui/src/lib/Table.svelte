<!--
  Styles a native <table> you write inside it. The wrapper scrolls sideways on
  narrow screens and is focusable so keyboard users can scroll it.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** Names the table; shown to assistive technology and as the scroll region label. */
    label: string;
    children: Snippet;
  }

  let { label, children }: Props = $props();
</script>

<!-- A focusable scroll region lets keyboard users scroll a wide table. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="cc-table-wrap" role="region" aria-label={label} tabindex="0">
  <table class="cc-table">
    <caption class="cc-table-caption">{label}</caption>
    {@render children()}
  </table>
</div>

<style>
  .cc-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
  }
  .cc-table-wrap:focus-visible {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
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
  .cc-table :global(tbody tr:hover) {
    background: var(--cc-surface-hover);
  }
  .cc-table :global(.num) {
    text-align: right;
    font-family: var(--cc-font-mono);
    font-variant-numeric: tabular-nums;
  }
</style>
