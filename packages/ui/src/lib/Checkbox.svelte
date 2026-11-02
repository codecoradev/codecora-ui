<!-- Checkbox (bits-ui) with its label and optional description; supports a mixed state. -->
<script lang="ts">
  import { Checkbox } from 'bits-ui';
  import Glyph from './internal/Glyph.svelte';

  interface Props {
    label: string;
    /** Keep the label for assistive tech only, for a checkbox in a table row. */
    labelHidden?: boolean;
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
    /** Called with the new state when the user toggles it. */
    onchange?: (checked: boolean) => void;
    'aria-describedby'?: string;
  }

  let {
    label,
    labelHidden = false,
    description,
    checked = $bindable(false),
    indeterminate = $bindable(false),
    name,
    value,
    id,
    invalid = false,
    required = false,
    disabled = false,
    onchange,
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
    onCheckedChange={onchange}
    aria-describedby={described}
    aria-invalid={invalid || undefined}
    class="cc-box"
  >
    {#snippet children({ indeterminate })}
      <!-- The check stays in the DOM while unchecked, hidden, so checking it can animate. -->
      {#if indeterminate}<Glyph name="minus" />{:else}<Glyph name="check" />{/if}
    {/snippet}
  </Checkbox.Root>
  <div class={labelHidden ? 'text hidden' : 'text'}>
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
    padding-block: var(--cc-control-py);
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
    transition:
      background-color var(--cc-duration-fast) var(--cc-ease-out),
      border-color var(--cc-duration-fast) var(--cc-ease-out);
  }
  /* Opacity eases; only the scale springs. Unchecking takes the shorter exit. */
  :global(.cc-box :where(svg)) {
    width: 1rem;
    height: 1rem;
    stroke-width: 3;
    transition:
      opacity var(--cc-duration-fast) var(--cc-ease-out),
      scale var(--cc-duration-slow) var(--cc-ease-spring);
  }
  :global(.cc-box[data-state='unchecked'] :where(svg)) {
    opacity: 0;
    scale: 0.5;
    transition:
      opacity var(--cc-duration-instant) var(--cc-ease-exit),
      scale var(--cc-duration-instant) var(--cc-ease-exit);
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
  .hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
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
  @media (prefers-reduced-motion: reduce) {
    :global(.cc-box),
    :global(.cc-box[data-state] :where(svg)) {
      transition: none;
    }
  }
</style>
