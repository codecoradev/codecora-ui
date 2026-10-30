<!--
  Renders an icon component passed as a prop (Lucide, Phosphor or any Svelte
  component) at the theme's size and stroke. Decorative: the control that
  holds it carries the accessible name.
-->
<script lang="ts">
  import type { IconComponent } from '../types.js';

  interface Props {
    icon: IconComponent;
  }

  let { icon: Icon }: Props = $props();
</script>

<span class="cc-icon" aria-hidden="true"><Icon /></span>

<style>
  .cc-icon {
    display: inline-flex;
    flex: none;
  }
  .cc-icon :global(svg) {
    width: var(--cc-icon-size);
    height: var(--cc-icon-size);
    stroke-width: var(--cc-icon-stroke);
  }
</style>
