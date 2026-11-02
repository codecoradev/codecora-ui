<!--
  Application frame for a dashboard: the AppShell sidebar (a drawer and bottom
  bar on narrow screens), a page header with a title and actions, and the page
  in `children`. The app owns this file: replace the navigation, brand and
  footer with its own.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { AppShell, Button, type NavGroup, type NavItem } from '@codecora/ui';
  import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
  import Activity from '@lucide/svelte/icons/activity';
  import Users from '@lucide/svelte/icons/users';
  import Settings from '@lucide/svelte/icons/settings';
  import Plus from '@lucide/svelte/icons/plus';

  interface Props {
    title?: string;
    /** Shown at the top of the sidebar; its first two letters when collapsed. */
    appName?: string;
    nav?: NavGroup[];
    /** Id of the active navigation item. */
    current?: string;
    onselect?: (item: NavItem) => void;
    /** Buttons for the page header; a "New" button when omitted. */
    actions?: Snippet;
    children: Snippet;
  }

  let {
    title = 'Overview',
    appName = 'Workspace',
    nav = [
      {
        label: 'Workspace',
        items: [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/', pinned: true },
          { id: 'activity', label: 'Activity', icon: Activity, href: '/activity', pinned: true },
          { id: 'members', label: 'Members', icon: Users, href: '/members' },
        ],
      },
      {
        label: 'Account',
        items: [{ id: 'settings', label: 'Settings', icon: Settings, href: '/settings' }],
      },
    ],
    current = $bindable('overview'),
    onselect,
    actions,
    children,
  }: Props = $props();

  let collapsed = $state(false);
</script>

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

  {#snippet header()}
    <div class="cc-dashboard-header">
      <h1>{title}</h1>
      <div class="actions">
        {#if actions}
          {@render actions()}
        {:else}
          <Button variant="primary" icon={Plus}>New</Button>
        {/if}
      </div>
    </div>
  {/snippet}

  <div class="cc-dashboard-page">
    {@render children()}
  </div>
</AppShell>

<style>
  .cc-dashboard-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
    inline-size: 100%;
  }
  h1 {
    font-size: var(--cc-font-size-lg);
  }
  .actions {
    display: flex;
    gap: var(--cc-space-2);
  }
  .cc-dashboard-page {
    display: grid;
    gap: var(--cc-space-6);
    padding: var(--cc-space-6);
  }
  @media (width < 48rem) {
    .cc-dashboard-page {
      padding: var(--cc-space-4);
    }
  }
</style>
