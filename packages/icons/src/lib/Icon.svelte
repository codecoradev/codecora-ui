<!--
  Renders any Svelte icon component at the theme's icon size and stroke
  (--cc-icon-size, --cc-icon-stroke), so a theme can change icon weight.
  Decorative by default (aria-hidden); pass `label` for an icon that carries
  meaning on its own. Size and stroke can be overridden for one icon.
-->
<script lang="ts">
  import type { IconComponent } from './types.js';

  interface Props {
    icon: IconComponent;
    /** Accessible name; without it the icon is hidden from assistive technology. */
    label?: string;
    /** CSS length overriding --cc-icon-size, for example "1rem". */
    size?: string;
    /** Number overriding --cc-icon-stroke. */
    stroke?: number | string;
    /** Extra props for the icon component (for example Phosphor's `weight`). */
    iconProps?: Record<string, unknown>;
    class?: string;
  }

  let { icon: Glyph, label, size, stroke, iconProps = {}, class: className }: Props = $props();
</script>

<span
  class={['cc-icon', className]}
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  style:--cc-icon-size={size}
  style:--cc-icon-stroke={stroke}
>
  <Glyph {...iconProps} />
</span>

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
