<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  interface Props extends HTMLTextareaAttributes {
    value?: string | null;
    invalid?: boolean;
  }

  let { value = $bindable(), invalid = false, class: className, ...rest }: Props = $props();
</script>

<textarea
  rows="4"
  {...rest}
  bind:value
  aria-invalid={invalid || undefined}
  class={['cc-textarea', className]}></textarea>

<style>
  .cc-textarea {
    width: 100%;
    min-height: calc(var(--cc-control-h) * 2);
    padding: var(--cc-space-2) var(--cc-control-px);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font: inherit;
    line-height: var(--cc-leading-normal);
    resize: vertical;
  }
  .cc-textarea::placeholder {
    color: var(--cc-text-muted);
  }
  .cc-textarea:focus-visible {
    outline: 2px solid var(--cc-focus);
    outline-offset: 1px;
  }
  .cc-textarea:disabled {
    background: var(--cc-surface-sunken);
    cursor: not-allowed;
  }
  .cc-textarea[aria-invalid='true'] {
    border-color: var(--cc-danger);
    box-shadow: inset 0 0 0 1px var(--cc-danger);
  }
</style>
