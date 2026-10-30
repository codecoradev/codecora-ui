<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './internal/Icon.svelte';
  import type { IconComponent } from './types.js';

  interface Props {
    title: string;
    description?: string;
    icon?: IconComponent;
    /** Heading level, so the state fits the page outline. */
    level?: 2 | 3 | 4;
    /** Call to action, usually a Button. */
    action?: Snippet;
  }

  let { title, description, icon, level = 3, action }: Props = $props();
</script>

<div class="cc-empty">
  {#if icon}<span class="art"><Icon {icon} /></span>{/if}
  <svelte:element this={`h${level}`} class="title">{title}</svelte:element>
  {#if description}<p class="description">{description}</p>{/if}
  {#if action}<div class="action">{@render action()}</div>{/if}
</div>

<style>
  .cc-empty {
    display: grid;
    justify-items: center;
    gap: var(--cc-space-2);
    padding: var(--cc-space-10) var(--cc-space-4);
    text-align: center;
  }
  .art {
    display: inline-flex;
    margin-bottom: var(--cc-space-2);
    color: var(--cc-text-muted);
  }
  .art :global(svg) {
    width: 2rem;
    height: 2rem;
  }
  .title {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
  }
  .description {
    margin: 0;
    max-width: 40ch;
    color: var(--cc-text-muted);
    text-wrap: pretty;
  }
  .action {
    margin-top: var(--cc-space-3);
  }
</style>
