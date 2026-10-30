<!-- A raised surface that groups related content, with optional header and footer. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { header, footer, class: className, children, ...rest }: Props = $props();
</script>

<section {...rest} class={['cc-card', className]}>
  {#if header}<header>{@render header()}</header>{/if}
  <div class="body">{@render children()}</div>
  {#if footer}<footer>{@render footer()}</footer>{/if}
</section>

<style>
  .cc-card {
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
  }
  header,
  .body,
  footer {
    padding: var(--cc-space-4);
  }
  header {
    border-bottom: 1px solid var(--cc-border);
    font-family: var(--cc-font-display);
    font-weight: 600;
  }
  footer {
    border-top: 1px solid var(--cc-border);
    background: var(--cc-surface-sunken);
    border-radius: 0 0 var(--cc-radius-lg) var(--cc-radius-lg);
  }
</style>
