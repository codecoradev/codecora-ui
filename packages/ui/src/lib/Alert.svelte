<!--
  A message in the flow of the page. Danger interrupts (role=alert); the rest
  are polite status. An icon backs the colour so tone never depends on hue.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
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

<div class={['cc-alert', `cc-alert-${tone}`]} role={tone === 'danger' ? 'alert' : 'status'}>
  <Glyph name={glyph} />
  <div class="text">
    {#if title}<p class="title">{title}</p>{/if}
    <div class="message">{@render children()}</div>
  </div>
</div>

<style>
  .cc-alert {
    display: flex;
    align-items: flex-start;
    gap: var(--cc-space-3);
    padding: var(--cc-space-3) var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-sunken);
    color: var(--cc-text);
  }
  .cc-alert-accent {
    border-color: var(--cc-accent);
    background: var(--cc-accent-soft);
  }
  .cc-alert-success {
    border-color: var(--cc-success);
    background: var(--cc-success-soft);
  }
  .cc-alert-warning {
    border-color: var(--cc-warning);
    background: var(--cc-warning-soft);
  }
  .cc-alert-danger {
    border-color: var(--cc-danger);
    background: var(--cc-danger-soft);
  }
  .cc-alert-accent :global(.cc-glyph) {
    color: var(--cc-accent);
  }
  .cc-alert-success :global(.cc-glyph) {
    color: var(--cc-success);
  }
  .cc-alert-warning :global(.cc-glyph) {
    color: var(--cc-warning);
  }
  .cc-alert-danger :global(.cc-glyph) {
    color: var(--cc-danger);
  }
  .text {
    display: grid;
    gap: var(--cc-space-1);
  }
  .title {
    margin: 0;
    font-weight: 600;
  }
  .message {
    font-size: var(--cc-font-size-sm);
  }
</style>
