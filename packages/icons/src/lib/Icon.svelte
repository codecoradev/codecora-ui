<!--
  Renders any Svelte icon component at the theme's icon size and stroke
  (size-icon, stroke-icon: --cc-icon-size, --cc-icon-stroke), so a theme can
  change icon weight. Needs Tailwind 4 with @codecora/tokens/theme.css and
  @codecora/icons/source.css.
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
  class={['cc-icon [&_svg]:size-icon [&_svg]:stroke-icon inline-flex flex-none', className]}
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  style:--cc-icon-size={size}
  style:--cc-icon-stroke={stroke}
>
  <Glyph {...iconProps} />
</span>
