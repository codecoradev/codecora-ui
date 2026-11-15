<!--
  A message in the flow of the page. Danger interrupts (role=alert); the rest
  are polite status. An icon backs the colour so tone never depends on hue.
-->
<script module lang="ts">
  import { tv } from './internal/variants.js';

  /** Arrives where it stays: a short settle into place, no spring in the reading flow. */
  const alert = tv({
    base: 'cc-alert animate-settle-in text-foreground flex items-start gap-3 rounded-md border px-4 py-3 motion-reduce:animate-none',
    variants: {
      tone: {
        neutral: 'border-border bg-muted',
        accent: 'border-primary bg-primary-soft [&_.cc-glyph]:text-primary',
        success: 'border-success bg-success-soft [&_.cc-glyph]:text-success',
        warning: 'border-warning bg-warning-soft [&_.cc-glyph]:text-warning',
        danger: 'border-destructive bg-destructive-soft [&_.cc-glyph]:text-destructive',
      },
    },
  });
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from './cn.js';
  import Glyph from './internal/Glyph.svelte';
  import type { Tone } from './types.js';

  interface Props {
    tone?: Tone;
    title?: string;
    children: Snippet;
  }

  let { tone = 'neutral', title, children }: Props = $props();

  const glyph = $derived(tone === 'success' ? 'check' : 'alert');
</script>

<div class={cn(alert({ tone }), `cc-alert-${tone}`)} role={tone === 'danger' ? 'alert' : 'status'}>
  <Glyph name={glyph} />
  <div class="grid gap-1">
    {#if title}<p class="m-0 font-semibold">{title}</p>{/if}
    <div class="text-sm leading-[inherit]">{@render children()}</div>
  </div>
</div>
