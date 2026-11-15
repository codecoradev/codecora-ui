<!-- Where the page sits in the site. The last item is the current page and is not a link. -->
<script lang="ts">
  import { cn, type ClassValue } from './cn.js';
  import Glyph from './internal/Glyph.svelte';

  interface Item {
    label: string;
    href?: string;
  }

  interface Props {
    items: Item[];
    /** Names the landmark; translate it with the rest of the page. */
    label?: string;
    class?: ClassValue;
  }

  let { items, label = 'Breadcrumb', class: className }: Props = $props();
</script>

<nav aria-label={label} class={cn('cc-breadcrumb', className)}>
  <ol class="m-0 flex list-none flex-wrap items-center gap-1 p-0 text-sm leading-[inherit]">
    {#each items as item, i (i)}
      {@const current = i === items.length - 1}
      <!-- The chevrons are 1rem: the icon size, overridden on the glyph itself. -->
      <li
        class="[&_.cc-glyph]:text-muted-foreground inline-flex items-center gap-1 [&_.cc-glyph]:[--cc-icon-size:calc(var(--spacing)*4)]"
      >
        {#if item.href && !current}
          <!-- 0.2em of the list's text size. -->
          <a
            href={item.href}
            class="text-muted-foreground hover:text-foreground focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus underline underline-offset-[calc(var(--text-sm)*0.2)] focus-visible:rounded-sm"
            >{item.label}</a
          >
        {:else}
          <span
            class={current ? 'font-semibold' : undefined}
            aria-current={current ? 'page' : undefined}>{item.label}</span
          >
        {/if}
        {#if !current}<Glyph name="chevron-right" />{/if}
      </li>
    {/each}
  </ol>
</nav>
