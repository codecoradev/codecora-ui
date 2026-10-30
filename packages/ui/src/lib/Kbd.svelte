<!-- A keyboard key, for shortcuts in text and menus. -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<kbd class="cc-kbd">{@render children()}</kbd>

<style>
  .cc-kbd {
    display: inline-block;
    min-width: 1.5rem;
    padding: 0.0625rem var(--cc-space-2);
    border: 1px solid var(--cc-border-strong);
    border-bottom-width: 2px;
    border-radius: var(--cc-radius-sm);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-xs);
    line-height: 1.4;
    text-align: center;
  }
</style>
