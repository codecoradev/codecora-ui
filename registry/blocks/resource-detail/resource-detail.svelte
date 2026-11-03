<!--
  Detail page of one resource: a back link, a header with name, badge and
  description and a split primary button (the action plus a menu of more), a
  list of connections grouped into sections with a status and a menu on every
  row, and a tool list with a segmented switch, a search field and a callout.
  The app owns this file: replace the names, groups and tools with its own.
-->
<script lang="ts">
  import {
    Alert,
    Avatar,
    Badge,
    Button,
    DropdownMenu,
    EmptyState,
    IconButton,
    Input,
    Link,
    ToggleGroup,
    type IconComponent,
    type Tone,
  } from '@codecora/ui';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  import Plus from '@lucide/svelte/icons/plus';
  import Search from '@lucide/svelte/icons/search';
  import Zap from '@lucide/svelte/icons/zap';

  interface MenuItem {
    label: string;
    onselect: () => void;
    icon?: IconComponent;
    danger?: boolean;
    separatorBefore?: boolean;
  }

  interface Row {
    id: string;
    label: string;
    status?: { label: string; tone?: Tone };
    /** Already formatted, for example "4 minutes ago". */
    time?: string;
    menu?: MenuItem[];
  }

  interface Group {
    label: string;
    /** Text of the group's own button, for example "Connect"; hidden when omitted. */
    actionLabel?: string;
    onaction?: () => void;
    rows: Row[];
    /** Shown when the group has no rows. */
    empty?: string;
  }

  interface Tool {
    id: string;
    name: string;
    description?: string;
    /** In the first view of the switch; every tool is in the second. */
    featured?: boolean;
  }

  interface Props {
    name?: string;
    description?: string;
    badge?: { label: string; tone?: Tone };
    backLabel?: string;
    backHref?: string;
    /** The main action, the left half of the split button. */
    primaryLabel?: string;
    onprimary?: () => void;
    /** The menu behind the split button's arrow. */
    moreActions?: MenuItem[];
    groupsTitle?: string;
    groups?: Group[];
    toolsTitle?: string;
    tools?: Tool[];
    /** Labels of the segmented switch; the counts are added. */
    featuredLabel?: string;
    allLabel?: string;
    /** The callout under the search field; omit to hide it. */
    callout?: { title: string; text: string };
  }

  let {
    name = 'Storage',
    description = 'Create buckets and move files between projects, with every change logged.',
    badge = { label: 'Instant', tone: 'accent' },
    backLabel = 'Integrations',
    backHref = '/integrations',
    primaryLabel = 'Connect new',
    onprimary,
    moreActions = [
      { label: 'Connect with an API key', onselect: () => {} },
      { label: 'Connect with OAuth', onselect: () => {} },
    ],
    groupsTitle = 'Connections',
    groups = [
      {
        label: 'Yours',
        actionLabel: 'Connect',
        onaction: () => {},
        rows: [
          {
            id: 'ada',
            label: 'ada@example.com',
            status: { label: 'In use', tone: 'success' },
            time: 'a few seconds ago',
            menu: [
              { label: 'Rename', onselect: () => {} },
              { label: 'Disconnect', onselect: () => {}, danger: true, separatorBefore: true },
            ],
          },
          {
            id: 'grace',
            label: 'grace@example.com',
            status: { label: 'In use', tone: 'success' },
            time: '4 minutes ago',
            menu: [
              { label: 'Rename', onselect: () => {} },
              { label: 'Disconnect', onselect: () => {}, danger: true, separatorBefore: true },
            ],
          },
        ],
      },
      {
        label: 'Team',
        actionLabel: 'Share',
        onaction: () => {},
        rows: [],
        empty: 'Shared connections appear here once someone shares one.',
      },
    ],
    toolsTitle = 'Tools',
    tools = [
      { id: 'list', name: 'List files', description: 'Files in a bucket', featured: true },
      { id: 'get', name: 'Get file', description: 'One file and its metadata', featured: true },
      { id: 'upload', name: 'Upload file', description: 'Add a file to a bucket', featured: true },
      { id: 'move', name: 'Move file', description: 'Between buckets' },
      { id: 'delete', name: 'Delete file', description: 'Remove a file for good' },
      { id: 'share', name: 'Create share link', description: 'A link that expires' },
    ],
    featuredLabel = 'Instant',
    allLabel = 'All tools',
    callout = {
      title: 'Want to use instant tools instead?',
      text: 'Your agent uses your connected account for these tools. Remove it under Connections to switch.',
    },
  }: Props = $props();

  let view = $state('featured');
  let query = $state('');

  const featuredCount = $derived(tools.filter((tool) => tool.featured).length);
  const visible = $derived(
    tools.filter(
      (tool) =>
        (view === 'all' || tool.featured) &&
        `${tool.name} ${tool.description ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );
  const views = $derived([
    { value: 'featured', label: `${featuredLabel} ${featuredCount}` },
    { value: 'all', label: `${allLabel} ${tools.length}` },
  ]);
</script>

<div class="page">
  <Link href={backHref}><ChevronLeft size={16} aria-hidden="true" /> {backLabel}</Link>

  <header class="head">
    <div class="who">
      <Avatar {name} size="lg" />
      <div>
        <h1>
          {name}
          {#if badge}<Badge tone={badge.tone}>{badge.label}</Badge>{/if}
        </h1>
        <p class="muted">{description}</p>
      </div>
    </div>

    <div class="split">
      <Button variant="primary" icon={Plus} onclick={onprimary}>{primaryLabel}</Button>
      {#if moreActions.length > 0}
        <DropdownMenu label="More ways to {primaryLabel.toLowerCase()}" items={moreActions}>
          {#snippet trigger({ props })}
            <button type="button" class="more" {...props}>
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          {/snippet}
        </DropdownMenu>
      {/if}
    </div>
  </header>

  <section aria-labelledby="groups-title">
    <h2 id="groups-title">{groupsTitle}</h2>
    <div class="box">
      {#each groups as group (group.label)}
        <div class="group">
          <div class="group-head">
            <h3>{group.label}</h3>
            {#if group.actionLabel}
              <Button variant="ghost" icon={Plus} onclick={group.onaction}>
                {group.actionLabel}
              </Button>
            {/if}
          </div>
          {#if group.rows.length === 0}
            {#if group.empty}<p class="muted pad">{group.empty}</p>{/if}
          {:else}
            <ul>
              {#each group.rows as row (row.id)}
                <li>
                  <span class="label">{row.label}</span>
                  <span class="status">
                    {#if row.status}<Badge tone={row.status.tone}>{row.status.label}</Badge>{/if}
                  </span>
                  <span class="time">{row.time ?? ''}</span>
                  <span class="menu">
                    {#if row.menu && row.menu.length > 0}
                      <DropdownMenu label="Actions for {row.label}" items={row.menu}>
                        {#snippet trigger({ props })}
                          <IconButton icon={Ellipsis} label="Actions for {row.label}" {...props} />
                        {/snippet}
                      </DropdownMenu>
                    {/if}
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <section aria-labelledby="tools-title">
    <h2 id="tools-title">{toolsTitle}</h2>
    <div class="toolbar">
      <ToggleGroup label="{toolsTitle} shown" items={views} bind:value={view} />
      <div class="search">
        <Input
          type="search"
          placeholder="Search {toolsTitle.toLowerCase()}"
          aria-label="Search {toolsTitle.toLowerCase()}"
          bind:value={query}
        />
      </div>
    </div>

    {#if callout}
      <div class="callout">
        <Alert tone="neutral" title={callout.title}>{callout.text}</Alert>
      </div>
    {/if}

    {#if visible.length === 0}
      <EmptyState
        icon={Search}
        level={3}
        title="No tools match"
        description="Try other words, or switch to {allLabel.toLowerCase()}."
      />
    {:else}
      <ul class="tools" aria-label={toolsTitle}>
        {#each visible as tool (tool.id)}
          <li>
            <span class="tool-name">
              {#if tool.featured}<Zap size={14} aria-hidden="true" />{/if}
              {tool.name}
            </span>
            {#if tool.description}<span class="muted">{tool.description}</span>{/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>

<style>
  .page {
    display: grid;
    gap: var(--cc-space-6);
    max-inline-size: 56rem;
    margin-inline: auto;
    padding: var(--cc-space-6);
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--cc-space-4);
  }
  .who {
    display: flex;
    gap: var(--cc-space-4);
    min-inline-size: 0;
  }
  h1 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-2);
    margin: 0;
    font-size: var(--cc-font-size-xl);
  }
  h2 {
    margin: 0 0 var(--cc-space-3);
    font-size: var(--cc-font-size-lg);
  }
  h3 {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
  }
  .muted {
    margin: var(--cc-space-1) 0 0;
    color: var(--cc-text-muted);
  }
  .pad {
    margin: 0;
    padding: var(--cc-space-3) var(--cc-space-4);
    font-size: var(--cc-font-size-sm);
  }
  .split {
    display: flex;
  }
  .split :global(.cc-button) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }
  .more {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-block-size: var(--cc-control-h);
    min-inline-size: var(--cc-control-h);
    border: 0;
    border-inline-start: 1px solid color-mix(in srgb, var(--cc-accent-text) 35%, transparent);
    border-start-end-radius: var(--cc-radius-md);
    border-end-end-radius: var(--cc-radius-md);
    background: var(--cc-accent);
    color: var(--cc-accent-text);
    cursor: pointer;
  }
  .more:hover {
    background: var(--cc-accent-hover);
  }
  .more:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .box {
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
  }
  .group + .group {
    border-block-start: 1px solid var(--cc-border);
  }
  .group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
    padding: var(--cc-space-2) var(--cc-space-4);
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  /* One column per cell, so badges, times and menus line up from row to row. */
  .group li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 5rem 9.5rem var(--cc-control-h);
    align-items: center;
    gap: var(--cc-space-3);
    padding: var(--cc-space-2) var(--cc-space-4);
  }
  .label {
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }
  .time {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-variant-numeric: tabular-nums;
    text-align: end;
  }
  .menu {
    display: flex;
    justify-content: flex-end;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
  }
  .search {
    flex: 0 1 18rem;
    min-inline-size: min(100%, 12rem);
  }
  .callout {
    margin-block: var(--cc-space-4);
  }
  .tools {
    margin-block-start: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
  }
  .tools li {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-1) var(--cc-space-4);
    padding: var(--cc-space-3) var(--cc-space-4);
  }
  .tools li + li {
    border-block-start: 1px solid var(--cc-border);
  }
  .tools .muted {
    margin: 0;
  }
  .tool-name {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-1);
    font-weight: 500;
  }
  @media (width < 40rem) {
    /* The label takes a line; status, time and menu share the next one. */
    .group li {
      grid-template-columns: auto minmax(0, 1fr) var(--cc-control-h);
    }
    .label {
      grid-column: 1 / -1;
    }
    .time {
      text-align: start;
    }
  }
  @media (width < 48rem) {
    .page {
      padding: var(--cc-space-4);
    }
  }
</style>
