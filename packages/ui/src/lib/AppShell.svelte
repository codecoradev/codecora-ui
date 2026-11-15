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
  import { cn, type ClassValue } from './cn.js';
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
    class?: ClassValue;
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
    class: className,
  }: Props = $props();

  let drawerOpen = $state(false);

  // Bottom bar: pinned items first, then the rest in order; icons required; at most 5.
  const bottomItems = $derived.by(() => {
    const all = nav.flatMap((group) => group.items).filter((item) => item.icon);
    return [...all.filter((i) => i.pinned), ...all.filter((i) => !i.pinned)].slice(0, 5);
  });

  const uid = $props.id();

  const bottomItem = cn(
    'font-inherit text-muted-foreground aria-[current=page]:text-primary focus-visible:outline-ring focus-visible:outline-focus grid min-h-14 w-full cursor-pointer justify-items-center gap-0.5 border-0 bg-transparent px-1 py-2 text-xs leading-[inherit] no-underline focus-visible:-outline-offset-2 aria-[current=page]:font-semibold',
  );

  function select(item: NavItem) {
    drawerOpen = false;
    onselect?.(item);
  }
</script>

<!-- Desktop (md, 48rem): the sidebar takes its own width, the content the rest. -->
<div
  data-slot="shell"
  class={cn(
    'bg-background text-foreground grid min-h-dvh font-sans text-base/normal md:flex',
    className,
  )}
>
  <a
    class="z-skip bg-card text-foreground focus-visible:outline-ring focus-visible:outline-focus absolute top-2 left-2 -translate-y-2/1 rounded-md px-3 py-2 focus-visible:translate-none"
    href="#{uid}-main">Skip to content</a
  >

  <aside
    class="md:border-border md:bg-muted md:text-foreground hidden md:sticky md:top-0 md:block md:h-dvh md:flex-none md:border-r"
    data-theme={sidebarTheme}
  >
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

  <div class="min-w-0 pb-18 md:flex-1 md:pb-0">
    <!-- The banner landmark: the menu button, the mobile brand and the page header sit inside it. -->
    <!-- Without a page header the bar holds nothing on a wide screen: no empty landmark. -->
    <header
      class={[
        'topbar border-border bg-card flex flex-wrap items-center gap-3 border-b px-4 py-3 md:px-8',
        !header && 'bare md:hidden',
      ]}
    >
      <span class="inline-flex md:hidden">
        <IconButton
          icon={MenuIcon}
          label="Open navigation"
          variant="secondary"
          onclick={() => (drawerOpen = true)}
        />
      </span>
      {#if brand}<span class="font-display font-semibold md:hidden"
          >{@render brand({ collapsed: false })}</span
        >{/if}
      {#if header}<div class="min-w-0 shrink grow basis-full md:flex-1">
          {@render header()}
        </div>{/if}
    </header>

    <main id="{uid}-main" class="focus:outline-none" tabindex="-1">{@render children()}</main>
  </div>

  {#if bottomItems.length > 0}
    <nav
      class="z-sticky border-border bg-card fixed inset-x-0 bottom-0 border-t md:hidden"
      aria-label="Primary"
    >
      <ul class="m-0 flex list-none p-0">
        {#each bottomItems as item (item.id)}
          <li class="flex-1">
            {#if item.href !== undefined}
              <a
                class={bottomItem}
                href={item.href}
                aria-current={current === item.id ? 'page' : undefined}
                onclick={() => onselect?.(item)}
              >
                <Icon icon={item.icon!} />
                <span>{item.label}</span>
              </a>
            {:else}
              <button
                class={bottomItem}
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
  <div>
    <Sidebar
      class="w-full bg-transparent p-0"
      groups={nav}
      {current}
      collapsible={false}
      label="{navLabel} (menu)"
      onselect={select}
      {footer}
    />
  </div>
</Sheet>
