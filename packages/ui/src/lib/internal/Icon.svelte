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
  data-slot="icon"
  class="[&_svg]:size-icon [&_svg]:stroke-icon inline-flex flex-none"
  aria-hidden="true"><Icon /></span
>
