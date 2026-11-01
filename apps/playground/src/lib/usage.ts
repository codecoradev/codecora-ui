// A copyable starting point per Components section, written against the real props.

export const usage: Record<string, string> = {
  'c-buttons': `<script>
  import { Button, IconButton, Tooltip } from '@codecora/ui';
  import { Copy, Plus } from '@codecora/icons/lucide';
</script>

<Button variant="primary" icon={Plus}>Create key</Button>
<Button variant="danger" loading={saving} loadingLabel="Revoking">Revoke</Button>
<Tooltip content="Copy key">
  {#snippet trigger({ props })}
    <IconButton {...props} icon={Copy} label="Copy key" />
  {/snippet}
</Tooltip>`,
  'c-forms': `<script>
  import { Field, Input, Select } from '@codecora/ui';
  let name = $state('');
</script>

<Field label="Key name" description="Shown in the audit log." error={error} required>
  {#snippet children(control)}
    <Input {...control} bind:value={name} />
  {/snippet}
</Field>
<Field label="Region">
  {#snippet children(control)}
    <Select {...control} items={regions} bind:value={region} />
  {/snippet}
</Field>`,
  'c-choice': `<script>
  import { Checkbox, RadioGroup, Switch } from '@codecora/ui';
</script>

<Checkbox label="All keys" bind:checked={all} bind:indeterminate={mixed} />
<Switch label="Email alerts" description="At most one a day." bind:checked={alerts} />
<RadioGroup label="Digest" items={digests} bind:value={digest} />`,
  'c-inputs': `<script>
  import { Combobox, Field, Slider } from '@codecora/ui';
</script>

<Field label="Region">
  {#snippet children(control)}
    <Combobox {...control} items={regions} bind:value={region} />
  {/snippet}
</Field>
<Slider label="Retention" bind:value={days} min={7} max={90} showValue
  format={(v) => \`\${v} days\`} />`,
  'c-overlays': `<script>
  import { ConfirmDialog, Toaster, toast } from '@codecora/ui';
  let open = $state(false);
</script>

<ConfirmDialog
  bind:open
  title="Revoke ci-deploy?"
  description="Anything using this key stops working immediately."
  confirmLabel="Revoke key"
  confirmText="ci-deploy"
  tone="danger"
  onconfirm={() => toast.success('Key revoked')}
/>
<Toaster />`,
  'c-nav': `<script>
  import { Breadcrumb, Pagination, ToggleGroup } from '@codecora/ui';
</script>

<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'ci-deploy' }]} />
<ToggleGroup label="View" bind:value={view}
  items={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />
<Pagination count={240} perPage={10} bind:page />`,
  'c-tabs': `<script>
  import { Tabs } from '@codecora/ui';
</script>

<Tabs label="Key views" items={[{ value: 'keys', label: 'Keys' }, { value: 'usage', label: 'Usage' }]}>
  {#snippet panel(value)}
    {value === 'keys' ? 'Keys table' : 'Usage chart'}
  {/snippet}
</Tabs>`,
  'c-datatable': `<script>
  import { DataTable } from '@codecora/ui';
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'calls', label: 'Calls (30 d)', sortable: true, numeric: true },
  ];
</script>

<DataTable label="API keys" {columns} {rows} rowKey={(row) => row.id}
  selectable bind:selected bind:page pageSize={5} />`,
  'c-display': `<script>
  import { Alert, Avatar, Progress } from '@codecora/ui';
</script>

<Alert tone="warning" title="Quota">80% of the monthly limit is used.</Alert>
<Progress label="Memories" value={12480} max={50000} showValue />
<Avatar name="Ada Lovelace" />`,
  'c-status': `<script>
  import { Badge, Button, EmptyState } from '@codecora/ui';
  import { Inbox } from '@codecora/icons/lucide';
</script>

<Badge tone="success">Active</Badge>
<EmptyState icon={Inbox} title="No keys yet" description="Create an API key to connect a tool.">
  {#snippet action()}<Button variant="primary">Create key</Button>{/snippet}
</EmptyState>`,
};
