<!-- An inline link. External links open in a new tab with noopener and say so to screen readers. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import VisuallyHidden from './VisuallyHidden.svelte';

  interface Props extends Omit<HTMLAnchorAttributes, 'children' | 'href'> {
    href: string;
    external?: boolean;
    children: Snippet;
  }

  let { href, external = false, class: className, children, ...rest }: Props = $props();
</script>

<a
  {...rest}
  {href}
  class={['cc-link', className]}
  target={external ? '_blank' : rest.target}
  rel={external ? 'noopener noreferrer' : rest.rel}
>
  {@render children()}{#if external}<VisuallyHidden>, opens in a new tab</VisuallyHidden>{/if}
</a>

<style>
  .cc-link {
    color: var(--cc-accent);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  .cc-link:hover {
    color: var(--cc-accent-hover);
  }
  .cc-link:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
    border-radius: var(--cc-radius-sm);
  }
</style>
