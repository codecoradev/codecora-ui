<!--
  Confirm or cancel an action. Announces as an alert dialog and does not close
  on outside click, so a stray click never decides. For tone="danger" the
  irreversible sentence is emphasised and Cancel takes focus first; add
  `confirmText` to make the user type a name before the action is enabled.
-->
<script lang="ts">
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  import Input from './Input.svelte';
  import Modal from './internal/Modal.svelte';

  interface Props {
    open?: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: 'default' | 'danger';
    /** The user must type this exactly before confirming, for example the resource name. */
    confirmText?: string;
    /** Theme name for the panel, which renders in a portal outside the page frame. */
    theme?: string;
    /** Called on confirm; the dialog closes after it returns (or resolves). */
    onconfirm: () => void | Promise<void>;
  }

  let {
    open = $bindable(false),
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    tone = 'default',
    confirmText,
    theme,
    onconfirm,
  }: Props = $props();

  const uid = $props.id();
  const cancelId = `${uid}-cancel`;
  let busy = $state(false);
  let typed = $state('');

  const armed = $derived(confirmText === undefined || typed === confirmText);

  // A fresh dialog never starts armed from an earlier attempt.
  $effect(() => {
    if (!open) typed = '';
  });

  async function confirm() {
    busy = true;
    try {
      await onconfirm();
      open = false;
    } finally {
      busy = false;
    }
  }
</script>

<Modal
  bind:open
  placement="center"
  alert
  {title}
  {description}
  {theme}
  {tone}
  initialFocus={tone === 'danger' ? cancelId : undefined}
>
  {#if confirmText !== undefined}
    <Field label={`Type ${confirmText} to confirm`}>
      {#snippet children(control)}
        <Input {...control} bind:value={typed} autocomplete="off" spellcheck={false} />
      {/snippet}
    </Field>
  {/if}
  {#snippet footer()}
    <Button id={cancelId} variant="secondary" onclick={() => (open = false)} disabled={busy}>
      {cancelLabel}
    </Button>
    <Button
      variant={tone === 'danger' ? 'danger' : 'primary'}
      loading={busy}
      disabled={!armed}
      onclick={confirm}
    >
      {confirmLabel}
    </Button>
  {/snippet}
</Modal>
