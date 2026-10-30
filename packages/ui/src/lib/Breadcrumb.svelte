<!-- Where the page sits in the site. The last item is the current page and is not a link. -->
<script lang="ts">
  import Glyph from './internal/Glyph.svelte';

  interface Item {
    label: string;
    href?: string;
  }

  interface Props {
    items: Item[];
    /** Names the landmark; translate it with the rest of the page. */
    label?: string;
  }

  let { items, label = 'Breadcrumb' }: Props = $props();
</script>

<nav aria-label={label} class="cc-breadcrumb">
  <ol>
    {#each items as item, i (i)}
      {@const current = i === items.length - 1}
      <li>
        {#if item.href && !current}
          <a href={item.href}>{item.label}</a>
        {:else}
          <span aria-current={current ? 'page' : undefined}>{item.label}</span>
        {/if}
        {#if !current}<Glyph name="chevron-right" />{/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-1);
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--cc-font-size-sm);
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-1);
  }
  li :global(.cc-glyph) {
    width: 1rem;
    height: 1rem;
    color: var(--cc-text-muted);
  }
  a {
    color: var(--cc-text-muted);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  a:hover {
    color: var(--cc-text);
  }
  a:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
    border-radius: var(--cc-radius-sm);
  }
  [aria-current] {
    font-weight: 600;
  }
</style>
