<!-- DataTable: sortable, selectable, searchable and paged. -->
<script lang="ts">
  import { Trash } from '@codecora/icons/lucide';
  import { Badge, Button, DataTable, Input, toast } from '@codecora/ui';

  interface Key {
    id: string;
    name: string;
    scope: string;
    status: 'Active' | 'Revoked' | 'Expiring';
    calls: number;
  }

  const all: Key[] = [
    { id: '1', name: 'ci-deploy', scope: 'read, write', status: 'Active', calls: 12840 },
    { id: '2', name: 'dashboard', scope: 'read', status: 'Active', calls: 3112 },
    { id: '3', name: 'old-importer', scope: 'read, write', status: 'Revoked', calls: 0 },
    { id: '4', name: 'staging-bot', scope: 'read', status: 'Expiring', calls: 411 },
    { id: '5', name: 'billing-sync', scope: 'read', status: 'Active', calls: 930 },
    { id: '6', name: 'docs-search', scope: 'read', status: 'Active', calls: 5520 },
    { id: '7', name: 'etl-nightly', scope: 'read, write', status: 'Active', calls: 21004 },
    { id: '8', name: 'mobile-app', scope: 'read', status: 'Expiring', calls: 288 },
    { id: '9', name: 'zapier', scope: 'read', status: 'Revoked', calls: 12 },
    { id: '10', name: 'grafana', scope: 'read', status: 'Active', calls: 7340 },
  ];
  const tone = { Active: 'success', Revoked: 'danger', Expiring: 'warning' } as const;

  let query = $state('');
  let selected = $state<string[]>([]);
  let page = $state(1);

  const rows = $derived(
    all.filter((key) => key.name.toLowerCase().includes(query.trim().toLowerCase())),
  );

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'scope', label: 'Scope' },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'calls', label: 'Calls (30 d)', sortable: true, numeric: true },
  ];
</script>

<section aria-labelledby="c-datatable">
  <h2 id="c-datatable">DataTable</h2>
  <DataTable
    label="API keys"
    {columns}
    {rows}
    rowKey={(key) => key.id}
    selectable
    bind:selected
    bind:page
    pageSize={5}
    emptyTitle="No keys match"
    emptyDescription="Try a different name."
  >
    {#snippet toolbar()}
      <Input
        aria-label="Filter keys by name"
        placeholder="Filter by name"
        bind:value={query}
        oninput={() => (page = 1)}
      />
    {/snippet}
    {#snippet bulk({ clear })}
      <Button
        variant="danger"
        icon={Trash}
        onclick={() => {
          toast.error('Keys revoked');
          clear();
        }}
      >
        Revoke
      </Button>
      <Button variant="ghost" onclick={clear}>Clear</Button>
    {/snippet}
    {#snippet cell({ column, value })}
      {#if column.key === 'status'}
        <Badge tone={tone[value as Key['status']]}>{value}</Badge>
      {:else if column.key === 'calls'}
        {(value as number).toLocaleString('en')}
      {:else}
        {value}
      {/if}
    {/snippet}
  </DataTable>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
</style>
