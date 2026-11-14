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

<div class="cc-progress grid gap-1">
  <div class="flex justify-between text-sm leading-[inherit]">
    <span>{label}</span>
    {#if showValue}<span class="text-muted-foreground font-mono tabular-nums">{percent}%</span>{/if}
  </div>
  <Progress.Root
    {value}
    {max}
    aria-label={label}
    class="bg-muted inset-ring-border h-2 overflow-hidden rounded-full inset-ring"
  >
    <div
      class="bg-primary duration-normal ease-enter h-full rounded-full transition-[width]"
      style:width="{percent}%"
    ></div>
  </Progress.Root>
</div>
