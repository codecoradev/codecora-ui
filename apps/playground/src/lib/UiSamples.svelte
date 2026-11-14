<!--
  Four whole screens composed only from @codecora/ui. Each sits in a framed
  region so the surfaces read as separate pages.
-->
<script lang="ts">
  import { Ellipsis, Inbox, Pencil, Plus, Trash } from '@codecora/icons/lucide';
  import {
    Alert,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    CodeBlock,
    DataTable,
    DropdownMenu,
    IconButton,
    EmptyState,
    Field,
    FieldGroup,
    Input,
    Link,
    Progress,
    RadioGroup,
    Select,
    Separator,
    Slider,
    Switch,
    toast,
    Toaster,
  } from '@codecora/ui';

  // Sign in
  let email = $state('');
  let password = $state('');
  let remember = $state(true);
  let attempted = $state(false);
  const emailError = $derived(
    attempted && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter an address like name@example.com.' : '',
  );
  const passwordError = $derived(
    attempted && password.length < 8 ? 'Use at least 8 characters.' : '',
  );

  // Settings
  let digest = $state('weekly');
  let alerts = $state(true);
  let retention = $state(30);
  let region = $state('eu');
  const regions = [
    { value: 'eu', label: 'Europe (Frankfurt)' },
    { value: 'us', label: 'United States (Virginia)' },
    { value: 'ap', label: 'Asia Pacific (Singapore)' },
  ];

  // List and detail
  const memories = [
    {
      id: 'm1',
      title: 'Chose uteke-serve over a custom API',
      type: 'decision',
      tags: ['project:corin'],
      body: 'The desktop app talks to uteke-serve on localhost so the CLI, MCP server and app share one store.',
    },
    {
      id: 'm2',
      title: 'Embedding model downloads on first use',
      type: 'gotcha',
      tags: ['project:uteke'],
      body: 'A fresh UTEKE_HOME fetches the model (about 40 s). Tests need a long timeout on a cold start.',
    },
    {
      id: 'm3',
      title: 'Release v0.1.0 ships as tarballs',
      type: 'fact',
      tags: ['project:codecora-ui'],
      body: 'Packages install from GitHub Release tarballs until the npm scope is claimed.',
    },
  ];
  let current = $state('m1');
  const open = $derived(memories.find((m) => m.id === current)!);

  // Data table
  interface Key {
    id: string;
    name: string;
    owner: string;
    status: 'Active' | 'Revoked' | 'Expiring';
    calls: number;
  }
  const keys: Key[] = [
    { id: 'k1', name: 'ci-deploy', owner: 'Ada', status: 'Active', calls: 12840 },
    { id: 'k2', name: 'dashboard', owner: 'Grace', status: 'Active', calls: 3112 },
    { id: 'k3', name: 'old-importer', owner: 'Linus', status: 'Revoked', calls: 0 },
    { id: 'k4', name: 'staging-bot', owner: 'Ada', status: 'Expiring', calls: 411 },
    { id: 'k5', name: 'billing-sync', owner: 'Grace', status: 'Active', calls: 930 },
    { id: 'k6', name: 'docs-search', owner: 'Margaret', status: 'Active', calls: 5520 },
  ];
  const statusTone = { Active: 'success', Revoked: 'danger', Expiring: 'warning' } as const;
  let selectedKeys = $state<string[]>([]);
  let keyPage = $state(1);
  let keyQuery = $state('');
  const keyRows = $derived(
    keys.filter((k) =>
      `${k.name} ${k.owner}`.toLowerCase().includes(keyQuery.trim().toLowerCase()),
    ),
  );

  // First run
  const steps = [
    { label: 'Create an API key', done: true },
    { label: 'Connect your editor', done: true },
    { label: 'Save your first memory', done: false },
    { label: 'Invite a teammate', done: false },
  ];
  const progress = steps.filter((s) => s.done).length;

  const h2 = 'text-[length:var(--cc-font-size-xl)] font-bold';
  /* A flat band, not a bordered box, so the Cards inside it are the only cards. */
  const frame = 'bg-muted px-4 py-6';
  const split =
    'grid grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*64),1fr))] items-start gap-4';

  const sourceUrl =
    'https://github.com/codecoradev/codecora-ui/blob/develop/apps/playground/src/lib/UiSamples.svelte';
</script>

<p class="text-muted-foreground mb-6">
  Every screen below is built from <code>@codecora/ui</code> components and tokens only.
  <Link href={sourceUrl} external>Read the source on GitHub</Link>
</p>

<section class="grid grid-cols-1 gap-3 pb-10" aria-labelledby="s-login">
  <h2 id="s-login" class={h2}>Sign in</h2>
  <div class="{frame} grid place-items-center">
    <Card class="w-[min(100%,calc(var(--spacing)*96))]">
      {#snippet header()}Sign in to your workspace{/snippet}
      <form
        class="grid gap-4"
        novalidate
        onsubmit={(event) => {
          event.preventDefault();
          attempted = true;
          if (!emailError && !passwordError && email && password) toast.success('Signed in');
        }}
      >
        {#if attempted && (emailError || passwordError)}
          <Alert tone="danger" title="Check the form">Fix the highlighted fields to continue.</Alert
          >
        {/if}
        <Field label="Email" error={emailError} required>
          {#snippet children(control)}
            <Input {...control} type="email" bind:value={email} autocomplete="email" />
          {/snippet}
        </Field>
        <Field label="Password" error={passwordError} required>
          {#snippet children(control)}
            <Input
              {...control}
              type="password"
              bind:value={password}
              autocomplete="current-password"
            />
          {/snippet}
        </Field>
        <Checkbox label="Keep me signed in" bind:checked={remember} />
        <Button variant="primary" type="submit">Sign in</Button>
        <p class="text-muted-foreground text-center text-[length:var(--cc-font-size-sm)]">
          New here? <Link href="#s-login">Create an account</Link>
        </p>
      </form>
    </Card>
  </div>
</section>

<section class="grid grid-cols-1 gap-3 pb-10" aria-labelledby="s-settings">
  <h2 id="s-settings" class={h2}>Settings</h2>
  <div class={frame}>
    <div class="grid max-w-160 gap-4">
      <Breadcrumb
        label="Settings breadcrumb"
        items={[{ label: 'Workspace', href: '#s-settings' }, { label: 'Settings' }]}
      />
      <Card>
        {#snippet header()}Memory{/snippet}
        <div class="grid gap-4">
          <Field label="Region" description="Where your memories are stored.">
            {#snippet children(control)}<Select
                {...control}
                items={regions}
                bind:value={region}
              />{/snippet}
          </Field>
          <Slider
            label="Keep deleted memories for"
            bind:value={retention}
            min={7}
            max={90}
            showValue
            format={(v) => `${v} days`}
          />
        </div>
      </Card>
      <Card>
        {#snippet header()}Notifications{/snippet}
        <div class="grid gap-4">
          <Switch label="Email alerts" description="At most one a day." bind:checked={alerts} />
          <Separator />
          <FieldGroup legend="Digest" description="A summary of new memories.">
            {#snippet children(group)}
              <RadioGroup
                label="Digest"
                bind:value={digest}
                items={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'never', label: 'Never' },
                ]}
                {...group}
              />
            {/snippet}
          </FieldGroup>
        </div>
        {#snippet footer()}
          <Button variant="primary" onclick={() => toast.success('Settings saved')}
            >Save changes</Button
          >
        {/snippet}
      </Card>
    </div>
  </div>
</section>

<section class="grid grid-cols-1 gap-3 pb-10" aria-labelledby="s-list">
  <h2 id="s-list" class={h2}>List and detail</h2>
  <div class="{frame} {split}">
    <ul class="grid gap-1" aria-label="Memories">
      {#each memories as memory (memory.id)}
        <li>
          <button
            type="button"
            class="min-h-control border-border bg-card text-foreground font-inherit hover:bg-accent aria-[current=true]:border-primary focus-visible:outline-ring flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-left focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)] aria-[current=true]:[box-shadow:inset_var(--cc-row-marker)_0_0_var(--cc-accent)]"
            aria-current={memory.id === current ? 'true' : undefined}
            onclick={() => (current = memory.id)}
          >
            <span class="font-medium">{memory.title}</span>
            <Badge
              tone={memory.type === 'decision'
                ? 'accent'
                : memory.type === 'gotcha'
                  ? 'warning'
                  : 'neutral'}>{memory.type}</Badge
            >
          </button>
        </li>
      {/each}
    </ul>
    <div class="grid gap-4">
      <Card>
        {#snippet header()}{open.title}{/snippet}
        <div class="grid gap-4">
          <p>{open.body}</p>
          <div class="flex flex-wrap gap-2">
            {#each open.tags as tag (tag)}<Badge>{tag}</Badge>{/each}
          </div>
        </div>
        {#snippet footer()}
          <Button>Edit</Button>
          <Button variant="danger">Forget</Button>
        {/snippet}
      </Card>
      <CodeBlock language="bash" code={`uteke get ${open.id}`} />
    </div>
  </div>
</section>

<section class="grid grid-cols-1 gap-3 pb-10" aria-labelledby="s-keys">
  <h2 id="s-keys" class={h2}>Data table</h2>
  <div class={frame}>
    <div class="grid gap-4">
      <Breadcrumb
        label="Keys breadcrumb"
        items={[{ label: 'Workspace', href: '#s-keys' }, { label: 'API keys' }]}
      />
      <DataTable
        label="API keys"
        rowKey={(k: Key) => k.id}
        rows={keyRows}
        selectable
        bind:selected={selectedKeys}
        bind:page={keyPage}
        pageSize={4}
        emptyTitle="No keys match"
        emptyDescription="Try a different name or owner."
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'owner', label: 'Owner', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
          { key: 'calls', label: 'Calls (30 d)', sortable: true, numeric: true },
          { key: 'actions', label: 'Actions', value: () => '' },
        ]}
      >
        {#snippet toolbar()}
          <Input
            aria-label="Filter keys by name or owner"
            placeholder="Filter by name or owner"
            bind:value={keyQuery}
            oninput={() => (keyPage = 1)}
          />
          <Button variant="primary" icon={Plus}>Create key</Button>
        {/snippet}
        {#snippet bulk({ clear })}
          <Button
            variant="danger"
            icon={Trash}
            onclick={() => {
              toast.error('Keys revoked');
              clear();
            }}>Revoke</Button
          >
          <Button variant="ghost" onclick={clear}>Clear</Button>
        {/snippet}
        {#snippet cell({ row, column, value })}
          {#if column.key === 'status'}
            <Badge tone={statusTone[(row as Key).status]}>{value}</Badge>
          {:else if column.key === 'calls'}
            {(value as number).toLocaleString('en')}
          {:else if column.key === 'actions'}
            <DropdownMenu
              label="Actions for {(row as Key).name}"
              items={[
                {
                  label: 'Rename',
                  icon: Pencil,
                  onselect: () => toast.show({ title: 'Rename chosen' }),
                },
                {
                  label: 'Revoke',
                  icon: Trash,
                  danger: true,
                  separatorBefore: true,
                  onselect: () => toast.error('Key revoked'),
                },
              ]}
            >
              {#snippet trigger({ props })}
                <IconButton {...props} icon={Ellipsis} label="Actions for {(row as Key).name}" />
              {/snippet}
            </DropdownMenu>
          {:else}
            {value}
          {/if}
        {/snippet}
      </DataTable>
    </div>
  </div>
</section>

<section class="grid grid-cols-1 gap-3 pb-10" aria-labelledby="s-first">
  <h2 id="s-first" class={h2}>First run</h2>
  <div class="{frame} {split}">
    <Card>
      {#snippet header()}Get started{/snippet}
      <div class="grid gap-4">
        <Progress label="Setup" value={progress} max={steps.length} showValue />
        <ol class="grid">
          {#each steps as step (step.label)}
            <li class:done={step.done}>
              <Checkbox label={step.label} checked={step.done} disabled />
            </li>
          {/each}
        </ol>
      </div>
    </Card>
    <div class="border-input rounded-lg border border-dashed">
      <EmptyState
        icon={Inbox}
        title="No memories yet"
        description="Save one from your editor or the command line and it shows up here."
      >
        {#snippet action()}<Button variant="primary" icon={Plus}>Save a memory</Button>{/snippet}
      </EmptyState>
    </div>
  </div>
</section>

<Toaster />
