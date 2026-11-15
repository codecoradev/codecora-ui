<!--
  Text for assistive technology only: kept in the accessibility tree, removed
  from the visual layout. Used for labels of icon-only controls.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    children: Snippet;
  }

  let { children, class: className, ...rest }: Props = $props();
</script>

<!-- sr-only is joined, not merged through cn(): a caller's class never removes the hiding -->
<span data-slot="visually-hidden" {...rest} class={['sr-only', className]}
  >{@render children()}</span
>
