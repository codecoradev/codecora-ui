<!-- On/off switch (bits-ui) for a setting that applies at once; use Checkbox when a form submits it. -->
<script lang="ts">
  import { Switch } from 'bits-ui';

  interface Props {
    label: string;
    description?: string;
    checked?: boolean;
    name?: string;
    id?: string;
    disabled?: boolean;
    'aria-describedby'?: string;
  }

  let {
    label,
    description,
    checked = $bindable(false),
    name,
    id,
    disabled = false,
    'aria-describedby': describedby,
  }: Props = $props();

  const uid = $props.id();
  const controlId = $derived(id ?? `${uid}-switch`);
  const hintId = $derived(`${uid}-hint`);
  const described = $derived(
    [description ? hintId : '', describedby].filter(Boolean).join(' ') || undefined,
  );
</script>

<div class="cc-choice" data-disabled={disabled || undefined}>
  <Switch.Root
    id={controlId}
    bind:checked
    {name}
    {disabled}
    aria-describedby={described}
    class="cc-switch"
  >
    <Switch.Thumb class="cc-switch-thumb" />
  </Switch.Root>
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
  :global(.cc-switch) {
    position: relative;
    flex: none;
    width: 2.5rem;
    height: 1.5rem;
    padding: 0;
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-surface-sunken);
    cursor: pointer;
  }
  :global(.cc-switch[data-state='checked']) {
    border-color: var(--cc-accent);
    background: var(--cc-accent);
  }
  :global(.cc-switch:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  :global(.cc-switch[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  :global(.cc-switch-thumb) {
    display: block;
    width: 1.125rem;
    height: 1.125rem;
    margin-inline-start: 0.1875rem;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-text);
    transition: transform var(--cc-duration-fast) var(--cc-ease-out);
  }
  :global(.cc-switch[data-state='checked'] .cc-switch-thumb) {
    transform: translateX(1rem);
    background: var(--cc-accent-text);
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
