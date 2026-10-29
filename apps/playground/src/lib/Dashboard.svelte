<!--
  Sample admin screen built only from @codecora/ui primitives and plain
  layout CSS: navigation (sidebar, or a Sheet on narrow screens), usage
  summary, chart, keys table with row actions, filters and a revoke flow.
  Generic data; nothing product-specific (D11). AppShell (#7) will replace
  the hand-written frame.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes, type ThemeName } from '@codecora/tokens';
  import Activity from '@lucide/svelte/icons/activity';
  import Funnel from '@lucide/svelte/icons/funnel';
  import KeyRound from '@lucide/svelte/icons/key-round';
  import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
  import Menu from '@lucide/svelte/icons/menu';
  import Plus from '@lucide/svelte/icons/plus';
  import Settings from '@lucide/svelte/icons/settings';
  import Trash from '@lucide/svelte/icons/trash';
  import Users from '@lucide/svelte/icons/users';
  import {
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
  import { createAppearance } from './appearance.svelte.js';

  const appearance = createAppearance();

  const nav = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'API keys', icon: KeyRound },
    { label: 'Activity', icon: Activity },
    { label: 'Members', icon: Users },
    { label: 'Settings', icon: Settings },
  ];
  let current = $state('Overview');
  let navOpen = $state(false);
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

{#snippet navList()}
  <nav aria-label="Main">
    <ul>
      {#each nav as item (item.label)}
        {@const Icon = item.icon}
        <li>
          <button
            type="button"
            class="nav-item"
            aria-current={current === item.label ? 'page' : undefined}
            onclick={() => {
              current = item.label;
              navOpen = false;
            }}
          >
            <Icon />
            {item.label}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
{/snippet}

<div
  class="app"
  data-theme={appearance.theme}
  data-accent={appearance.accentName}
  data-density={appearance.densityName}
>
  <aside class="sidebar">
    <p class="brand">Sample Admin</p>
    {@render navList()}
    <div class="sidebar-foot">
      <Field label="Theme">
        {#snippet children(control)}
          <Select
            {...control}
            items={themeNames.map((name) => ({ value: name, label: themes[name].label }))}
            bind:value={() => appearance.theme, (value) => (appearance.theme = value as ThemeName)}
          />
        {/snippet}
      </Field>
      <a href={resolve('/components')}>Back to the playground</a>
    </div>
  </aside>

  <div class="main">
    <header class="topbar">
      <div class="menu">
        <IconButton
          icon={Menu}
          label="Open navigation"
          variant="secondary"
          onclick={() => (navOpen = true)}
        />
      </div>
      <h1>{current}</h1>
      <div class="actions">
        <Button variant="secondary" icon={Funnel} onclick={() => (filterOpen = true)}
          >Filters</Button
        >
        <Button
          variant="primary"
          icon={Plus}
          onclick={() =>
            toast.show({ title: 'Key creation is a demo', description: 'Nothing is stored.' })}
        >
          Create key
        </Button>
      </div>
    </header>

    <main>
      <section aria-labelledby="usage">
        <h2 id="usage" class="visually-label">Usage summary</h2>
        <dl class="stats">
          {#each stats as stat (stat.label)}
            <div>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
              <dd class="note">{stat.note}</dd>
            </div>
          {/each}
        </dl>
      </section>

      <section aria-labelledby="chart-title" class="panel">
        <div class="panel-head">
          <h2 id="chart-title">Calls per day</h2>
          <p class="muted">Last 14 days, {total.toLocaleString('en')} calls in total</p>
        </div>
        <svg
          class="chart"
          viewBox="0 0 560 160"
          role="img"
          aria-label="Bar chart of daily API calls over 14 days. Lowest {Math.min(
            ...daily,
          )}, highest {peak}."
          preserveAspectRatio="none"
        >
          {#each [0, 1, 2, 3] as i (i)}
            <line x1="0" x2="560" y1={i * 40 + 0.5} y2={i * 40 + 0.5} class="grid" />
          {/each}
          {#each daily as value, i (i)}
            <rect
              x={i * 40 + 8}
              y={160 - (value / peak) * 150}
              width="24"
              height={(value / peak) * 150}
              rx="3"
              class="bar"
            />
          {/each}
        </svg>
      </section>

      <section aria-labelledby="keys-title" class="panel">
        <div class="panel-head">
          <h2 id="keys-title">API keys</h2>
          <div class="search">
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
                      <th scope="col"><span class="visually-label">Actions</span></th>
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
              <ul class="activity">
                {#each activity as item (item.what)}
                  <li>
                    <strong>{item.who}</strong>
                    {item.what} <span class="muted">· {item.when}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          {/snippet}
        </Tabs>
      </section>
    </main>
  </div>
</div>

<Sheet bind:open={navOpen} side="left" title="Navigation">
  {@render navList()}
</Sheet>

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

<style>
  .app {
    display: grid;
    min-height: 100dvh;
    background: var(--cc-surface);
    color: var(--cc-text);
    font-family: var(--cc-font-sans);
    font-size: var(--cc-font-size-md);
    line-height: var(--cc-leading-normal);
  }
  .sidebar {
    display: none;
  }
  .brand {
    margin: 0;
    padding: var(--cc-space-2) var(--cc-space-3);
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
    font-weight: 600;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--cc-space-3);
    width: 100%;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-space-3);
    border: 0;
    border-radius: var(--cc-radius-md);
    background: transparent;
    color: var(--cc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .nav-item :global(svg) {
    width: var(--cc-icon-size);
    height: var(--cc-icon-size);
    stroke-width: var(--cc-icon-stroke);
    color: var(--cc-text-muted);
  }
  .nav-item:hover {
    background: var(--cc-surface-hover);
  }
  .nav-item[aria-current='page'] {
    background: var(--cc-accent-soft);
    color: var(--cc-accent);
    font-weight: 600;
  }
  .nav-item[aria-current='page'] :global(svg) {
    color: inherit;
  }
  .nav-item:focus-visible {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
  }
  .sidebar-foot {
    display: grid;
    gap: var(--cc-space-3);
    margin-top: auto;
    font-size: var(--cc-font-size-sm);
  }
  a {
    color: var(--cc-accent);
    text-underline-offset: 0.2em;
  }
  a:focus-visible {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
  }

  .main {
    min-width: 0;
  }
  .topbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-3);
    padding: var(--cc-space-3) var(--cc-space-4);
    border-bottom: 1px solid var(--cc-border);
    background: var(--cc-surface-raised);
  }
  h1 {
    margin: 0;
    flex: 1;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-xl);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  main {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-6);
    max-width: 72rem;
    padding: var(--cc-space-5) var(--cc-space-4) var(--cc-space-12);
  }
  h2 {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
  }
  .visually-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .muted {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }

  /* One bordered strip divided by rules, not a grid of identical cards. */
  .stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
  }
  .stats > div {
    display: grid;
    gap: var(--cc-space-1);
    padding: var(--cc-space-4);
    border-bottom: 1px solid var(--cc-border);
  }
  .stats > div:nth-child(odd) {
    border-right: 1px solid var(--cc-border);
  }
  .stats > div:nth-last-child(-n + 2) {
    border-bottom: 0;
  }
  dt {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  dd {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-2xl);
    font-variant-numeric: tabular-nums;
  }
  dd.note {
    color: var(--cc-text-muted);
    font-family: var(--cc-font-sans);
    font-size: var(--cc-font-size-sm);
  }

  .panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    min-width: 0;
  }
  .panel-head {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: var(--cc-space-3);
  }
  .search {
    width: min(18rem, 100%);
  }
  .chart {
    width: 100%;
    height: 10rem;
    padding: var(--cc-space-3);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
  }
  .grid {
    stroke: var(--cc-border);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  .bar {
    fill: var(--cc-accent);
  }
  .activity {
    display: grid;
    gap: var(--cc-space-3);
  }

  @media (min-width: 48rem) {
    .app {
      grid-template-columns: 15rem minmax(0, 1fr);
    }
    .sidebar {
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      gap: var(--cc-space-4);
      height: 100dvh;
      padding: var(--cc-space-4);
      border-right: 1px solid var(--cc-border);
      background: var(--cc-surface-sunken);
    }
    .menu {
      display: none;
    }
    .topbar {
      padding-inline: var(--cc-space-8);
    }
    main {
      padding-inline: var(--cc-space-8);
    }
    .stats {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .stats > div,
    .stats > div:nth-child(odd),
    .stats > div:nth-last-child(-n + 2) {
      border-right: 1px solid var(--cc-border);
      border-bottom: 0;
    }
    .stats > div:last-child {
      border-right: 0;
    }
  }
  @media (max-width: 47.99rem) {
    .actions :global(.cc-button) {
      padding-inline: var(--cc-space-3);
    }
  }
</style>
