<!--
  Label, control, hint and error as one unit. The control is rendered by the
  caller and gets the ids it needs:

    <Field label="Email" error={err}>
      {#snippet children(control)}<Input type="email" {...control} />{/snippet}
    </Field>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface ControlProps {
    id: string;
    'aria-describedby': string | undefined;
    invalid: boolean;
  }

  interface Props {
    label: string;
    description?: string;
    /** A message marks the field invalid and is announced with the control. */
    error?: string;
    required?: boolean;
    children: Snippet<[ControlProps]>;
  }

  let { label, description, error, required = false, children }: Props = $props();

  const uid = $props.id();
  const id = `${uid}-control`;
  const describedby = $derived(
    [description ? `${uid}-hint` : '', error ? `${uid}-error` : ''].filter(Boolean).join(' ') ||
      undefined,
  );
</script>

<div class="cc-field">
  <label for={id}>
    {label}{#if required}<span class="req" aria-hidden="true"> *</span>{/if}
  </label>
  {@render children({ id, 'aria-describedby': describedby, invalid: Boolean(error) })}
  {#if description}<p id="{uid}-hint" class="hint">{description}</p>{/if}
  {#if error}<p id="{uid}-error" class="error">{error}</p>{/if}
</div>

<style>
  .cc-field {
    display: grid;
    gap: var(--cc-space-1);
  }
  label {
    font-size: var(--cc-font-size-sm);
    font-weight: 500;
  }
  .req {
    color: var(--cc-danger);
  }
  .hint,
  .error {
    margin: 0;
    font-size: var(--cc-font-size-sm);
  }
  .hint {
    color: var(--cc-text-muted);
  }
  .error {
    color: var(--cc-danger);
  }
</style>
