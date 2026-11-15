<!--
  The two appearance popovers, theme and accent with density, shared by the
  page toolbar and the dashboard. Each trigger leads with its current values;
  the axis names are small, and only read out on phones and when compact.
-->
<script lang="ts">
  import { themes } from '@codecora/tokens';
  import { ChevronDown } from '@codecora/icons/lucide';
  import { Button, Popover } from '@codecora/ui';
  import type { createAppearance } from './appearance.svelte.js';
  import Switchers from './Switchers.svelte';

  let {
    appearance,
    compact = false,
  }: {
    appearance: ReturnType<typeof createAppearance>;
    /** Values only, for narrow places such as the dashboard sidebar; the axis names are still read out. */
    compact?: boolean;
  } = $props();

  // "Theme default" says so and names the colour it resolves to, so a theme
  // change that moves the accent is visible in the trigger.
  const accentValue = $derived(
    appearance.accent === 'default'
      ? `Default (${themes[appearance.theme].defaultAccent})`
      : appearance.accent,
  );

  const triggerText = 'inline-flex max-w-full min-w-0 items-center gap-2 text-left';
  const value = 'min-w-0 truncate';
  /* The axis name is a quiet caption before the value; phones keep the values only,
     the swatches carry the axis to the eye. */
  const axis = 'text-muted-foreground text-xs leading-[inherit] font-normal max-[30rem]:sr-only';
  /* A theme swatch: its surface and accent split on the diagonal. */
  const swatch = 'border-input size-4 flex-none rounded-sm border';
  const chev = 'size-4 [stroke-width:var(--cc-icon-stroke)]';
</script>

<Popover label="Theme">
  {#snippet trigger({ props })}
    <Button {...props} variant="secondary">
      <span class={triggerText}
        ><span
          class="{swatch} bg-transparent bg-[linear-gradient(135deg,var(--background)_50%,var(--primary)_50%)]"
          data-theme={appearance.theme}
          aria-hidden="true"
        ></span><span class={value}
          ><span class={[axis, compact && 'sr-only']}>Theme<span class="sr-only">:</span></span
          >&nbsp;{themes[appearance.theme].label}</span
        ><ChevronDown class={chev} aria-hidden="true" /></span
      >
    </Button>
  {/snippet}
  <Switchers
    part="theme"
    bind:theme={appearance.theme}
    bind:accent={appearance.accent}
    bind:density={appearance.density}
  />
</Popover>
<Popover label="Accent and density">
  {#snippet trigger({ props })}
    <Button {...props} variant="secondary">
      <span class={triggerText}
        ><span class="{swatch} bg-primary" aria-hidden="true"></span><span class={value}
          ><span class={[axis, compact && 'sr-only']}
            >Accent, density<span class="sr-only">:</span></span
          >&nbsp;<span class="capitalize">{accentValue} · {appearance.density}</span></span
        ><ChevronDown class={chev} aria-hidden="true" /></span
      >
    </Button>
  {/snippet}
  <Switchers
    part="more"
    bind:theme={appearance.theme}
    bind:accent={appearance.accent}
    bind:density={appearance.density}
  />
</Popover>
