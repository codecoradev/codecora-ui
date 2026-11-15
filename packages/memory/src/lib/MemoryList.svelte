<script lang="ts">
  import {
    Alert,
    Badge,
    Button,
    cn,
    EmptyState,
    Input,
    Select,
    Skeleton,
    type ClassValue,
  } from '@codecora/ui';
  import { onMount } from 'svelte';
  import type { MemoryBrowser } from './browser.svelte.js';
  import { formatDate, preview } from './format.js';

  interface Props {
    browser: MemoryBrowser;
    /** Accessible name of the list. */
    label?: string;
    /** Milliseconds to wait after typing before searching. */
    debounce?: number;
    class?: ClassValue;
  }

  let { browser, label = 'Memories', debounce = 250, class: className }: Props = $props();

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

<section class={cn('cc-memory-list grid min-w-0 gap-3', className)} aria-labelledby="{uid}-title">
  <header class="flex items-center justify-between gap-3">
    <h2 id="{uid}-title" class="font-display leading-heading m-0 text-lg font-bold">
      {label}
    </h2>
    {#if caps.create}
      <Button variant="secondary" onclick={() => browser.create()}>New memory</Button>
    {/if}
  </header>

  <!-- The search box takes the whole first row; the filters share the next. -->
  <div
    class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*48)),1fr))] gap-2 [&>:first-child]:col-span-full"
    role="search"
  >
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

  <p class="text-muted-foreground m-0 min-h-lh text-sm leading-[inherit]" role="status">
    {#if !browser.loading && !browser.error}
      {browser.items.length}{browser.hasMore ? '+' : ''}
      {browser.items.length === 1 ? 'memory' : 'memories'}{browser.filtered ? ' match' : ''}
    {/if}
  </p>

  {#if browser.error}
    <Alert tone="danger" title="Memories did not load">
      {browser.error}
      <div class="mt-2"><Button onclick={() => browser.load()}>Try again</Button></div>
    </Alert>
  {:else if browser.loading && browser.items.length === 0}
    <ul class="m-0 grid list-none gap-1 p-0" aria-busy="true" aria-label="Loading memories">
      {#each { length: 4 }, i (i)}
        <li class="px-control-x py-control-y grid gap-2">
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
    <ul
      class="m-0 grid list-none gap-1 p-0"
      bind:this={list}
      aria-label={label}
      aria-busy={browser.loading}
    >
      {#each browser.items as memory (memory.id)}
        <li>
          <button
            type="button"
            class="min-h-control px-control-x py-control-y font-inherit text-foreground duration-fast ease-enter hover:bg-accent focus-visible:outline-ring aria-[current=true]:border-primary aria-[current=true]:bg-primary-soft focus-visible:outline-focus focus-visible:outline-offset-focus grid w-full cursor-pointer gap-1 rounded-md border border-transparent bg-transparent text-start transition-[background-color,border-color]"
            data-id={memory.id}
            aria-current={memory.id === browser.selectedId ? 'true' : undefined}
            tabindex={memory.id === focusId ? 0 : -1}
            onclick={() => browser.select(memory.id)}
            {onkeydown}
          >
            <span class="line-clamp-2 wrap-anywhere">{preview(memory.content)}</span>
            <span
              class="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-[inherit]"
            >
              {#if memory.pinned}<Badge tone="accent">Pinned</Badge>{/if}
              <span class="font-semibold">{memory.memoryType}</span>
              {#each memory.tags.slice(0, 3) as tag (tag)}
                <span class="font-mono wrap-anywhere">{tag}</span>
              {/each}
              {#if memory.tags.length > 3}
                <span class="font-mono wrap-anywhere">+{memory.tags.length - 3}</span>
              {/if}
              <span class="tabular-nums">{formatDate(memory.createdAt)}</span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
    {#if browser.hasMore}
      <div class="flex justify-center">
        <Button loading={browser.loading} loadingLabel="Loading" onclick={() => browser.loadMore()}>
          Load more
        </Button>
      </div>
    {/if}
  {/if}
</section>
