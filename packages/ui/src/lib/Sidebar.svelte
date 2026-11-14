<!--
  Grouped navigation with a brand slot, a footer slot (plan, usage, account)
  and, on desktop, a collapse toggle. Collapsed, it shows icons only; the
  label stays in the accessibility tree and as a tooltip. Items with an
  `href` are links, others are buttons that report through `onselect`.
-->
<script module lang="ts">
  import { tv } from './internal/variants.js';

  /** The rows and the collapse toggle share one shape. */
  const control = tv({
    base: [
      'min-h-control font-inherit flex w-full cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent px-3 text-left no-underline',
      'hover:bg-accent focus-visible:outline-ring focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:-outline-offset-2',
    ],
    variants: {
      part: {
        item: 'item text-foreground [&_.cc-icon]:text-muted-foreground aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary aria-[current=page]:font-semibold aria-[current=page]:[&_.cc-icon]:text-inherit',
        toggle: 'toggle text-muted-foreground [&_.cc-glyph]:text-muted-foreground',
      },
      collapsed: { true: 'justify-center px-0' },
    },
  });
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn, type ClassValue } from './cn.js';
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
    class?: ClassValue;
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
    class: className,
  }: Props = $props();

  const uid = $props.id();
</script>

{#snippet row(item: NavItem, props: Record<string, unknown>)}
  {#if item.href !== undefined}
    <a
      {...props}
      href={item.href}
      class={cn(control({ part: 'item', collapsed }))}
      aria-current={current === item.id ? 'page' : undefined}
      onclick={() => onselect?.(item)}
    >
      {@render itemBody(item)}
    </a>
  {:else}
    <button
      {...props}
      type="button"
      class={cn(control({ part: 'item', collapsed }))}
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
    <span
      class="size-icon inline-grid flex-none place-items-center font-semibold"
      aria-hidden="true">{item.label.slice(0, 1)}</span
    >
  {/if}
  {#if collapsed}
    <VisuallyHidden>{item.label}</VisuallyHidden>
  {:else}
    <span class="min-w-0 flex-1 truncate">{item.label}</span>
  {/if}
  {#if item.badge !== undefined && !collapsed}<span
      class="bg-primary-soft text-primary rounded-full px-2 text-[length:var(--cc-font-size-xs)] tabular-nums"
      >{item.badge}</span
    >{/if}
{/snippet}

<div
  class={cn(
    'cc-sidebar bg-muted text-foreground flex h-full w-60 flex-col gap-4 overflow-y-auto px-3 py-4 font-sans',
    'motion-safe:duration-normal motion-safe:ease-enter motion-safe:transition-[width]',
    collapsed && 'collapsed w-16 items-center px-2',
    className,
  )}
>
  {#if brand}<div class="font-display px-2 py-1 text-[length:var(--cc-font-size-lg)] font-semibold">
      {@render brand({ collapsed })}
    </div>{/if}

  <nav aria-label={label} class="grid w-full gap-4">
    {#each groups as group, g (g)}
      <div class="grid gap-1">
        {#if group.label && !collapsed}
          <!-- 0.04em of the label's text size. -->
          <p
            class="text-muted-foreground m-0 px-3 text-[length:var(--cc-font-size-xs)] font-semibold tracking-[calc(var(--cc-font-size-xs)*0.04)] uppercase"
            id="{uid}-g{g}"
          >
            {group.label}
          </p>
        {/if}
        <ul
          class="m-0 grid list-none gap-0.5 p-0"
          aria-labelledby={group.label && !collapsed ? `${uid}-g${g}` : undefined}
        >
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

  {#if footer}<div class="mt-auto w-full text-[length:var(--cc-font-size-sm)]">
      {@render footer({ collapsed })}
    </div>{/if}

  {#if collapsible}
    <button
      type="button"
      class={cn(control({ part: 'toggle', collapsed }), footer ? 'mt-0' : 'mt-auto')}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onclick={() => (collapsed = !collapsed)}
    >
      <Glyph name={collapsed ? 'chevron-right' : 'chevron-left'} />
      {#if !collapsed}<span class="min-w-0 flex-1 truncate">Collapse</span>{/if}
    </button>
  {/if}
</div>
