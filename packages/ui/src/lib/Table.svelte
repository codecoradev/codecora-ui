<!--
  Styles a native <table> you write inside it. The wrapper scrolls sideways on
  narrow screens and, only while it overflows, is a labelled focusable region so
  keyboard users can scroll it; a table that fits adds no tab stop.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn, type ClassValue } from './cn.js';

  interface Props {
    /** Names the table; shown to assistive technology and as the caption. */
    label: string;
    /**
     * Names the scroll region while the table overflows. Defaults to the label plus
     * "(scrollable)", so it differs from a heading or section that carries the same
     * words (landmarks on a page need distinct names).
     */
    regionLabel?: string;
    children: Snippet;
    class?: ClassValue;
  }

  let { label, regionLabel, children, class: className }: Props = $props();

  let wrap = $state<HTMLElement>();
  let overflowing = $state(false);

  // A scroll region has to be reachable by keyboard (WCAG 2.1.1), but only while
  // there is something to scroll. Until it is measured (and without JavaScript) the
  // wrapper is a plain element, and the caption names the table. One pixel of slack
  // absorbs sub-pixel rounding.
  $effect(() => {
    if (!wrap) return;
    const element = wrap;
    const measure = () => {
      overflowing = element.scrollWidth - element.clientWidth > 1;
    };
    measure();
    // The wrapper changes with the viewport, the table with its rows and columns.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    return () => observer.disconnect();
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- relative: contains the visually hidden caption and header labels. -->
<div
  class={cn(
    'cc-table-wrap border-border bg-card focus-visible:outline-ring relative overflow-x-auto rounded-md border focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)]',
    className,
  )}
  bind:this={wrap}
  role={overflowing ? 'region' : undefined}
  aria-label={overflowing ? (regionLabel ?? `${label} (scrollable)`) : undefined}
  tabindex={overflowing ? 0 : undefined}
>
  <!-- Styles the cells you write; a selected row (data-selected or aria-selected) is tinted and marked. -->
  <table
    class={[
      'cc-table w-full border-collapse text-base leading-[inherit]',
      '[&_:is(th,td)]:border-border [&_:is(th,td)]:px-cell-x [&_:is(th,td)]:py-cell-y [&_:is(th,td)]:border-b [&_:is(th,td)]:text-left [&_:is(th,td)]:align-middle',
      '[&_thead_th]:bg-muted [&_thead_th]:text-muted-foreground [&_thead_th]:text-sm [&_thead_th]:leading-[inherit] [&_thead_th]:font-semibold [&_thead_th]:whitespace-nowrap',
      '[&_tbody_tr:last-child>*]:border-b-0',
      '[&_tbody_tr]:duration-fast [&_tbody_tr]:ease-enter [&_tbody_tr]:transition-[background-color,box-shadow] motion-reduce:[&_tbody_tr]:transition-none',
      '[&_tbody_tr:hover]:bg-accent',
      '[&_tbody_tr:is([data-selected=true],[aria-selected=true])]:bg-primary-soft [&_tbody_tr:is([data-selected=true],[aria-selected=true])]:[box-shadow:inset_var(--cc-row-marker)_0_0_var(--primary)]',
      '[&_.num]:text-right [&_.num]:font-mono [&_.num]:tabular-nums',
    ]}
  >
    <caption class="cc-table-caption sr-only m-0">{label}</caption>
    {@render children()}
  </table>
</div>
