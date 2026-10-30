<!--
  Responsive application frame.
  - Desktop (48rem and up): a sticky, collapsible Sidebar next to the content.
  - Narrow screens: a top bar with a menu button that opens the navigation as
    a Sheet, and a bottom bar with up to 5 icon items.
  The sidebar can use its own theme (a dark sidebar next to light content):
  pass `sidebarTheme`; its tokens are re-derived for that region only.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './internal/Icon.svelte';
  import IconButton from './IconButton.svelte';
  import Sheet from './Sheet.svelte';
  import Sidebar from './Sidebar.svelte';
  import MenuIcon from './internal/MenuIcon.svelte';
  import type { NavGroup, NavItem } from './types.js';

  interface Props {
    nav: NavGroup[];
    current?: string;
    collapsed?: boolean;
    /** Theme name for the sidebar region only. */
    sidebarTheme?: string;
    /** Accessible name of the main navigation. */
    navLabel?: string;
    onselect?: (item: NavItem) => void;
    brand?: Snippet<[{ collapsed: boolean }]>;
    /** Plan, usage or account block at the foot of the sidebar. */
    footer?: Snippet<[{ collapsed: boolean }]>;
    /** Content of the page header bar (title, actions). */
    header?: Snippet;
    children: Snippet;
  }

  let {
    nav,
    current,
    collapsed = $bindable(false),
    sidebarTheme,
    navLabel = 'Main',
    onselect,
    brand,
    footer,
    header,
    children,
  }: Props = $props();

  let drawerOpen = $state(false);

  // Bottom bar: pinned items first, then the rest in order; icons required; at most 5.
  const bottomItems = $derived.by(() => {
    const all = nav.flatMap((group) => group.items).filter((item) => item.icon);
    return [...all.filter((i) => i.pinned), ...all.filter((i) => !i.pinned)].slice(0, 5);
  });

  const uid = $props.id();

  function select(item: NavItem) {
    drawerOpen = false;
    onselect?.(item);
  }
</script>

<div class="cc-shell">
  <a class="skip" href="#{uid}-main">Skip to content</a>

  <aside class="side" data-theme={sidebarTheme}>
    <Sidebar
      groups={nav}
      {current}
      bind:collapsed
      label={navLabel}
      onselect={select}
      {brand}
      {footer}
    />
  </aside>

  <div class="body">
    <div class="topbar">
      <span class="menu">
        <IconButton
          icon={MenuIcon}
          label="Open navigation"
          variant="secondary"
          onclick={() => (drawerOpen = true)}
        />
      </span>
      {#if brand}<span class="mobile-brand">{@render brand({ collapsed: false })}</span>{/if}
      {#if header}<div class="header">{@render header()}</div>{/if}
    </div>

    <main id="{uid}-main" tabindex="-1">{@render children()}</main>
  </div>

  {#if bottomItems.length > 0}
    <nav class="bottom" aria-label="Primary">
      <ul>
        {#each bottomItems as item (item.id)}
          <li>
            {#if item.href !== undefined}
              <a
                href={item.href}
                aria-current={current === item.id ? 'page' : undefined}
                onclick={() => onselect?.(item)}
              >
                <Icon icon={item.icon!} />
                <span>{item.label}</span>
              </a>
            {:else}
              <button
                type="button"
                aria-current={current === item.id ? 'page' : undefined}
                onclick={() => onselect?.(item)}
              >
                <Icon icon={item.icon!} />
                <span>{item.label}</span>
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</div>

<Sheet bind:open={drawerOpen} side="left" title="Navigation" theme={sidebarTheme}>
  <div class="drawer-nav">
    <Sidebar
      groups={nav}
      {current}
      collapsible={false}
      label="{navLabel} (menu)"
      onselect={select}
      {footer}
    />
  </div>
</Sheet>

<style>
  .cc-shell {
    display: grid;
    min-height: 100dvh;
    background: var(--cc-surface);
    color: var(--cc-text);
    font-family: var(--cc-font-sans);
    font-size: var(--cc-font-size-md);
    line-height: var(--cc-leading-normal);
  }
  .skip {
    position: absolute;
    top: var(--cc-space-2);
    left: var(--cc-space-2);
    z-index: 90;
    padding: var(--cc-space-2) var(--cc-space-3);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    transform: translateY(-200%);
  }
  .skip:focus-visible {
    transform: none;
    outline: var(--cc-focus-width) solid var(--cc-focus);
  }
  .side {
    display: none;
  }
  .body {
    min-width: 0;
    padding-bottom: 4.5rem;
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
  .menu {
    display: inline-flex;
  }
  .mobile-brand {
    font-family: var(--cc-font-display);
    font-weight: 600;
  }
  .header {
    flex: 1 1 100%;
    min-width: 0;
  }
  main:focus {
    outline: none;
  }
  .bottom {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 40;
    border-top: 1px solid var(--cc-border);
    background: var(--cc-surface-raised);
  }
  .bottom ul {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .bottom :is(a, button) {
    display: grid;
    justify-items: center;
    gap: 2px;
    width: 100%;
    min-height: 3.5rem;
    padding: var(--cc-space-2) var(--cc-space-1);
    border: 0;
    background: transparent;
    color: var(--cc-text-muted);
    font: inherit;
    font-size: var(--cc-font-size-xs);
    text-decoration: none;
    cursor: pointer;
  }
  .bottom [aria-current='page'] {
    color: var(--cc-accent);
    font-weight: 600;
  }
  .bottom :is(a, button):focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: -2px;
  }
  .drawer-nav :global(.cc-sidebar) {
    width: 100%;
    padding: 0;
    background: transparent;
  }
  @media (min-width: 48rem) {
    .cc-shell {
      grid-template-columns: auto minmax(0, 1fr);
    }
    .side {
      position: sticky;
      top: 0;
      display: block;
      height: 100dvh;
      border-right: 1px solid var(--cc-border);
      background: var(--cc-surface-sunken);
      color: var(--cc-text);
    }
    .body {
      padding-bottom: 0;
    }
    .menu,
    .mobile-brand,
    .bottom {
      display: none;
    }
    .topbar {
      padding-inline: var(--cc-space-8);
    }
    .header {
      flex: 1;
    }
  }
</style>
