<!-- Disclosure sections (bits-ui). `panel` renders the content of an open item. -->
<script lang="ts">
  import { Accordion } from 'bits-ui';
  import type { Snippet } from 'svelte';
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
  }

  let {
    items,
    type = 'single',
    value = $bindable(type === 'single' ? '' : []),
    level = 3,
    panel,
  }: Props = $props();
</script>

<!-- bits-ui types `value` per `type`; the union is narrowed by `type` at the call site. -->
<Accordion.Root {type} bind:value={value as never} class="cc-accordion">
  {#each items as item (item.value)}
    <Accordion.Item value={item.value} disabled={item.disabled} class="cc-accordion-item">
      <Accordion.Header {level} class="cc-accordion-header">
        <Accordion.Trigger class="cc-accordion-trigger">
          <span>{item.label}</span>
          <Glyph name="chevron-down" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content class="cc-accordion-content">{@render panel(item.value)}</Accordion.Content
      >
    </Accordion.Item>
  {/each}
</Accordion.Root>

<style>
  :global(.cc-accordion) {
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
  }
  :global(.cc-accordion-item + .cc-accordion-item) {
    border-top: 1px solid var(--cc-border);
  }
  :global(.cc-accordion-header) {
    margin: 0;
    font-size: inherit;
  }
  :global(.cc-accordion-trigger) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
    width: 100%;
    min-height: var(--cc-control-h);
    padding: var(--cc-space-2) var(--cc-control-px);
    border: 0;
    background: none;
    color: var(--cc-text);
    font: inherit;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
  }
  :global(.cc-accordion-trigger:hover) {
    background: var(--cc-surface-hover);
  }
  :global(.cc-accordion-trigger:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: -2px;
  }
  :global(.cc-accordion-trigger[data-disabled]) {
    color: var(--cc-text-muted);
    cursor: not-allowed;
  }
  :global(.cc-accordion-trigger[data-state='open'] .cc-glyph) {
    transform: rotate(180deg);
  }
  :global(.cc-accordion-content) {
    padding: 0 var(--cc-control-px) var(--cc-space-4);
    color: var(--cc-text);
  }
</style>
