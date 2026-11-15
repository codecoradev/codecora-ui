<!-- A raised surface that groups related content, with optional header and footer. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from './cn.js';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { header, footer, class: className, children, ...rest }: Props = $props();
</script>

<section
  {...rest}
  data-slot="card"
  class={cn('border-border bg-card text-foreground rounded-lg border', className)}
>
  {#if header}<header class="border-border font-display border-b p-4 font-semibold">
      {@render header()}
    </header>{/if}
  <div class="p-4">{@render children()}</div>
  {#if footer}<footer class="border-border bg-muted rounded-b-lg border-t p-4">
      {@render footer()}
    </footer>{/if}
</section>
