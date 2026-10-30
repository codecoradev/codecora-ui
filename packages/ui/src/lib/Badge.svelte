<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Tone } from './types.js';

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    tone?: Tone;
    children: Snippet;
  }

  let { tone = 'neutral', class: className, children, ...rest }: Props = $props();
</script>

<span {...rest} class={['cc-badge', `cc-badge-${tone}`, className]}>{@render children()}</span>

<style>
  .cc-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem var(--cc-space-2);
    border-radius: var(--cc-badge-radius);
    font-family: var(--cc-badge-font);
    text-transform: var(--cc-badge-case);
    letter-spacing: var(--cc-badge-tracking);
    font-size: var(--cc-font-size-xs);
    font-weight: 500;
    line-height: 1.4;
    white-space: nowrap;
  }
  .cc-badge-neutral {
    background: var(--cc-surface-sunken);
    color: var(--cc-text);
    box-shadow: inset 0 0 0 1px var(--cc-border);
  }
  .cc-badge-accent {
    background: var(--cc-accent-soft);
    color: var(--cc-accent);
  }
  .cc-badge-success {
    background: var(--cc-success-soft);
    color: var(--cc-success);
  }
  .cc-badge-warning {
    background: var(--cc-warning-soft);
    color: var(--cc-warning);
  }
  .cc-badge-danger {
    background: var(--cc-danger-soft);
    color: var(--cc-danger);
  }
</style>
