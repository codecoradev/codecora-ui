<!--
  A table with sortable columns, row selection, a bulk-action bar, paging and
  loading and empty states. Sorting and paging run on the rows you pass; for
  server-side data, pass one page of rows and handle `sort` and `page` yourself.

    <DataTable label="API keys" {columns} {rows} rowKey={(k) => k.id} selectable bind:selected />
-->
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import Checkbox from './Checkbox.svelte';
  import EmptyState from './EmptyState.svelte';
  import Glyph from './internal/Glyph.svelte';
  import Pagination from './Pagination.svelte';
  import Skeleton from './Skeleton.svelte';
  import Table from './Table.svelte';
  import VisuallyHidden from './VisuallyHidden.svelte';

  interface Column<R> {
    key: string;
    label: string;
    /** Value to show and sort by; defaults to `row[key]`. */
    value?: (row: R) => string | number | Date | null | undefined;
    sortable?: boolean;
    /** Right-aligned monospace figures. */
    numeric?: boolean;
  }

  interface Sort {
    key: string;
    direction: 'asc' | 'desc';
  }

  interface Props {
    label: string;
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    sort?: Sort | null;
    selectable?: boolean;
    selected?: string[];
    /** Rows per page; omit to show every row. */
    pageSize?: number;
    page?: number;
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    /** Custom cell content. */
    cell?: Snippet<[{ row: T; column: Column<T>; value: unknown }]>;
    /** Shown above the table, for a search field or filters. */
    toolbar?: Snippet;
    /** Replaces the toolbar while rows are selected. */
    bulk?: Snippet<[{ selected: string[]; clear: () => void }]>;
  }

  let {
    label,
    columns,
    rows,
    rowKey,
    sort = $bindable(null),
    selectable = false,
    selected = $bindable([]),
    pageSize,
    page = $bindable(1),
    loading = false,
    emptyTitle = 'Nothing here yet',
    emptyDescription,
    cell,
    toolbar,
    bulk,
  }: Props = $props();

  const read = (row: T, column: Column<T>): unknown =>
    column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];

  const sorted = $derived.by(() => {
    const active = sort && columns.find((column) => column.key === sort!.key);
    if (!sort || !active) return rows;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = read(a, active);
      const y = read(b, active);
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
      if (x instanceof Date && y instanceof Date) return (x.getTime() - y.getTime()) * factor;
      return String(x).localeCompare(String(y), undefined, { numeric: true }) * factor;
    });
  });

  // A filter that shrinks the rows must not leave the table on a page that no longer exists.
  const lastPage = $derived(pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1);
  // Not while loading: server-side tables pass no rows until the page arrives.
  $effect(() => {
    if (!loading && page > lastPage) page = lastPage;
  });

  // The bulk bar and its actions only see rows that are still in the table. `selected`
  // itself is left alone, so a selection kept across server-side pages survives.
  const present = $derived(new Set(rows.map(rowKey)));
  const active = $derived(selected.filter((key) => present.has(key)));
  // Row lookups run once per row, so they use a Set instead of scanning the array each time.
  const chosen = $derived(new Set(selected));

  const visible = $derived(
    pageSize ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted,
  );
  const visibleKeys = $derived(visible.map(rowKey));
  const selectedHere = $derived(visibleKeys.filter((key) => chosen.has(key)));
  const allHere = $derived(visibleKeys.length > 0 && selectedHere.length === visibleKeys.length);
  const someHere = $derived(selectedHere.length > 0 && !allHere);
  const span = $derived(columns.length + (selectable ? 1 : 0));

  function toggleSort(column: Column<T>) {
    if (sort?.key !== column.key) sort = { key: column.key, direction: 'asc' };
    else if (sort.direction === 'asc') sort = { key: column.key, direction: 'desc' };
    else sort = null;
    page = 1;
  }

  function toggleAll(on: boolean) {
    const others = selected.filter((key) => !visibleKeys.includes(key));
    selected = on ? [...others, ...visibleKeys] : others;
  }

  function toggleRow(key: string, on: boolean) {
    selected = on ? [...selected, key] : selected.filter((k) => k !== key);
  }

  const ariaSort = (column: Column<T>) =>
    sort?.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined;
</script>

<div class="cc-datatable">
  <VisuallyHidden><span role="status">{loading ? `Loading ${label}` : ''}</span></VisuallyHidden>
  {#if active.length > 0 && bulk}
    <div class="bar" role="status">
      <span>{active.length} selected</span>
      {@render bulk({ selected: active, clear: () => (selected = []) })}
    </div>
  {:else if toolbar}
    <div class="bar">{@render toolbar()}</div>
  {/if}

  <Table {label}>
    <thead>
      <tr>
        {#if selectable}
          <th scope="col" class="check">
            <Checkbox
              label="Select all rows on this page"
              labelHidden
              checked={allHere}
              indeterminate={someHere}
              disabled={loading || visible.length === 0}
              onchange={toggleAll}
            />
          </th>
        {/if}
        {#each columns as column (column.key)}
          <th scope="col" class:num={column.numeric} aria-sort={ariaSort(column)}>
            {#if column.sortable}
              <button type="button" class="sort" onclick={() => toggleSort(column)}>
                {column.label}
                <span class="arrow" class:on={sort?.key === column.key} data-dir={sort?.direction}>
                  <Glyph name="chevron-down" />
                </span>
              </button>
            {:else}
              {column.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody aria-busy={loading || undefined}>
      {#if loading}
        {#each [0, 1, 2, 3] as n (n)}
          <tr aria-hidden="true">
            {#each Array.from({ length: span }, (_unused, i) => i) as i (i)}
              <td><Skeleton height="1rem" width={i === 0 ? '60%' : '80%'} /></td>
            {/each}
          </tr>
        {/each}
      {:else if visible.length === 0}
        <tr>
          <td colspan={span}>
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </td>
        </tr>
      {:else}
        {#each visible as row (rowKey(row))}
          {@const key = rowKey(row)}
          <tr data-selected={chosen.has(key) ? 'true' : undefined}>
            {#if selectable}
              <td class="check">
                <Checkbox
                  label="Select row"
                  labelHidden
                  checked={chosen.has(key)}
                  onchange={(on) => toggleRow(key, on)}
                />
              </td>
            {/if}
            {#each columns as column, i (column.key)}
              {@const value = read(row, column)}
              {#if i === 0}
                <th scope="row" class:num={column.numeric}>
                  {#if cell}{@render cell({ row, column, value })}{:else}{value ?? ''}{/if}
                </th>
              {:else}
                <td class:num={column.numeric}>
                  {#if cell}{@render cell({ row, column, value })}{:else}{value ?? ''}{/if}
                </td>
              {/if}
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </Table>

  {#if pageSize && sorted.length > pageSize}
    <div class="pager">
      <Pagination count={sorted.length} perPage={pageSize} bind:page />
    </div>
  {/if}
</div>

<style>
  .cc-datatable {
    display: grid;
    gap: var(--cc-space-3);
  }
  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-3);
    min-height: var(--cc-control-h);
  }
  .check {
    width: 1%;
  }
  .sort {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-1);
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .sort:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
    border-radius: var(--cc-radius-sm);
  }
  .arrow {
    display: inline-flex;
    opacity: 0.35;
  }
  .arrow.on {
    opacity: 1;
  }
  .arrow[data-dir='asc'] {
    transform: rotate(180deg);
  }
  .pager {
    display: flex;
    justify-content: flex-end;
  }
</style>
