<!-- Pick a number in a range (bits-ui): arrow keys step, Home and End jump. `label` is required. -->
<script lang="ts">
  import { Slider } from 'bits-ui';

  interface Props {
    label: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    /** Show the current value next to the label. */
    showValue?: boolean;
    /** How to read the value aloud, for example `(v) => `${v} GB``. */
    format?: (value: number) => string;
  }

  let {
    label,
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    showValue = false,
    format = (v) => String(v),
  }: Props = $props();

  const uid = $props.id();
</script>

<div class="cc-slider">
  <div class="head">
    <span id="{uid}-label">{label}</span>
    {#if showValue}<span class="value">{format(value)}</span>{/if}
  </div>
  <Slider.Root type="single" bind:value {min} {max} {step} {disabled} class="track">
    <span class="rail"><Slider.Range class="range" /></span>
    <Slider.Thumb
      index={0}
      aria-labelledby="{uid}-label"
      aria-valuetext={format(value)}
      class="thumb"
    />
  </Slider.Root>
</div>

<style>
  .cc-slider {
    display: grid;
    gap: var(--cc-space-2);
  }
  .head {
    display: flex;
    justify-content: space-between;
    font-size: var(--cc-font-size-sm);
  }
  .value {
    color: var(--cc-text-muted);
    font-family: var(--cc-font-mono);
    font-variant-numeric: tabular-nums;
  }
  :global(.cc-slider .track) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--cc-control-h);
    touch-action: none;
  }
  .rail {
    position: relative;
    flex: 1;
    height: 0.375rem;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-surface-sunken);
    box-shadow: inset 0 0 0 1px var(--cc-border-strong);
  }
  :global(.cc-slider .range) {
    position: absolute;
    height: 100%;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-accent);
  }
  :global(.cc-slider .thumb) {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--cc-accent);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-surface-raised);
    cursor: grab;
  }
  :global(.cc-slider .thumb:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  :global(.cc-slider .track[data-disabled]) {
    opacity: 0.55;
  }
  :global(.cc-slider .track[data-disabled] .thumb) {
    cursor: not-allowed;
  }
</style>
