<!--
  Data table page section: search, status filter, sortable columns, row
  selection with a bulk action, and paging, on the @codecora/ui DataTable.
  The app owns this file: replace `Row`, the columns and the sample rows with
  its own data.
-->
<script lang="ts" module>
  export interface Row {
    id: string;
    name: string;
    owner: string;
    status: 'Active' | 'Paused' | 'Failed';
    updated: string;
  }
</script>

<script lang="ts">
  import { Badge, Button, DataTable, Input, Select } from '@codecora/ui';
  import Trash from '@lucide/svelte/icons/trash';

  interface Props {
    title?: string;
    rows?: Row[];
    pageSize?: number;
    ondelete?: (ids: string[]) => void;
  }

  let {
    title = 'Projects',
    rows = [
      { id: '1', name: 'billing-api', owner: 'Ada', status: 'Active', updated: '2026-10-30' },
      { id: '2', name: 'web-app', owner: 'Grace', status: 'Active', updated: '2026-10-29' },
      { id: '3', name: 'importer', owner: 'Linus', status: 'Failed', updated: '2026-10-27' },
      { id: '4', name: 'search-index', owner: 'Ada', status: 'Paused', updated: '2026-10-21' },
      { id: '5', name: 'mobile', owner: 'Ken', status: 'Active', updated: '2026-10-18' },
      { id: '6', name: 'docs-site', owner: 'Grace', status: 'Active', updated: '2026-10-12' },
      { id: '7', name: 'etl-nightly', owner: 'Linus', status: 'Paused', updated: '2026-10-02' },
    ],
    pageSize = 5,
    ondelete,
  }: Props = $props();

  let query = $state('');
  let status = $state('all');
  let selected = $state<string[]>([]);
  let page = $state(1);

  const visible = $derived(
    rows.filter(
      (row) =>
        row.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        (status === 'all' || row.status === status),
    ),
  );
  // A new filter starts on page 1 and keeps only the selected rows still shown,
  // so the bulk action never touches rows the user cannot see.
  function filtered() {
    page = 1;
    const shown = new Set(visible.map((row) => row.id));
    selected = selected.filter((id) => shown.has(id));
  }

  const tone = { Active: 'success', Paused: 'warning', Failed: 'danger' } as const;
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'updated', label: 'Updated', sortable: true },
  ];
</script>

<section class="cc-data-table" aria-label={title}>
  <h2>{title}</h2>
  <DataTable
    label={title}
    {columns}
    rows={visible}
    rowKey={(row) => row.id}
    selectable
    bind:selected
    bind:page
    {pageSize}
    emptyTitle="Nothing matches"
    emptyDescription="Try another name or status."
  >
    {#snippet toolbar()}
      <div class="filters">
        <Input
          type="search"
          aria-label="Filter by name"
          placeholder="Filter by name"
          bind:value={
            () => query,
            (next) => {
              query = String(next ?? '');
              filtered();
            }
          }
        />
        <Select
          label="Status"
          items={[
            { value: 'all', label: 'All statuses' },
            { value: 'Active', label: 'Active' },
            { value: 'Paused', label: 'Paused' },
            { value: 'Failed', label: 'Failed' },
          ]}
          bind:value={
            () => status,
            (next) => {
              status = next;
              filtered();
            }
          }
        />
      </div>
    {/snippet}
    {#snippet bulk({ selected, clear })}
      <Button
        variant="danger"
        icon={Trash}
        onclick={() => {
          ondelete?.(selected);
          clear();
        }}
      >
        Delete
      </Button>
      <Button variant="ghost" onclick={clear}>Clear</Button>
    {/snippet}
    {#snippet cell({ column, value })}
      {#if column.key === 'status'}
        <Badge tone={tone[value as Row['status']]}>{value}</Badge>
      {:else}
        {value}
      {/if}
    {/snippet}
  </DataTable>
</section>

<style>
  .cc-data-table {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
  }
  h2 {
    font-size: var(--cc-font-size-lg);
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
</style>
