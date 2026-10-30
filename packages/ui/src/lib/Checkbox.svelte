<!-- Checkbox (bits-ui) with its label and optional description; supports a mixed state. -->
<script lang="ts">
  import { Checkbox } from 'bits-ui';
  import Glyph from './internal/Glyph.svelte';

  interface Props {
    label: string;
    description?: string;
    checked?: boolean;
    /** Mixed state, for a parent whose children are partly selected. */
    indeterminate?: boolean;
    name?: string;
    value?: string;
    id?: string;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    'aria-describedby'?: string;
  }

  let {
    label,
    description,
    checked = $bindable(false),
    indeterminate = $bindable(false),
    name,
    value,
    id,
    invalid = false,
    required = false,
    disabled = false,
    'aria-describedby': describedby,
  }: Props = $props();

  const uid = $props.id();
  const controlId = $derived(id ?? `${uid}-box`);
  const hintId = $derived(`${uid}-hint`);
  const described = $derived(
    [description ? hintId : '', describedby].filter(Boolean).join(' ') || undefined,
  );
</script>

<div class="cc-choice" data-disabled={disabled || undefined}>
  <Checkbox.Root
    id={controlId}
    bind:checked
    bind:indeterminate
    {name}
    {value}
    {required}
    {disabled}
    aria-describedby={described}
    aria-invalid={invalid || undefined}
    class="cc-box"
  >
    {#snippet children({ checked, indeterminate })}
      {#if indeterminate}<Glyph name="minus" />{:else if checked}<Glyph name="check" />{/if}
    {/snippet}
  </Checkbox.Root>
  <div class="text">
    <label for={controlId}>{label}</label>
    {#if description}<p id={hintId}>{description}</p>{/if}
  </div>
</div>

<style>
  .cc-choice {
    display: flex;
    align-items: flex-start;
    gap: var(--cc-space-3);
    min-height: var(--cc-control-h);
    padding-block: var(--cc-space-2);
  }
  :global(.cc-box) {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-sm);
    background: var(--cc-surface-raised);
    color: var(--cc-accent-text);
    cursor: pointer;
  }
  :global(.cc-box :where(svg)) {
    width: 1rem;
    height: 1rem;
    stroke-width: 3;
  }
  :global(.cc-box[data-state='checked']),
  :global(.cc-box[data-state='indeterminate']) {
    border-color: var(--cc-accent);
    background: var(--cc-accent);
  }
  :global(.cc-box[aria-invalid='true']) {
    border-color: var(--cc-danger);
    box-shadow: inset 0 0 0 1px var(--cc-danger);
  }
  :global(.cc-box:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  :global(.cc-box[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .text {
    display: grid;
    gap: var(--cc-space-1);
  }
  label {
    cursor: pointer;
  }
  p {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  [data-disabled] label {
    cursor: not-allowed;
    color: var(--cc-text-muted);
  }
</style>
