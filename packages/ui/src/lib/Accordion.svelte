<!-- Disclosure sections (bits-ui). `panel` renders the content of an open item. -->
<script lang="ts">
  import { Accordion } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import { cn, type ClassValue } from './cn.js';
  import Glyph from './internal/Glyph.svelte';

  interface Item {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    items: Item[];
    /** `single` keeps one section open; `multiple` lets several be open. */
    type?: 'single' | 'multiple';
    value?: string | string[];
    /** Heading level of the section titles, so they fit the page outline. */
    level?: 2 | 3 | 4;
    panel: Snippet<[string]>;
    class?: ClassValue;
  }

  let {
    items,
    type = 'single',
    value = $bindable(type === 'single' ? '' : []),
    level = 3,
    panel,
    class: className,
  }: Props = $props();
</script>

<!-- bits-ui types `value` per `type`; the union is narrowed by `type` at the call site. -->
<Accordion.Root
  {type}
  bind:value={value as never}
  data-slot="accordion"
  class={cn('border-border bg-card rounded-md border', className)}
>
  {#each items as item (item.value)}
    <Accordion.Item
      value={item.value}
      disabled={item.disabled}
      data-slot="accordion-item"
      class="border-border [&+&]:border-t"
    >
      <Accordion.Header {level} data-slot="accordion-header" class="m-0">
        <Accordion.Trigger
          data-slot="accordion-trigger"
          class="min-h-control px-control-x py-control-y font-inherit text-foreground hover:bg-accent focus-visible:outline-ring data-disabled:text-muted-foreground [&_[data-slot=glyph]]:duration-fast [&_[data-slot=glyph]]:ease-move focus-visible:outline-focus flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent text-left font-medium focus-visible:-outline-offset-2 data-disabled:cursor-not-allowed [&_[data-slot=glyph]]:transition-transform data-[state=open]:[&_[data-slot=glyph]]:rotate-180 motion-reduce:[&_[data-slot=glyph]]:transition-none"
        >
          <span>{item.label}</span>
          <Glyph name="chevron-down" />
        </Accordion.Trigger>
      </Accordion.Header>
      <!-- The panel opens to the height bits-ui measures; padding sits inside so it clips cleanly.
           bits-ui keeps it mounted until the close animation finishes. -->
      <Accordion.Content
        data-slot="accordion-content"
        class="animate-accordion-open text-foreground data-[state=closed]:animate-accordion-close overflow-hidden motion-reduce:data-[state]:animate-none"
      >
        <div class="px-control-x pb-4">{@render panel(item.value)}</div>
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
