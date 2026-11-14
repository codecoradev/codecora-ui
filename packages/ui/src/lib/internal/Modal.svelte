<!--
  Shared modal over bits-ui Dialog: focus trap, Escape, scroll lock and
  focus return come from bits-ui. Dialog (centered) and Sheet (edge panel)
  are thin wrappers that pick a placement.
-->
<script module lang="ts">
  import { cn } from '../cn.js';
  import { tv } from './variants.js';

  /** The scrim behind the panel; bits-ui keeps it mounted until its exit ends. */
  export const overlay =
    'cc-modal-overlay fixed inset-0 z-overlay bg-overlay animate-overlay-in data-[state=closed]:animate-overlay-out motion-reduce:animate-none motion-reduce:data-[state=closed]:animate-none';

  /** Exits run one step shorter than entries; reduced motion drops the keyframes. */
  const panelRecipe = tv({
    base: 'cc-modal z-modal border-border bg-popover text-foreground shadow-modal focus-visible:outline-ring fixed grid content-start gap-3 overflow-y-auto p-5 font-sans focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:-outline-offset-2 focus-visible:outline-solid motion-reduce:animate-none motion-reduce:data-[state=closed]:animate-none',
    variants: {
      placement: {
        // Opacity eases; only the movement springs.
        center:
          'cc-modal-center animate-dialog-in data-[state=closed]:animate-dialog-out top-1/2 left-1/2 max-h-[calc(100dvh-2*var(--cc-space-4))] w-[min(32rem,calc(100vw-2*var(--cc-space-4)))] -translate-1/2 rounded-lg border',
        right:
          'cc-modal-right animate-sheet-right-in data-[state=closed]:animate-sheet-right-out inset-y-0 right-0 max-h-dvh w-[min(calc(var(--spacing)*104),100vw)] border-l',
        left: 'cc-modal-left animate-sheet-left-in data-[state=closed]:animate-sheet-left-out inset-y-0 left-0 max-h-dvh w-[min(calc(var(--spacing)*104),100vw)] border-r',
        bottom:
          'cc-modal-bottom animate-sheet-bottom-in data-[state=closed]:animate-sheet-bottom-out inset-x-0 bottom-0 max-h-[85dvh] rounded-t-lg border-t',
      },
      tone: { default: 'cc-modal-default', danger: 'cc-modal-danger' },
    },
  });

  const descriptionRecipe = tv({
    base: 'cc-modal-description m-0',
    variants: {
      tone: { default: 'text-muted-foreground', danger: 'text-foreground font-medium' },
    },
  });

  /** Square icon button in the corner: close here, dismiss in Toaster. */
  export const closeButton =
    'inline-flex size-control flex-none cursor-pointer items-center justify-center -m-2 rounded-md border-0 bg-transparent p-0 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)] focus-visible:outline-ring focus-visible:outline-solid';
</script>

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

  const panelClass = $derived(cn(panelRecipe({ placement, tone })));
  const descriptionClass = $derived(cn(descriptionRecipe({ tone })));

  function focusInitial(event: Event) {
    const el = initialFocus ? document.getElementById(initialFocus) : null;
    if (!el) return;
    event.preventDefault();
    el.focus();
  }
</script>

{#snippet header(Title: typeof Dialog.Title, close: boolean)}
  <header class="cc-modal-header flex items-start justify-between gap-3">
    <Title
      class="cc-modal-title font-display m-0 flex items-center gap-2 text-lg leading-[var(--cc-leading-tight)]"
    >
      {#if tone === 'danger'}<span class="cc-modal-mark text-destructive inline-flex"
          ><Glyph name="alert" /></span
        >{/if}
      {title}
    </Title>
    {#if close}
      <Dialog.Close class={cn('cc-modal-close', closeButton)}>
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
      <AlertDialog.Overlay class={overlay} />
      <AlertDialog.Content class={panelClass} data-theme={theme} onOpenAutoFocus={focusInitial}>
        {@render header(AlertDialog.Title, false)}
        {#if description}
          <AlertDialog.Description class={descriptionClass}>{description}</AlertDialog.Description>
        {/if}
        {#if children}<div class="cc-modal-body">{@render children()}</div>{/if}
        {#if footer}<footer class="cc-modal-footer mt-2 flex flex-wrap justify-end gap-2">
            {@render footer()}
          </footer>{/if}
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
      <Dialog.Overlay class={overlay} />
      <Dialog.Content class={panelClass} data-theme={theme} onOpenAutoFocus={focusInitial}>
        {@render header(Dialog.Title, true)}
        {#if description}
          <Dialog.Description class={descriptionClass}>{description}</Dialog.Description>
        {/if}
        {#if children}<div class="cc-modal-body">{@render children()}</div>{/if}
        {#if footer}<footer class="cc-modal-footer mt-2 flex flex-wrap justify-end gap-2">
            {@render footer()}
          </footer>{/if}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{/if}
