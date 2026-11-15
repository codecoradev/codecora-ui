<!--
  Frame of a developer console: the AppShell sidebar with a user menu in its
  footer, a header with a breadcrumb, a search button and actions, a title row,
  tabs, and the page body of the selected tab in `panel`. Without `panel` it
  shows an intro card and a collapsible section, so the page is not empty. The
  app owns this file: replace the navigation, tabs and copy with its own.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    Accordion,
    AppShell,
    Avatar,
    Breadcrumb,
    Button,
    Card,
    DropdownMenu,
    Kbd,
    Tabs,
    type IconComponent,
    type NavGroup,
    type NavItem,
  } from '@codecora/ui';
  import House from '@lucide/svelte/icons/house';
  import Folder from '@lucide/svelte/icons/folder';
  import Package from '@lucide/svelte/icons/package';
  import Code from '@lucide/svelte/icons/code';
  import KeyRound from '@lucide/svelte/icons/key-round';
  import Webhook from '@lucide/svelte/icons/webhook';
  import Search from '@lucide/svelte/icons/search';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import LogOut from '@lucide/svelte/icons/log-out';
  import User from '@lucide/svelte/icons/user';

  interface Props {
    /** Shown at the top of the sidebar; its first two letters when collapsed. */
    appName?: string;
    nav?: NavGroup[];
    /** Id of the active navigation item. */
    current?: string;
    onselect?: (item: NavItem) => void;
    /** The trail in the header; the last item is the page you are on. */
    crumbs?: { label: string; href?: string }[];
    title?: string;
    /** Tabs under the title; the selected value is `tab`. */
    tabs?: { value: string; label: string }[];
    tab?: string;
    /** Body of the selected tab. */
    panel?: Snippet<[string]>;
    /** Called by the header's search button: open your command palette here. */
    onsearch?: () => void;
    /** Buttons at the right of the header. */
    headerActions?: Snippet;
    /** Buttons at the right of the title. */
    actions?: Snippet;
    /** The signed-in person, shown in the sidebar footer. */
    user?: { name: string; detail?: string };
    /** Entries of the user menu. */
    userMenu?: {
      label: string;
      onselect: () => void;
      icon?: IconComponent;
      danger?: boolean;
      separatorBefore?: boolean;
    }[];
  }

  let {
    appName = 'Console',
    nav = [
      {
        label: 'Workspace',
        items: [
          { id: 'home', label: 'Home', icon: House, href: '/', pinned: true },
          { id: 'projects', label: 'Projects', icon: Folder, href: '/projects', pinned: true },
          { id: 'assets', label: 'Assets', icon: Package, href: '/assets' },
        ],
      },
      {
        label: 'Developers',
        items: [
          { id: 'developers', label: 'Overview', icon: Code, href: '/developers', pinned: true },
          { id: 'keys', label: 'API keys', icon: KeyRound, href: '/developers/keys' },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook, href: '/developers/webhooks' },
        ],
      },
    ],
    current = $bindable('developers'),
    onselect,
    crumbs = [{ label: 'Developers', href: '/developers' }, { label: 'Overview' }],
    title = 'Developers',
    tabs = [
      { value: 'overview', label: 'Overview' },
      { value: 'keys', label: 'API keys' },
      { value: 'webhooks', label: 'Webhooks' },
      { value: 'logs', label: 'Request log' },
    ],
    tab = $bindable('overview'),
    panel,
    onsearch,
    headerActions,
    actions,
    user = { name: 'Ada Lovelace', detail: 'ada@example.com' },
    userMenu = [
      { label: 'Profile', onselect: () => {}, icon: User },
      { label: 'Sign out', onselect: () => {}, icon: LogOut, danger: true, separatorBefore: true },
    ],
  }: Props = $props();

  let collapsed = $state(false);
  let section = $state('first');
</script>

{#snippet firstRequest()}
  <p class="text-muted-foreground mx-0 mt-1 mb-0">
    Your first request shows up here once your app sends one.
  </p>
{/snippet}

{#snippet tabPanel(value: string)}
  {#if panel}
    {@render panel(value)}
  {:else if value === 'overview'}
    <div class="grid gap-4">
      <Card>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="m-0 text-[length:var(--cc-font-size-md)]">Build with the API</h2>
            <p class="text-muted-foreground mx-0 mt-1 mb-0">
              Add this to your product, keeping full control of your data, tools and logic.
            </p>
          </div>
          <Button icon={BookOpen}>Read the docs</Button>
        </div>
      </Card>
      <Accordion
        items={[{ value: 'first', label: 'First request' }]}
        type="single"
        level={2}
        bind:value={section}
        panel={firstRequest}
      />
    </div>
  {:else}
    <p class="text-muted-foreground mx-0 mt-1 mb-0">Nothing here yet.</p>
  {/if}
{/snippet}

<AppShell
  {nav}
  {current}
  bind:collapsed
  onselect={(item) => {
    current = item.id;
    onselect?.(item);
  }}
>
  {#snippet brand({ collapsed })}
    {collapsed ? appName.slice(0, 2).toUpperCase() : appName}
  {/snippet}

  {#snippet footer({ collapsed })}
    <DropdownMenu label="Account menu" side="top" items={userMenu}>
      {#snippet trigger({ props })}
        <button
          type="button"
          class="text-foreground font-inherit hover:bg-accent focus-visible:outline-ring min-h-control flex w-full cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent px-2 py-1 text-start focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)]"
          {...props}
        >
          <Avatar name={user.name} size="sm" />
          {#if !collapsed}
            <span class="grid min-w-0">
              <span class="truncate">{user.name}</span>
              {#if user.detail}
                <span class="text-muted-foreground truncate text-[length:var(--cc-font-size-sm)]">
                  {user.detail}
                </span>
              {/if}
            </span>
          {/if}
        </button>
      {/snippet}
    </DropdownMenu>
  {/snippet}

  {#snippet header()}
    <div class="flex w-full flex-wrap items-center justify-between gap-3">
      <Breadcrumb items={crumbs} />
      <div class="flex flex-wrap gap-2">
        <Button variant="secondary" icon={Search} onclick={onsearch}>
          Search
          <span class="ms-2 inline-flex max-md:hidden" aria-hidden="true"><Kbd>⌘K</Kbd></span>
        </Button>
        {@render headerActions?.()}
      </div>
    </div>
  {/snippet}

  <div class="grid gap-4 p-6 max-md:p-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-[length:var(--cc-font-size-xl)]">{title}</h1>
      <div class="flex flex-wrap gap-2">{@render actions?.()}</div>
    </div>
    <Tabs label="{title} sections" items={tabs} bind:value={tab} panel={tabPanel} />
  </div>
</AppShell>
