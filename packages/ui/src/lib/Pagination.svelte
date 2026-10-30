<!-- Page links for a long list (bits-ui). `page` is 1-based. -->
<script lang="ts">
  import { Pagination } from 'bits-ui';
  import Glyph from './internal/Glyph.svelte';

  interface Props {
    count: number;
    perPage?: number;
    page?: number;
    siblingCount?: number;
    /** Names the landmark; translate it with the rest of the page. */
    label?: string;
  }

  let {
    count,
    perPage = 10,
    page = $bindable(1),
    siblingCount = 1,
    label = 'Pagination',
  }: Props = $props();
</script>

<Pagination.Root
  {count}
  {perPage}
  {siblingCount}
  bind:page
  class="cc-pagination"
  aria-label={label}
>
  {#snippet children({ pages })}
    <Pagination.PrevButton class="cc-page cc-page-step" aria-label="Previous page">
      <Glyph name="chevron-left" />
    </Pagination.PrevButton>
    {#each pages as item (item.key)}
      {#if item.type === 'ellipsis'}
        <span class="gap" aria-hidden="true">…</span>
      {:else}
        <Pagination.Page page={item} class="cc-page" aria-label="Page {item.value}">
          {item.value}
        </Pagination.Page>
      {/if}
    {/each}
    <Pagination.NextButton class="cc-page cc-page-step" aria-label="Next page">
      <Glyph name="chevron-right" />
    </Pagination.NextButton>
  {/snippet}
</Pagination.Root>

<style>
  :global(.cc-pagination) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-1);
  }
  :global(.cc-page) {
    display: inline-grid;
    place-items: center;
    min-width: var(--cc-control-h);
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-space-2);
    border: 1px solid transparent;
    border-radius: var(--cc-radius-md);
    background: none;
    color: var(--cc-text);
    font: inherit;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }
  :global(.cc-page:hover) {
    background: var(--cc-surface-hover);
  }
  :global(.cc-page[data-selected]) {
    border-color: var(--cc-accent);
    background: var(--cc-accent);
    color: var(--cc-accent-text);
  }
  :global(.cc-page:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  :global(.cc-page:disabled) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .gap {
    min-width: 1.5rem;
    text-align: center;
    color: var(--cc-text-muted);
  }
</style>
