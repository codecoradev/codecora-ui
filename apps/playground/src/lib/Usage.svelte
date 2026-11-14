<!-- The code behind a Components section, folded until asked for. -->
<script lang="ts">
  import { CodeBlock } from '@codecora/ui';
  import { usage } from './usage.js';

  let { id }: { id: string } = $props();
  let open = $state(false);

  const summary =
    'border-input bg-card focus-visible:outline-ring inline-flex min-h-11 cursor-pointer list-outside list-none items-center gap-2 rounded-md border px-3 text-sm leading-[inherit] font-semibold group-open:mb-3 focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)] [&::-webkit-details-marker]:hidden';
  /* The marker: a chevron drawn by two borders of the ::before box. */
  const marker =
    'before:duration-fast before:ease-enter before:size-2 before:-rotate-45 before:border-r-2 before:border-b-2 before:border-current before:transition-transform group-open:before:rotate-45';
</script>

{#if usage[id]}
  <!-- Sits under its section, inside the section's own bottom spacing. -->
  <details class="group -mt-6 mb-10" bind:open>
    <!-- The marker turns, so open and closed differ in more than colour. -->
    <summary class="{summary} {marker}">{open ? 'Hide the code' : 'Show the code'}</summary>
    <CodeBlock code={usage[id]} language="svelte" />
  </details>
{/if}
