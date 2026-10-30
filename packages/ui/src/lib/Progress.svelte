<!-- Determinate progress (bits-ui). `label` is required: a bar alone says nothing to a screen reader. -->
<script lang="ts">
  import { Progress } from 'bits-ui';

  interface Props {
    label: string;
    value: number;
    max?: number;
    /** Show the percentage next to the label. */
    showValue?: boolean;
  }

  let { label, value, max = 100, showValue = false }: Props = $props();

  const percent = $derived(Math.round((Math.min(Math.max(value, 0), max) / max) * 100));
</script>

<div class="cc-progress">
  <div class="head">
    <span>{label}</span>
    {#if showValue}<span class="value">{percent}%</span>{/if}
  </div>
  <Progress.Root {value} {max} aria-label={label} class="track">
    <div class="fill" style:width="{percent}%"></div>
  </Progress.Root>
</div>

<style>
  .cc-progress {
    display: grid;
    gap: var(--cc-space-1);
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
  :global(.cc-progress .track) {
    overflow: hidden;
    height: 0.5rem;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-surface-sunken);
    box-shadow: inset 0 0 0 1px var(--cc-border);
  }
  .fill {
    height: 100%;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-accent);
    transition: width var(--cc-duration-normal) var(--cc-ease-out);
  }
</style>
