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
  // The time column; on phones it starts the second line, so it aligns left.
  const time =
    'text-muted-foreground text-end text-sm leading-[inherit] tabular-nums max-sm:text-start';
  const views = $derived([
    { value: 'featured', label: `${featuredLabel} ${featuredCount}` },
    { value: 'all', label: `${allLabel} ${tools.length}` },
  ]);
</script>

<div class="mx-auto grid max-w-224 gap-6 p-6 max-md:p-4">
  <Link href={backHref}><ChevronLeft size={16} aria-hidden="true" /> {backLabel}</Link>

  <header class="flex flex-wrap items-start justify-between gap-4">
    <div class="flex min-w-0 gap-4">
      <Avatar {name} size="lg" />
      <div>
        <h1 class="leading-heading m-0 flex flex-wrap items-center gap-2 text-xl">
          {name}
          {#if badge}<Badge tone={badge.tone}>{badge.label}</Badge>{/if}
        </h1>
        <p class="text-muted-foreground mx-0 mt-1 mb-0">{description}</p>
      </div>
    </div>

    <div class="flex">
      <!-- The button and its arrow read as one control: square the joining corners. -->
      <Button class="rounded-e-none" variant="primary" icon={Plus} onclick={onprimary}>
        {primaryLabel}
      </Button>
      {#if moreActions.length > 0}
        <DropdownMenu label="More ways to {primaryLabel.toLowerCase()}" items={moreActions}>
          {#snippet trigger({ props })}
            <button
              type="button"
              class="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-ring min-h-control min-w-control inline-flex cursor-pointer items-center justify-center rounded-e-md border-0 border-s border-s-[color-mix(in_srgb,var(--primary-foreground)_35%,transparent)] focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)]"
              {...props}
            >
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          {/snippet}
        </DropdownMenu>
      {/if}
    </div>
  </header>

  <section aria-labelledby="groups-title">
    <h2 class="leading-heading mx-0 mt-0 mb-3 text-lg" id="groups-title">
      {groupsTitle}
    </h2>
    <div class="border-border bg-card rounded-lg border">
      {#each groups as group (group.label)}
        <div class="border-border not-first:border-t">
          <div class="flex items-center justify-between gap-3 px-4 py-2">
            <h3 class="text-muted-foreground leading-heading m-0 text-sm font-semibold">
              {group.label}
            </h3>
            {#if group.actionLabel}
              <Button variant="ghost" icon={Plus} onclick={group.onaction}>
                {group.actionLabel}
              </Button>
            {/if}
          </div>
          {#if group.rows.length === 0}
            {#if group.empty}
              <p class="text-muted-foreground m-0 px-4 py-3 text-sm leading-[inherit]">
                {group.empty}
              </p>
            {/if}
          {:else}
            <ul class="m-0 list-none p-0">
              {#each group.rows as row (row.id)}
                <!-- One column per cell, so badges, times and menus line up from row to row;
                     on phones the label takes a line and the rest share the next. -->
                <li
                  class="grid grid-cols-[minmax(0,1fr)_5rem_9.5rem_var(--spacing-control)] items-center gap-3 px-4 py-2 max-sm:grid-cols-[auto_minmax(0,1fr)_var(--spacing-control)]"
                >
                  <span class="min-w-0 wrap-anywhere max-sm:col-span-full">{row.label}</span>
                  <span>
                    {#if row.status}<Badge tone={row.status.tone}>{row.status.label}</Badge>{/if}
                  </span>
                  <span class={time}>{row.time ?? ''}</span>
                  <span class="flex justify-end">
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
    <h2 class="leading-heading mx-0 mt-0 mb-3 text-lg" id="tools-title">
      {toolsTitle}
    </h2>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <ToggleGroup label="{toolsTitle} shown" items={views} bind:value={view} />
      <div class="min-w-[min(100%,calc(var(--spacing)*48))] shrink grow-0 basis-72">
        <Input
          type="search"
          placeholder="Search {toolsTitle.toLowerCase()}"
          aria-label="Search {toolsTitle.toLowerCase()}"
          bind:value={query}
        />
      </div>
    </div>

    {#if callout}
      <div class="my-4">
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
      <ul
        class="border-border bg-card mx-0 mt-4 mb-0 list-none rounded-lg border p-0"
        aria-label={toolsTitle}
      >
        {#each visible as tool (tool.id)}
          <li class="border-border flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 not-first:border-t">
            <span class="inline-flex items-center gap-1 font-medium">
              {#if tool.featured}<Zap size={14} aria-hidden="true" />{/if}
              {tool.name}
            </span>
            {#if tool.description}<span class="text-muted-foreground">{tool.description}</span>{/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
