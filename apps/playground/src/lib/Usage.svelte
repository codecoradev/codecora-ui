<!-- The code behind a Components section, folded until asked for. -->
<script lang="ts">
  import { CodeBlock } from '@codecora/ui';
  import { usage } from './usage.js';

  let { id }: { id: string } = $props();
</script>

{#if usage[id]}
  <details class="usage">
    <summary>Show the code</summary>
    <CodeBlock code={usage[id]} language="svelte" />
  </details>
{/if}

<style>
  /* Sits under its section, inside the section's own bottom spacing. */
  .usage {
    margin: calc(var(--cc-space-6) * -1) 0 var(--cc-space-10);
  }
  summary {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-2);
    min-height: 2.75rem;
    padding-inline: var(--cc-space-3);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
    cursor: pointer;
  }
  /* The marker turns, so open and closed differ in more than colour. */
  summary::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(-45deg);
    transition: transform var(--cc-duration-fast) var(--cc-ease-out);
  }
  .usage[open] summary::before {
    transform: rotate(45deg);
  }
  .usage[open] summary {
    margin-bottom: var(--cc-space-3);
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary {
    list-style: none;
  }
  summary:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
</style>
