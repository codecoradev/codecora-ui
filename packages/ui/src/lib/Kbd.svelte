<!-- A keyboard key, for shortcuts in text and menus. -->
<!-- impeccable-disable border-accent-on-rounded: the 2px bottom edge is the key's own neutral border (border-input), the keycap depth it had in plain CSS, not an accent stripe -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<kbd
  class="cc-kbd border-input bg-card text-foreground inline-block min-w-6 rounded-sm border border-b-2 px-2 py-0.25 text-center font-mono text-xs leading-[calc(var(--cc-font-size-xs)*1.4)] [font-variant-ligatures:none]"
  >{@render children()}</kbd
>
