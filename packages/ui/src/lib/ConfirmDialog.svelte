<!--
  Confirm or cancel an action. Announces as an alert dialog and does not close
  on outside click, so a stray click never decides. Pass tone="danger" for
  destructive actions.
-->
<script lang="ts">
  import Button from './Button.svelte';
  import Modal from './internal/Modal.svelte';

  interface Props {
    open?: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: 'default' | 'danger';
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
    onconfirm,
  }: Props = $props();

  let busy = $state(false);

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

<Modal bind:open placement="center" alert {title} {description}>
  {#snippet footer()}
    <Button variant="secondary" onclick={() => (open = false)} disabled={busy}>{cancelLabel}</Button
    >
    <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={busy} onclick={confirm}>
      {confirmLabel}
    </Button>
  {/snippet}
</Modal>
