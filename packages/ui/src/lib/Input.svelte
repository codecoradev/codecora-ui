<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'value'> {
    value?: string | number | null;
    invalid?: boolean;
  }

  let { value = $bindable(), invalid = false, class: className, ...rest }: Props = $props();
</script>

<input {...rest} bind:value aria-invalid={invalid || undefined} class={['cc-input', className]} />

<style>
  .cc-input {
    width: 100%;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font: inherit;
  }
  .cc-input::placeholder {
    color: var(--cc-text-muted);
  }
  .cc-input:focus-visible {
    outline: 2px solid var(--cc-focus);
    outline-offset: 1px;
  }
  .cc-input:disabled {
    background: var(--cc-surface-sunken);
    cursor: not-allowed;
  }
  .cc-input[aria-invalid='true'] {
    border-color: var(--cc-danger);
  }
</style>
