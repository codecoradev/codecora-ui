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
      <Accordion.Content class="cc-accordion-content">
        <div class="body">{@render panel(item.value)}</div>
      </Accordion.Content>
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
  :global(.cc-accordion-trigger .cc-glyph) {
    transition: transform var(--cc-duration-fast) var(--cc-ease-in-out);
  }
  :global(.cc-accordion-trigger[data-state='open'] .cc-glyph) {
    transform: rotate(180deg);
  }
  /* The panel opens to the height bits-ui measures; padding sits inside so it clips cleanly. */
  :global(.cc-accordion-content) {
    overflow: hidden;
    color: var(--cc-text);
    animation: cc-accordion-open var(--cc-duration-normal) var(--cc-ease-out);
  }
  /* bits-ui keeps the panel mounted until the exit animation finishes. */
  :global(.cc-accordion-content[data-state='closed']) {
    animation: cc-accordion-close var(--cc-duration-fast) var(--cc-ease-exit) forwards;
  }
  .body {
    padding: 0 var(--cc-control-px) var(--cc-space-4);
  }
  @keyframes cc-accordion-open {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: var(--bits-accordion-content-height);
    }
  }
  @keyframes cc-accordion-close {
    from {
      height: var(--bits-accordion-content-height);
    }
    to {
      height: 0;
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.cc-accordion-content[data-state]) {
      animation: none;
    }
    :global(.cc-accordion-trigger .cc-glyph) {
      transition: none;
    }
  }
</style>
