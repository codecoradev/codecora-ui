<script lang="ts">
  import { Alert, Badge, Button, EmptyState, Input, Select, Skeleton } from '@codecora/ui';
  import { onMount } from 'svelte';
  import type { MemoryBrowser } from './browser.svelte.js';
  import { formatDate, preview } from './format.js';

  interface Props {
    browser: MemoryBrowser;
    /** Accessible name of the list. */
    label?: string;
    /** Milliseconds to wait after typing before searching. */
    debounce?: number;
  }

  let { browser, label = 'Memories', debounce = 250 }: Props = $props();

  const uid = $props.id();
  const caps = $derived(browser.capabilities);
  const tagItems = $derived([
    { value: '', label: 'All tags' },
    ...browser.tags.map((t) => ({ value: t.name, label: `${t.name} (${t.count})` })),
  ]);
  const roomItems = $derived([
    { value: '', label: 'All rooms' },
    ...browser.rooms.map((r) => ({ value: r.id, label: r.title ?? r.id })),
  ]);
  // The roving tab stop: the selected row, else the first.
  const focusId = $derived(
    browser.items.some((m) => m.id === browser.selectedId)
      ? browser.selectedId
      : (browser.items[0]?.id ?? null),
  );

  // What the search box shows; the browser's query follows it after the debounce.
  // svelte-ignore state_referenced_locally
  let typed = $state(browser.query);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let list = $state<HTMLUListElement>();

  onMount(() => {
    if (browser.items.length === 0 && !browser.loading) void browser.load();
    void browser.loadFilters();
    return () => clearTimeout(timer);
  });

  function search(value: string) {
    typed = value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (browser.query === value) return;
      browser.query = value;
      void browser.load();
    }, debounce);
  }

  function setTag(value: string) {
    if (browser.tag === value) return;
    browser.tag = value;
    void browser.load();
  }

  function setRoom(value: string) {
    if (browser.room === value) return;
    browser.room = value;
    void browser.load();
  }

  function clearFilters() {
    clearTimeout(timer);
    typed = '';
    browser.query = '';
    browser.tag = '';
    browser.room = '';
    void browser.load();
  }

  /** Arrow keys, Home and End move between rows; Tab leaves the list. */
  function onkeydown(event: KeyboardEvent) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key) || !list) return;
    const rows = [...list.querySelectorAll<HTMLButtonElement>('button[data-id]')];
    const at = rows.indexOf(document.activeElement as HTMLButtonElement);
    if (at === -1) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? rows.length - 1
          : Math.max(0, Math.min(rows.length - 1, at + (event.key === 'ArrowDown' ? 1 : -1)));
    rows[next]?.focus();
  }
</script>

{#snippet newMemory()}
  <Button variant="primary" onclick={() => browser.create()}>New memory</Button>
{/snippet}

<section class="cc-memory-list" aria-labelledby="{uid}-title">
  <header>
    <h2 id="{uid}-title" class="title">{label}</h2>
    {#if caps.create}
      <Button variant="secondary" onclick={() => browser.create()}>New memory</Button>
    {/if}
  </header>

  <div class="filters" role="search">
    {#if caps.search}
      <Input
        type="search"
        aria-label="Search memories"
        placeholder="Search memories"
        value={typed}
        oninput={(e) => search(e.currentTarget.value)}
      />
    {/if}
    {#if caps.tags && browser.tags.length > 0}
      <Select label="Filter by tag" items={tagItems} bind:value={() => browser.tag, setTag} />
    {/if}
    {#if caps.rooms && browser.rooms.length > 0}
      <Select label="Filter by room" items={roomItems} bind:value={() => browser.room, setRoom} />
    {/if}
  </div>

  <p class="status" role="status">
    {#if !browser.loading && !browser.error}
      {browser.items.length}{browser.hasMore ? '+' : ''}
      {browser.items.length === 1 ? 'memory' : 'memories'}{browser.filtered ? ' match' : ''}
    {/if}
  </p>

  {#if browser.error}
    <Alert tone="danger" title="Memories did not load">
      {browser.error}
      <div class="retry"><Button onclick={() => browser.load()}>Try again</Button></div>
    </Alert>
  {:else if browser.loading && browser.items.length === 0}
    <ul class="rows" aria-busy="true" aria-label="Loading memories">
      {#each { length: 4 }, i (i)}
        <li class="skeleton">
          <Skeleton height="1em" />
          <Skeleton height="1em" width="60%" />
        </li>
      {/each}
    </ul>
  {:else if browser.items.length === 0}
    {#if browser.filtered}
      <EmptyState title="No memories match" description="Try other words or clear the filters.">
        {#snippet action()}<Button onclick={clearFilters}>Clear filters</Button>{/snippet}
      </EmptyState>
    {:else}
      <EmptyState
        title="No memories yet"
        description={caps.create
          ? 'Memories your agents and you save show up here.'
          : 'Memories your agents save show up here.'}
        action={caps.create ? newMemory : undefined}
      />
    {/if}
  {:else}
    <ul class="rows" bind:this={list} aria-label={label} aria-busy={browser.loading}>
      {#each browser.items as memory (memory.id)}
        <li>
          <button
            type="button"
            class="row"
            data-id={memory.id}
            aria-current={memory.id === browser.selectedId ? 'true' : undefined}
            tabindex={memory.id === focusId ? 0 : -1}
            onclick={() => browser.select(memory.id)}
            {onkeydown}
          >
            <span class="content">{preview(memory.content)}</span>
            <span class="meta">
              {#if memory.pinned}<Badge tone="accent">Pinned</Badge>{/if}
              <span class="type">{memory.memoryType}</span>
              {#each memory.tags.slice(0, 3) as tag (tag)}
                <span class="tag">{tag}</span>
              {/each}
              {#if memory.tags.length > 3}
                <span class="tag">+{memory.tags.length - 3}</span>
              {/if}
              <span class="date">{formatDate(memory.createdAt)}</span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
    {#if browser.hasMore}
      <div class="more">
        <Button loading={browser.loading} loadingLabel="Loading" onclick={() => browser.loadMore()}>
          Load more
        </Button>
      </div>
    {/if}
  {/if}
</section>

<style>
  .cc-memory-list {
    display: grid;
    gap: var(--cc-space-3);
    min-width: 0;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
  }
  .title {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
  }
  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: var(--cc-space-2);
  }
  .filters > :global(:first-child) {
    grid-column: 1 / -1;
  }
  .status {
    margin: 0;
    min-height: 1lh;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .retry {
    margin-top: var(--cc-space-2);
  }
  .rows {
    display: grid;
    gap: var(--cc-space-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .skeleton {
    display: grid;
    gap: var(--cc-space-2);
    padding: var(--cc-control-py) var(--cc-control-px);
  }
  .row {
    display: grid;
    gap: var(--cc-space-1);
    width: 100%;
    min-height: var(--cc-control-h);
    padding: var(--cc-control-py) var(--cc-control-px);
    border: 1px solid transparent;
    border-radius: var(--cc-radius-md);
    background: transparent;
    color: var(--cc-text);
    font: inherit;
    text-align: start;
    cursor: pointer;
    transition:
      background-color var(--cc-duration-fast) var(--cc-ease-out),
      border-color var(--cc-duration-fast) var(--cc-ease-out);
  }
  .row:hover {
    background: var(--cc-surface-hover);
  }
  .row:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .row[aria-current='true'] {
    border-color: var(--cc-accent);
    background: var(--cc-accent-soft);
  }
  .content {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow-wrap: anywhere;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-1) var(--cc-space-2);
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
  }
  .type {
    font-weight: 600;
  }
  .tag {
    font-family: var(--cc-font-mono);
    overflow-wrap: anywhere;
  }
  .date {
    font-variant-numeric: tabular-nums;
  }
  .more {
    display: flex;
    justify-content: center;
  }
</style>
