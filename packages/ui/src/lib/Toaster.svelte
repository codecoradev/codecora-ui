<!--
  Renders the toast queue. Mount once near the app root. The region is a
  polite live area; errors use role="alert" so they interrupt.
-->
<script lang="ts">
  import Glyph from './internal/Glyph.svelte';
  import { closeButton } from './internal/Modal.svelte';
  import VisuallyHidden from './VisuallyHidden.svelte';
  import { toast, toasts } from './toast.svelte.js';
  import type { Tone } from './types.js';

  /**
   * Keeps a dismissed toast on screen while its CSS exit animation runs; the
   * length comes from the duration token, so reduced motion removes it at once.
   */
  const dot: Record<Tone, string> = {
    neutral: 'bg-input',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive',
    accent: 'bg-primary',
  };

  function leave(node: HTMLElement) {
    node.dataset.state = 'closed';
    const value = getComputedStyle(node).getPropertyValue('--cc-duration-fast').trim();
    const ms = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
    return { duration: Number.isFinite(ms) ? ms : 0 };
  }
</script>

<section
  class="cc-toaster z-toast pointer-events-none fixed right-4 bottom-4 left-4 grid justify-items-end gap-2"
  aria-label="Notifications"
>
  {#each toasts.items as item (item.id)}
    <!-- Hover or focus pauses the countdown (WCAG 2.2.1): the element is not interactive itself. -->
    <div
      class="cc-toast cc-toast-{item.tone} border-border bg-popover text-foreground shadow-popover animate-toast-in data-[state=closed]:animate-toast-out pointer-events-auto flex w-[min(calc(var(--spacing)*96),100%)] items-start gap-3 rounded-md border p-3 font-sans data-[state=closed]:pointer-events-none motion-reduce:animate-none motion-reduce:data-[state=closed]:animate-none"
      data-state={toasts.items.includes(item) ? 'open' : 'closed'}
      out:leave
      role={item.tone === 'danger' ? 'alert' : 'status'}
      onmouseenter={() => toast.pause(item.id, 'hover')}
      onmouseleave={() => toast.resume(item.id, 'hover')}
      onfocusin={() => toast.pause(item.id, 'focus')}
      onfocusout={(event) => {
        // Focus moving between controls inside the toast is not leaving it.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          toast.resume(item.id, 'focus');
        }
      }}
    >
      <!-- margin-top 0.4em is inline: an em offset reads no token, which the class lint asks of arbitrary values. -->
      <span
        class={['size-2.5 flex-none rounded-full', dot[item.tone]]}
        style="margin-top: 0.4em"
        aria-hidden="true"
      ></span>
      <div class="grid flex-1 gap-1">
        <strong>{item.title}</strong>
        {#if item.description}<span
            class="text-muted-foreground text-[length:var(--cc-font-size-sm)]"
            >{item.description}</span
          >{/if}
      </div>
      <button type="button" class={closeButton} onclick={() => toast.dismiss(item.id)}>
        <Glyph name="close" />
        <VisuallyHidden>Dismiss</VisuallyHidden>
      </button>
    </div>
  {/each}
</section>
