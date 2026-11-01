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

  // "Theme default" names the colour it resolves to, so the trigger always shows a value.
  const accentValue = $derived(
    appearance.accent === 'default' ? themes[appearance.theme].defaultAccent : appearance.accent,
  );
</script>

<Popover label="Theme">
  {#snippet trigger({ props })}
    <Button {...props} variant="secondary">
      <span class="trigger"
        ><span class="swatch" data-theme={appearance.theme} aria-hidden="true"></span><span
          class="value"
          ><span class={['axis', compact && 'visually-hidden']}
            >Theme<span class="visually-hidden">:</span></span
          >&nbsp;{themes[appearance.theme].label}</span
        ><ChevronDown class="chev" aria-hidden="true" /></span
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
      <span class="trigger"
        ><span class="swatch solid" aria-hidden="true"></span><span class="value"
          ><span class={['axis', compact && 'visually-hidden']}
            >Accent, density<span class="visually-hidden">:</span></span
          >&nbsp;<span class="cap">{accentValue} · {appearance.density}</span></span
        ><ChevronDown class="chev" aria-hidden="true" /></span
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

<style>
  .trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-2);
    max-width: 100%;
    min-width: 0;
    text-align: left;
  }
  .value {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* The axis name is a quiet caption before the value. */
  .axis {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
    font-weight: 400;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  /* Phones keep the values; the swatches carry the axis to the eye. */
  @media (max-width: 30rem) {
    .axis {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  }
  /* A theme swatch: its surface and accent split on the diagonal. */
  .swatch {
    flex: none;
    width: 1rem;
    height: 1rem;
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-sm);
    background: linear-gradient(135deg, var(--cc-surface) 50%, var(--cc-accent) 50%);
  }
  .swatch.solid {
    background: var(--cc-accent);
  }
  .trigger :global(.chev) {
    width: 1rem;
    height: 1rem;
    stroke-width: var(--cc-icon-stroke);
  }
  .cap {
    text-transform: capitalize;
  }
</style>
