<!-- An inline link. External links open in a new tab with noopener and say so to screen readers. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import VisuallyHidden from './VisuallyHidden.svelte';
  import { cn } from './cn.js';

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
  class={cn(
    'cc-link text-primary underline-offset-text hover:text-primary-hover underline',
    'focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:rounded-sm focus-visible:outline-solid',
    className,
  )}
  target={external ? '_blank' : rest.target}
  rel={external ? 'noopener noreferrer' : rest.rel}
>
  {@render children()}{#if external}<VisuallyHidden>, opens in a new tab</VisuallyHidden>{/if}
</a>
