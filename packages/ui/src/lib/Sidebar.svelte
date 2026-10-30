<!--
  Grouped navigation with a brand slot, a footer slot (plan, usage, account)
  and, on desktop, a collapse toggle. Collapsed, it shows icons only; the
  label stays in the accessibility tree and as a tooltip. Items with an
  `href` are links, others are buttons that report through `onselect`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Glyph from './internal/Glyph.svelte';
  import Icon from './internal/Icon.svelte';
  import Tooltip from './Tooltip.svelte';
  import VisuallyHidden from './VisuallyHidden.svelte';
  import type { NavGroup, NavItem } from './types.js';

  interface Props {
    groups: NavGroup[];
    /** `id` of the current item; it gets aria-current="page". */
    current?: string;
    collapsed?: boolean;
    /** Show the collapse toggle (desktop). */
    collapsible?: boolean;
    /** Accessible name of the navigation landmark. */
    label?: string;
    onselect?: (item: NavItem) => void;
    brand?: Snippet<[{ collapsed: boolean }]>;
    footer?: Snippet<[{ collapsed: boolean }]>;
  }

  let {
    groups,
    current,
    collapsed = $bindable(false),
    collapsible = true,
    label = 'Main',
    onselect,
    brand,
    footer,
  }: Props = $props();

  const uid = $props.id();
</script>

{#snippet row(item: NavItem, props: Record<string, unknown>)}
  {#if item.href !== undefined}
    <a
      {...props}
      href={item.href}
      class="item"
      aria-current={current === item.id ? 'page' : undefined}
      onclick={() => onselect?.(item)}
    >
      {@render itemBody(item)}
    </a>
  {:else}
    <button
      {...props}
      type="button"
      class="item"
      aria-current={current === item.id ? 'page' : undefined}
      onclick={() => onselect?.(item)}
    >
      {@render itemBody(item)}
    </button>
  {/if}
{/snippet}

{#snippet itemBody(item: NavItem)}
  {#if item.icon}
    <Icon icon={item.icon} />
  {:else}
    <span class="initial" aria-hidden="true">{item.label.slice(0, 1)}</span>
  {/if}
  {#if collapsed}
    <VisuallyHidden>{item.label}</VisuallyHidden>
  {:else}
    <span class="text">{item.label}</span>
  {/if}
  {#if item.badge !== undefined && !collapsed}<span class="badge">{item.badge}</span>{/if}
{/snippet}

<div class="cc-sidebar" class:collapsed>
  {#if brand}<div class="brand">{@render brand({ collapsed })}</div>{/if}

  <nav aria-label={label}>
    {#each groups as group, g (g)}
      <div class="group">
        {#if group.label && !collapsed}
          <p class="group-label" id="{uid}-g{g}">{group.label}</p>
        {/if}
        <ul aria-labelledby={group.label && !collapsed ? `${uid}-g${g}` : undefined}>
          {#each group.items as item (item.id)}
            <li>
              {#if collapsed}
                <Tooltip content={item.label} side="right">
                  {#snippet trigger({ props })}{@render row(item, props)}{/snippet}
                </Tooltip>
              {:else}
                {@render row(item, {})}
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>

  {#if footer}<div class="footer">{@render footer({ collapsed })}</div>{/if}

  {#if collapsible}
    <button
      type="button"
      class="toggle"
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onclick={() => (collapsed = !collapsed)}
    >
      <Glyph name={collapsed ? 'chevron-right' : 'chevron-left'} />
      {#if !collapsed}<span class="text">Collapse</span>{/if}
    </button>
  {/if}
</div>

<style>
  .cc-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--cc-space-4);
    width: 15rem;
    height: 100%;
    padding: var(--cc-space-4) var(--cc-space-3);
    background: var(--cc-surface-sunken);
    color: var(--cc-text);
    font-family: var(--cc-font-sans);
    overflow-y: auto;
  }
  .cc-sidebar.collapsed {
    width: 4rem;
    align-items: center;
    padding-inline: var(--cc-space-2);
  }
  .brand {
    padding: var(--cc-space-1) var(--cc-space-2);
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
    font-weight: 600;
  }
  nav {
    display: grid;
    gap: var(--cc-space-4);
    width: 100%;
  }
  .group {
    display: grid;
    gap: var(--cc-space-1);
  }
  .group-label {
    margin: 0;
    padding-inline: var(--cc-space-3);
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  ul {
    display: grid;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .item,
  .toggle {
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
    text-decoration: none;
    cursor: pointer;
  }
  .collapsed .item,
  .collapsed .toggle {
    justify-content: center;
    padding-inline: 0;
  }
  .item :global(.cc-icon),
  .toggle :global(.cc-glyph) {
    color: var(--cc-text-muted);
  }
  .item:hover,
  .toggle:hover {
    background: var(--cc-surface-hover);
  }
  .item[aria-current='page'] {
    background: var(--cc-accent-soft);
    color: var(--cc-accent);
    font-weight: 600;
  }
  .item[aria-current='page'] :global(.cc-icon) {
    color: inherit;
  }
  .item:focus-visible,
  .toggle:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: -2px;
  }
  .initial {
    display: inline-grid;
    place-items: center;
    flex: none;
    width: var(--cc-icon-size);
    height: var(--cc-icon-size);
    font-weight: 600;
  }
  .text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .badge {
    padding: 0 var(--cc-space-2);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-accent-soft);
    color: var(--cc-accent);
    font-size: var(--cc-font-size-xs);
    font-variant-numeric: tabular-nums;
  }
  .footer {
    margin-top: auto;
    width: 100%;
    font-size: var(--cc-font-size-sm);
  }
  .toggle {
    margin-top: auto;
    color: var(--cc-text-muted);
  }
  .footer ~ .toggle {
    margin-top: 0;
  }
  @media (prefers-reduced-motion: no-preference) {
    .cc-sidebar {
      transition: width var(--cc-duration-normal) var(--cc-ease-out);
    }
  }
</style>
