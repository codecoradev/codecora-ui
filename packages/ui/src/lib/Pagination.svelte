<!-- Page links for a long list (bits-ui). `page` is 1-based. -->
<script module lang="ts">
  import { tv } from './internal/variants.js';

  const pageButton = tv({
    base: [
      'min-h-control min-w-control font-inherit text-foreground inline-grid cursor-pointer place-items-center rounded-md border border-transparent bg-transparent px-2 tabular-nums',
      'duration-fast ease-enter transition-[background-color,color,border-color] motion-reduce:transition-none',
      'hover:bg-accent data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground',
      'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus',
      'disabled:cursor-not-allowed disabled:opacity-55',
    ],
  });
</script>

<script lang="ts">
  import { Pagination } from 'bits-ui';
  import { cn, type ClassValue } from './cn.js';
  import Glyph from './internal/Glyph.svelte';

  interface Props {
    count: number;
    perPage?: number;
    page?: number;
    siblingCount?: number;
    /** Names the landmark; translate it with the rest of the page. */
    label?: string;
    class?: ClassValue;
  }

  let {
    count,
    perPage = 10,
    page = $bindable(1),
    siblingCount = 1,
    label = 'Pagination',
    class: className,
  }: Props = $props();
</script>

<Pagination.Root
  {count}
  {perPage}
  {siblingCount}
  bind:page
  data-slot="pagination"
  class={cn('flex flex-wrap items-center gap-1', className)}
  aria-label={label}
>
  {#snippet children({ pages })}
    <Pagination.PrevButton
      data-slot="page"
      data-step
      class={pageButton()}
      aria-label="Previous page"
    >
      <Glyph name="chevron-left" />
    </Pagination.PrevButton>
    {#each pages as item (item.key)}
      {#if item.type === 'ellipsis'}
        <span class="text-muted-foreground min-w-6 text-center" aria-hidden="true">…</span>
      {:else}
        <Pagination.Page
          page={item}
          data-slot="page"
          class={pageButton()}
          aria-label="Page {item.value}"
        >
          {item.value}
        </Pagination.Page>
      {/if}
    {/each}
    <Pagination.NextButton data-slot="page" data-step class={pageButton()} aria-label="Next page">
      <Glyph name="chevron-right" />
    </Pagination.NextButton>
  {/snippet}
</Pagination.Root>
