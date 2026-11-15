<!-- A row of related toggles (bits-ui): one choice, or several. Arrow keys move between them. -->
<script lang="ts">
  import { ToggleGroup } from 'bits-ui';
  import { cn } from './cn.js';

  interface Item {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    items: Item[];
    /** Names the group for assistive tech. */
    label: string;
    type?: 'single' | 'multiple';
    value?: string | string[];
  }

  let {
    items,
    label,
    type = 'single',
    value = $bindable(type === 'single' ? '' : []),
  }: Props = $props();
</script>

<!-- bits-ui types `value` per `type`; the union is narrowed by `type` at the call site. -->
<ToggleGroup.Root
  {type}
  bind:value={value as never}
  aria-label={label}
  data-slot="toggles"
  class="border-input bg-card inline-flex rounded-md border"
>
  {#each items as item (item.value)}
    <ToggleGroup.Item
      value={item.value}
      disabled={item.disabled}
      data-slot="toggle"
      class={cn(
        'min-h-control px-control-x font-inherit text-foreground cursor-pointer rounded-none border-0 bg-transparent',
        'duration-fast ease-enter transition-[background-color,color] motion-reduce:transition-none',
        '[[data-slot=toggle]+&]:border-s-input [[data-slot=toggle]+&]:border-s',
        'first:rounded-s-[calc(var(--radius-md)-1px)] last:rounded-e-[calc(var(--radius-md)-1px)]',
        'hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
        'focus-visible:outline-ring focus-visible:outline-focus focus-visible:relative focus-visible:-outline-offset-2',
        'data-disabled:cursor-not-allowed data-disabled:opacity-55',
      )}
    >
      {item.label}
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
