<!--
  Sample admin screen built only from @codecora/ui primitives and plain
  layout CSS: the AppShell (sidebar, or a drawer and bottom bar on narrow
  screens, with an optional per-region sidebar theme), usage
  summary, chart, keys table with row actions, filters and a revoke flow.
  Generic data; nothing product-specific (D11).
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes } from '@codecora/tokens';
  import {
    Activity,
    Funnel,
    KeyRound,
    LayoutDashboard,
    Plus,
    Settings,
    Trash,
    Users,
  } from '@codecora/icons/lucide';
  import {
    AppShell,
    Badge,
    Button,
    ConfirmDialog,
    EmptyState,
    Field,
    IconButton,
    Input,
    Select,
    Sheet,
    Table,
    Tabs,
    Toaster,
    Tooltip,
    toast,
  } from '@codecora/ui';
  import AppearanceControls from './AppearanceControls.svelte';
  import { createAppearance } from './appearance.svelte.js';

  const appearance = createAppearance();

  const nav = [
    {
      label: 'Workspace',
      items: [
        { id: 'Overview', label: 'Overview', icon: LayoutDashboard, pinned: true },
        { id: 'API keys', label: 'API keys', icon: KeyRound, badge: 5, pinned: true },
        { id: 'Activity', label: 'Activity', icon: Activity },
        { id: 'Members', label: 'Members', icon: Users },
      ],
    },
    { label: 'Account', items: [{ id: 'Settings', label: 'Settings', icon: Settings }] },
  ];
  let current = $state('Overview');
  let collapsed = $state(false);
  let sidebarTheme = $state('same');
  let filterOpen = $state(false);
  let revoking = $state<Key | null>(null);
  let revokeOpen = $state(false);

  interface Key {
    id: string;
    name: string;
    scope: string;
    status: 'Active' | 'Expiring' | 'Revoked';
    calls: number;
    used: string;
  }

  let keys = $state<Key[]>([
    {
      id: 'k1',
      name: 'ci-deploy',
      scope: 'read, write',
      status: 'Active',
      calls: 12840,
      used: '2 min ago',
    },
    { id: 'k2', name: 'dashboard', scope: 'read', status: 'Active', calls: 3112, used: '1 h ago' },
    {
      id: 'k3',
      name: 'staging-bot',
      scope: 'read',
      status: 'Expiring',
      calls: 411,
      used: 'yesterday',
    },
    {
      id: 'k4',
      name: 'old-importer',
      scope: 'read, write',
      status: 'Revoked',
      calls: 0,
      used: '3 weeks ago',
    },
    {
      id: 'k5',
      name: 'analytics-export',
      scope: 'read',
      status: 'Active',
      calls: 1890,
      used: '5 h ago',
    },
  ]);

  let query = $state('');
  let status = $state('all');
  const visible = $derived(
    keys.filter(
      (k) =>
        k.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        (status === 'all' || k.status.toLowerCase() === status),
    ),
  );
  const tone = { Active: 'success', Expiring: 'warning', Revoked: 'danger' } as const;

  // Calls per day for the last 14 days; the chart and its text summary share it.
  const daily = [420, 510, 480, 620, 700, 380, 340, 690, 760, 810, 770, 900, 640, 880];
  // Fixed dates, so screenshots stay the same from day to day.
  const days = daily.map((_, i) =>
    new Date(Date.UTC(2026, 9, 19 + i)).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }),
  );
  const peak = Math.max(...daily);
  const total = daily.reduce((a, b) => a + b, 0);

  const stats = $derived([
    { label: 'Calls this month', value: '18,253', note: '+12% on last month' },
    {
      label: 'Active keys',
      value: String(keys.filter((k) => k.status === 'Active').length),
      note: '1 expires soon',
    },
    { label: 'Members', value: '8', note: '2 invited' },
    { label: 'Error rate', value: '0.4%', note: 'within the 1% target' },
  ]);

  const h2 = 'font-display text-[length:var(--cc-font-size-lg)] font-bold';
  const muted = 'text-muted-foreground text-[length:var(--cc-font-size-sm)]';
  const panelSection = 'grid min-w-0 grid-cols-1 gap-4';
  const panelHead = 'flex flex-wrap items-end justify-between gap-3';

  const activity = [
    { who: 'Ada', what: 'created key analytics-export', when: '5 h ago' },
    { who: 'Grace', what: 'changed the scope of dashboard', when: 'yesterday' },
    { who: 'Ada', what: 'revoked old-importer', when: '3 weeks ago' },
  ];

  function askRevoke(key: Key) {
    revoking = key;
    revokeOpen = true;
  }
  function revoke() {
    if (!revoking) return;
    const target = revoking;
    keys = keys.map((k) => (k.id === target.id ? { ...k, status: 'Revoked' } : k));
    toast.success(`${target.name} revoked`, 'Anything using it stops working now.');
  }
</script>

<div
  class="themed"
  data-theme={appearance.restored ? appearance.theme : undefined}
  data-accent={appearance.restored ? appearance.accentName : undefined}
  data-density={appearance.restored ? appearance.densityName : undefined}
>
  <AppShell
    {nav}
    {current}
    bind:collapsed
    sidebarTheme={sidebarTheme === 'same' ? undefined : sidebarTheme}
    onselect={(item) => (current = item.id)}
  >
    {#snippet brand({ collapsed })}
      {collapsed ? 'SA' : 'Sample Admin'}
    {/snippet}

    {#snippet footer({ collapsed })}
      {#if !collapsed}
        <!-- minmax(0, 1fr): long trigger values truncate instead of widening the sidebar. -->
        <div class="mt-auto grid grid-cols-1 gap-3 text-[length:var(--cc-font-size-sm)]">
          <!-- The same popovers as the playground toolbar. -->
          <div
            class="flex flex-wrap gap-2 *:max-w-full *:min-w-0"
            role="group"
            aria-label="Appearance"
          >
            <AppearanceControls {appearance} compact />
          </div>
          <Field label="Sidebar">
            {#snippet children(control)}
              <Select
                {...control}
                items={[
                  { value: 'same', label: 'Same as page' },
                  ...themeNames.map((name) => ({
                    value: name,
                    label: `${themes[name].label} only`,
                  })),
                ]}
                bind:value={sidebarTheme}
              />
            {/snippet}
          </Field>
          <a
            class="text-primary underline-offset-text focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2"
            href={resolve('/components')}>Back to the playground</a
          >
        </div>
      {/if}
    {/snippet}

    {#snippet header()}
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="font-display text-[length:var(--cc-font-size-2xl)] font-bold">{current}</h1>
        <div class="flex flex-wrap gap-2 max-[47.99rem]:[&_.cc-button]:px-3">
          <Button variant="secondary" icon={Funnel} onclick={() => (filterOpen = true)}>
            Filters
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onclick={() =>
              toast.show({ title: 'Key creation is a demo', description: 'Nothing is stored.' })}
          >
            Create key
          </Button>
        </div>
      </div>
    {/snippet}

    <div class="grid max-w-6xl grid-cols-1 gap-6 px-4 pt-5 pb-12 md:px-8">
      <section aria-labelledby="usage">
        <h2 id="usage" class="sr-only">Usage summary</h2>
        <!-- One bordered strip divided by rules, not a grid of identical cards. -->
        <dl class="border-border bg-card grid grid-cols-2 rounded-md border md:grid-cols-4">
          {#each stats as stat (stat.label)}
            <div
              class="border-border grid gap-1 border-b p-4 odd:border-r nth-last-[-n+2]:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
            >
              <dt class={muted}>{stat.label}</dt>
              <dd class="font-display text-[length:var(--cc-font-size-2xl)] tabular-nums">
                {stat.value}
              </dd>
              <dd class="{muted} font-sans tabular-nums">{stat.note}</dd>
            </div>
          {/each}
        </dl>
      </section>

      <section aria-labelledby="chart-title" class={panelSection}>
        <div class={panelHead}>
          <h2 id="chart-title" class={h2}>Calls per day</h2>
          <p class={muted}>Last 14 days, {total.toLocaleString('en')} calls in total</p>
        </div>
        <div class="border-border bg-card grid gap-2 rounded-md border p-3">
          <svg
            viewBox="0 0 560 160"
            role="img"
            aria-label="Bar chart of daily API calls from {days[0]} to {days[
              days.length - 1
            ]}. Lowest {Math.min(...daily)}, highest {peak}."
            preserveAspectRatio="none"
            class="h-40 w-full"
          >
            {#each [0, 1, 2, 3] as i (i)}
              <line
                x1="0"
                x2="560"
                y1={i * 40 + 0.5}
                y2={i * 40 + 0.5}
                class="stroke-border"
                stroke-width="1"
                vector-effect="non-scaling-stroke"
              />
            {/each}
            {#each daily as value, i (i)}
              <rect
                x={i * 40 + 8}
                y={160 - (value / peak) * 150}
                width="24"
                height={(value / peak) * 150}
                rx="3"
                class="fill-primary"
              >
                <title>{days[i]}: {value.toLocaleString('en')} calls</title>
              </rect>
            {/each}
          </svg>
          <!-- One label per bar, in the same 14 columns as the bars; every other one on phones. -->
          <ol
            class="text-muted-foreground grid grid-cols-14 text-center text-[length:var(--cc-font-size-xs)] whitespace-nowrap tabular-nums"
            aria-hidden="true"
          >
            {#each days as day (day)}
              <li class="max-[47.99rem]:even:invisible">{day}</li>
            {/each}
          </ol>
        </div>
      </section>

      <section aria-labelledby="keys-title" class={panelSection}>
        <div class={panelHead}>
          <h2 id="keys-title" class={h2}>API keys</h2>
          <div class="w-[min(var(--container-2xs),100%)]">
            <Field label="Search keys">
              {#snippet children(control)}
                <Input
                  {...control}
                  type="search"
                  bind:value={query}
                  placeholder="Filter by name"
                  autocomplete="off"
                />
              {/snippet}
            </Field>
          </div>
        </div>

        <Tabs
          label="Key views"
          items={[
            { value: 'keys', label: `Keys (${visible.length})` },
            { value: 'activity', label: 'Activity' },
          ]}
        >
          {#snippet panel(value)}
            {#if value === 'keys'}
              {#if visible.length === 0}
                <EmptyState
                  title="No keys match"
                  description="Try another name or clear the status filter."
                  level={3}
                >
                  {#snippet action()}
                    <Button
                      variant="secondary"
                      onclick={() => {
                        query = '';
                        status = 'all';
                      }}
                    >
                      Clear filters
                    </Button>
                  {/snippet}
                </EmptyState>
              {:else}
                <Table label="API keys">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Scope</th>
                      <th scope="col">Status</th>
                      <th scope="col" class="num">Calls (30 d)</th>
                      <th scope="col">Last used</th>
                      <th scope="col"><span class="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each visible as key (key.id)}
                      <tr>
                        <th scope="row">{key.name}</th>
                        <td>{key.scope}</td>
                        <td><Badge tone={tone[key.status]}>{key.status}</Badge></td>
                        <td class="num">{key.calls.toLocaleString('en')}</td>
                        <td>{key.used}</td>
                        <td>
                          <Tooltip
                            content={key.status === 'Revoked'
                              ? 'Already revoked'
                              : `Revoke ${key.name}`}
                          >
                            {#snippet trigger({ props })}
                              <IconButton
                                {...props}
                                icon={Trash}
                                label={`Revoke ${key.name}`}
                                variant="danger"
                                disabled={key.status === 'Revoked'}
                                onclick={() => askRevoke(key)}
                              />
                            {/snippet}
                          </Tooltip>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </Table>
              {/if}
            {:else}
              <ul class="grid gap-3">
                {#each activity as item (item.what)}
                  <li>
                    <strong>{item.who}</strong>
                    {item.what} <span class={muted}>· {item.when}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          {/snippet}
        </Tabs>
      </section>
    </div>
  </AppShell>
</div>

<Sheet bind:open={filterOpen} title="Filters" description="Narrow the key list.">
  <Field label="Status">
    {#snippet children(control)}
      <Select
        {...control}
        bind:value={status}
        items={[
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
          { value: 'expiring', label: 'Expiring' },
          { value: 'revoked', label: 'Revoked' },
        ]}
      />
    {/snippet}
  </Field>
  {#snippet footer()}
    <Button variant="secondary" onclick={() => (status = 'all')}>Reset</Button>
    <Button variant="primary" onclick={() => (filterOpen = false)}>Apply</Button>
  {/snippet}
</Sheet>

<ConfirmDialog
  bind:open={revokeOpen}
  title={`Revoke ${revoking?.name ?? 'key'}?`}
  description="Anything using this key stops working immediately. This cannot be undone."
  confirmLabel="Revoke key"
  tone="danger"
  onconfirm={revoke}
/>

<Toaster />
