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

<!-- the hiding class is merged, never replaced by a caller's class -->
<span {...rest} class={['cc-visually-hidden', className]}>{@render children()}</span>

<style>
  .cc-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
</style>
