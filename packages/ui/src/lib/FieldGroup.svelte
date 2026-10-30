<!--
  A legend, hint and error around a group of controls (radios, checkboxes).
  The children get the ids they need:

    <FieldGroup legend="Digest" error={err}>
      {#snippet children(group)}<RadioGroup label="Digest" items={items} {...group} />{/snippet}
    </FieldGroup>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Glyph from './internal/Glyph.svelte';
  import VisuallyHidden from './VisuallyHidden.svelte';

  interface GroupProps {
    'aria-describedby': string | undefined;
    invalid: boolean;
    required: boolean;
  }

  interface Props {
    legend: string;
    description?: string;
    error?: string;
    required?: boolean;
    children: Snippet<[GroupProps]>;
  }

  let { legend, description, error, required = false, children }: Props = $props();

  const uid = $props.id();
  const describedby = $derived(
    [description ? `${uid}-hint` : '', error ? `${uid}-error` : ''].filter(Boolean).join(' ') ||
      undefined,
  );
</script>

<fieldset class="cc-fieldgroup" aria-describedby={describedby}>
  <legend>
    {legend}{#if required}<span class="req" aria-hidden="true"> *</span>{/if}
  </legend>
  {#if description}<p id="{uid}-hint" class="hint">{description}</p>{/if}
  {@render children({ 'aria-describedby': describedby, invalid: Boolean(error), required })}
  {#if error}
    <p id="{uid}-error" class="error">
      <Glyph name="alert" /><VisuallyHidden>Error:</VisuallyHidden>
      {error}
    </p>
  {/if}
</fieldset>

<style>
  .cc-fieldgroup {
    display: grid;
    gap: var(--cc-space-1);
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  legend {
    padding: 0;
    margin-bottom: var(--cc-space-1);
    font-size: var(--cc-font-size-sm);
    font-weight: 500;
  }
  .req {
    color: var(--cc-danger);
  }
  .hint {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .error {
    display: flex;
    align-items: center;
    gap: var(--cc-space-1);
    margin: 0;
    color: var(--cc-danger);
    font-size: var(--cc-font-size-sm);
  }
  .error :global(.cc-glyph) {
    width: 1rem;
    height: 1rem;
  }
</style>
