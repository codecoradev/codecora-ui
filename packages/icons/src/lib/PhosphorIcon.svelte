<!--
  Icon for Phosphor components. Phosphor draws weight with a `weight` prop
  rather than a stroke width, so the theme stroke is mapped to the closest
  weight; pass `weight` to choose one explicitly.
-->
<script lang="ts">
  import Icon from './Icon.svelte';
  import { weightForStroke, type PhosphorWeight } from './phosphor-weight.js';
  import type { IconComponent } from './types.js';

  interface Props {
    icon: IconComponent;
    label?: string;
    size?: string;
    /** Explicit weight. Defaults to the weight closest to `stroke`, else "regular". */
    weight?: PhosphorWeight;
    /** The theme's `--cc-icon-stroke` value, if you read it, to pick a weight. */
    stroke?: number;
    class?: string;
  }

  let { icon, label, size, weight, stroke, class: className }: Props = $props();

  const resolved = $derived(weight ?? (stroke === undefined ? 'regular' : weightForStroke(stroke)));
</script>

<Icon {icon} {label} {size} class={className} iconProps={{ weight: resolved }} />
