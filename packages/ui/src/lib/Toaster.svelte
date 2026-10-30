<!--
  Renders the toast queue. Mount once near the app root. The region is a
  polite live area; errors use role="alert" so they interrupt.
-->
<script lang="ts">
  import Glyph from './internal/Glyph.svelte';
  import VisuallyHidden from './VisuallyHidden.svelte';
  import { toast, toasts } from './toast.svelte.js';
</script>

<section class="cc-toaster" aria-label="Notifications">
  {#each toasts.items as item (item.id)}
    <!-- Hover or focus pauses the countdown (WCAG 2.2.1): the element is not interactive itself. -->
    <div
      class="cc-toast cc-toast-{item.tone}"
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
      <span class="dot" aria-hidden="true"></span>
      <div class="text">
        <strong>{item.title}</strong>
        {#if item.description}<span>{item.description}</span>{/if}
      </div>
      <button type="button" class="dismiss" onclick={() => toast.dismiss(item.id)}>
        <Glyph name="close" />
        <VisuallyHidden>Dismiss</VisuallyHidden>
      </button>
    </div>
  {/each}
</section>

<style>
  .cc-toaster {
    position: fixed;
    right: var(--cc-space-4);
    bottom: var(--cc-space-4);
    left: var(--cc-space-4);
    z-index: 80;
    display: grid;
    gap: var(--cc-space-2);
    justify-items: end;
    pointer-events: none;
  }
  .cc-toast {
    display: flex;
    align-items: start;
    gap: var(--cc-space-3);
    width: min(24rem, 100%);
    padding: var(--cc-space-3);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    box-shadow: 0 var(--cc-space-2) var(--cc-space-6)
      color-mix(in srgb, var(--cc-scrim) 50%, transparent);
    font-family: var(--cc-font-sans);
    pointer-events: auto;
    animation: cc-toast-in var(--cc-duration-normal) var(--cc-ease-out);
  }
  .dot {
    flex: none;
    width: 0.625rem;
    height: 0.625rem;
    margin-top: 0.4em;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-border-strong);
  }
  .cc-toast-success .dot {
    background: var(--cc-success);
  }
  .cc-toast-warning .dot {
    background: var(--cc-warning);
  }
  .cc-toast-danger .dot {
    background: var(--cc-danger);
  }
  .cc-toast-accent .dot {
    background: var(--cc-accent);
  }
  .text {
    display: grid;
    flex: 1;
    gap: var(--cc-space-1);
  }
  .text span {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .dismiss {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: var(--cc-control-h);
    height: var(--cc-control-h);
    margin: calc(-1 * var(--cc-space-2));
    padding: 0;
    border: 0;
    border-radius: var(--cc-radius-md);
    background: transparent;
    color: var(--cc-text-muted);
    cursor: pointer;
  }
  .dismiss:hover {
    background: var(--cc-surface-hover);
    color: var(--cc-text);
  }
  .dismiss:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  @keyframes cc-toast-in {
    from {
      opacity: 0;
      transform: translateY(var(--cc-space-2));
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .cc-toast {
      animation: none;
    }
  }
</style>
