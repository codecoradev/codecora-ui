<!-- Pick a number in a range (bits-ui): arrow keys step, Home and End jump. `label` is required. -->
<script lang="ts">
  import { Slider } from 'bits-ui';
  import { cn } from './cn.js';

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

<div class="cc-slider grid gap-2">
  <div class="flex justify-between text-sm leading-[inherit]">
    <span id="{uid}-label">{label}</span>
    {#if showValue}<span class="text-muted-foreground font-mono tabular-nums">{format(value)}</span
      >{/if}
  </div>
  <Slider.Root
    type="single"
    bind:value
    {min}
    {max}
    {step}
    {disabled}
    class="group/track h-control relative flex w-full touch-none items-center data-disabled:opacity-55"
  >
    <span class="bg-muted inset-ring-input relative h-1.5 flex-1 rounded-full inset-ring">
      <!-- The range follows a keyboard step; while the thumb is dragged it keeps up with no lag. -->
      <Slider.Range
        class="bg-primary duration-fast ease-enter absolute h-full rounded-full transition-[right] group-has-data-active/track:transition-none motion-reduce:transition-none"
      />
    </span>
    <Slider.Thumb
      index={0}
      aria-labelledby="{uid}-label"
      aria-valuetext={format(value)}
      class={cn(
        'border-primary bg-card block size-5 cursor-grab rounded-full border-2',
        // Keyboard steps glide; a drag follows the pointer with no lag.
        'duration-fast ease-enter transition-[left,scale]',
        'data-active:scale-115 data-active:cursor-grabbing data-active:transition-[scale]',
        'motion-reduce:data-[orientation]:transition-none',
        'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus',
        'group-data-disabled/track:cursor-not-allowed',
      )}
    />
  </Slider.Root>
</div>
