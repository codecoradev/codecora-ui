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

<span
  class="cc-icon [&_svg]:size-icon inline-flex flex-none [&_svg]:[stroke-width:var(--cc-icon-stroke)]"
  aria-hidden="true"><Icon /></span
>
