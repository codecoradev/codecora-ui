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

<div data-slot="empty" class="grid justify-items-center gap-2 px-4 py-10 text-center">
  <!-- [&_[data-slot=icon]_svg] outranks the icon's own [&_svg] size. -->
  {#if icon}<span class="text-muted-foreground mb-2 inline-flex [&_[data-slot=icon]_svg]:size-8"
      ><Icon {icon} /></span
    >{/if}
  <svelte:element this={`h${level}`} class="font-display leading-heading m-0 text-lg font-bold"
    >{title}</svelte:element
  >
  {#if description}<p class="max-w-description text-muted-foreground m-0 text-pretty">
      {description}
    </p>{/if}
  {#if action}<div class="mt-3">{@render action()}</div>{/if}
</div>
