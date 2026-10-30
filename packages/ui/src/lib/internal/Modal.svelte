<!--
  Shared modal over bits-ui Dialog: focus trap, Escape, scroll lock and
  focus return come from bits-ui. Dialog (centered) and Sheet (edge panel)
  are thin wrappers that pick a placement.
-->
<script lang="ts">
  import { AlertDialog, Dialog } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import Glyph from './Glyph.svelte';
  import VisuallyHidden from '../VisuallyHidden.svelte';

  type Placement = 'center' | 'right' | 'left' | 'bottom';

  interface Props {
    open?: boolean;
    placement: Placement;
    title: string;
    description?: string;
    /** Element that opens the modal; omit to control it with `open`. */
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
    footer?: Snippet;
    children?: Snippet;
    onOpenChange?: (open: boolean) => void;
    /** Dialog role; confirmations announce as an alert dialog. */
    alert?: boolean;
    /** Theme name for the panel, which renders outside the page frame (a portal). */
    theme?: string;
    /** Danger adds a warning mark and stronger description text. */
    tone?: 'default' | 'danger';
    /** Id of the element that takes focus on open, instead of the first focusable one. */
    initialFocus?: string;
  }

  let {
    open = $bindable(false),
    placement,
    title,
    description,
    trigger,
    footer,
    children,
    onOpenChange,
    alert = false,
    theme,
    tone = 'default',
    initialFocus,
  }: Props = $props();
  function focusInitial(event: Event) {
    const el = initialFocus ? document.getElementById(initialFocus) : null;
    if (!el) return;
    event.preventDefault();
    el.focus();
  }
</script>

{#snippet header(Title: typeof Dialog.Title, close: boolean)}
  <header class="cc-modal-header">
    <Title class="cc-modal-title">
      {#if tone === 'danger'}<span class="cc-modal-mark"><Glyph name="alert" /></span>{/if}
      {title}
    </Title>
    {#if close}
      <Dialog.Close class="cc-modal-close">
        <Glyph name="close" />
        <VisuallyHidden>Close</VisuallyHidden>
      </Dialog.Close>
    {/if}
  </header>
{/snippet}

{#if alert}
  <!-- Alert dialog: role=alertdialog, no outside-click or X close; the footer holds the choice. -->
  <AlertDialog.Root bind:open {onOpenChange}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay class="cc-modal-overlay" />
      <AlertDialog.Content
        class="cc-modal cc-modal-{placement} cc-modal-{tone}"
        data-theme={theme}
        onOpenAutoFocus={focusInitial}
      >
        {@render header(AlertDialog.Title, false)}
        {#if description}
          <AlertDialog.Description class="cc-modal-description"
            >{description}</AlertDialog.Description
          >
        {/if}
        {#if children}<div class="cc-modal-body">{@render children()}</div>{/if}
        {#if footer}<footer class="cc-modal-footer">{@render footer()}</footer>{/if}
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
{:else}
  <Dialog.Root bind:open {onOpenChange}>
    {#if trigger}
      <Dialog.Trigger>
        {#snippet child({ props })}{@render trigger({ props })}{/snippet}
      </Dialog.Trigger>
    {/if}
    <Dialog.Portal>
      <Dialog.Overlay class="cc-modal-overlay" />
      <Dialog.Content
        class="cc-modal cc-modal-{placement} cc-modal-{tone}"
        data-theme={theme}
        onOpenAutoFocus={focusInitial}
      >
        {@render header(Dialog.Title, true)}
        {#if description}
          <Dialog.Description class="cc-modal-description">{description}</Dialog.Description>
        {/if}
        {#if children}<div class="cc-modal-body">{@render children()}</div>{/if}
        {#if footer}<footer class="cc-modal-footer">{@render footer()}</footer>{/if}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{/if}

<style>
  :global(.cc-modal-overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: var(--cc-scrim);
    animation: cc-fade var(--cc-duration-normal) var(--cc-ease-out);
  }
  :global(.cc-modal) {
    position: fixed;
    z-index: 51;
    display: grid;
    gap: var(--cc-space-3);
    align-content: start;
    max-height: 100dvh;
    overflow-y: auto;
    padding: var(--cc-space-5);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    border: 1px solid var(--cc-border);
    box-shadow: 0 var(--cc-space-4) var(--cc-space-10)
      color-mix(in srgb, var(--cc-scrim) 60%, transparent);
    font-family: var(--cc-font-sans);
    animation: cc-rise var(--cc-duration-normal) var(--cc-ease-out);
  }
  :global(.cc-modal:focus-visible) {
    outline: 2px solid var(--cc-focus);
    outline-offset: -2px;
  }
  :global(.cc-modal-center) {
    top: 50%;
    left: 50%;
    width: min(32rem, calc(100vw - 2 * var(--cc-space-4)));
    max-height: calc(100dvh - 2 * var(--cc-space-4));
    transform: translate(-50%, -50%);
    border-radius: var(--cc-radius-lg);
    animation-name: cc-pop;
  }
  :global(.cc-modal-right),
  :global(.cc-modal-left) {
    top: 0;
    bottom: 0;
    width: min(26rem, 100vw);
    align-content: start;
    animation-name: cc-slide-x;
  }
  :global(.cc-modal-right) {
    right: 0;
    border-width: 0 0 0 1px;
  }
  :global(.cc-modal-left) {
    left: 0;
    border-width: 0 1px 0 0;
    --cc-slide-from: -100%;
  }
  :global(.cc-modal-bottom) {
    right: 0;
    bottom: 0;
    left: 0;
    max-height: 85dvh;
    border-width: 1px 0 0;
    border-radius: var(--cc-radius-lg) var(--cc-radius-lg) 0 0;
  }
  .cc-modal-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--cc-space-3);
  }
  :global(.cc-modal-title) {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
    line-height: var(--cc-leading-tight);
  }
  :global(.cc-modal-description) {
    margin: 0;
    color: var(--cc-text-muted);
  }
  :global(.cc-modal-title) {
    display: flex;
    align-items: center;
    gap: var(--cc-space-2);
  }
  :global(.cc-modal-mark) {
    display: inline-flex;
    color: var(--cc-danger);
  }
  :global(.cc-modal-danger .cc-modal-description) {
    color: var(--cc-text);
    font-weight: 500;
  }
  :global(.cc-modal-close) {
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
  :global(.cc-modal-close:hover) {
    background: var(--cc-surface-hover);
    color: var(--cc-text);
  }
  :global(.cc-modal-close:focus-visible) {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
  }
  .cc-modal-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--cc-space-2);
    margin-top: var(--cc-space-2);
  }
  @keyframes cc-fade {
    from {
      opacity: 0;
    }
  }
  @keyframes cc-pop {
    from {
      opacity: 0;
      transform: translate(-50%, calc(-50% + var(--cc-space-2)));
    }
  }
  @keyframes cc-slide-x {
    from {
      transform: translateX(var(--cc-slide-from, 100%));
    }
  }
  @keyframes cc-rise {
    from {
      transform: translateY(100%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.cc-modal-overlay),
    :global(.cc-modal) {
      animation: none;
    }
  }
</style>
