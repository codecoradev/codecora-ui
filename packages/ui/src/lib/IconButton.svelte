<!-- A button with an icon and no visible text; `label` is its accessible name and tooltip-free title. -->
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import Icon from './internal/Icon.svelte';
  import type { IconComponent } from './types.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    icon: IconComponent;
    /** Required accessible name, for example "Close". */
    label: string;
    variant?: 'secondary' | 'ghost' | 'danger';
  }

  let {
    icon,
    label,
    variant = 'ghost',
    type = 'button',
    class: className,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  {type}
  aria-label={label}
  class={['cc-icon-button', `cc-icon-button-${variant}`, className]}
>
  <Icon {icon} />
</button>

<style>
  .cc-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--cc-control-h);
    height: var(--cc-control-h);
    padding: 0;
    border: 1px solid transparent;
    border-radius: var(--cc-radius-md);
    cursor: pointer;
    transition: background-color var(--cc-duration-fast) var(--cc-ease-out);
  }
  .cc-icon-button:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .cc-icon-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .cc-icon-button-ghost {
    background: transparent;
    color: var(--cc-text);
  }
  .cc-icon-button-secondary {
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    border-color: var(--cc-border-strong);
  }
  .cc-icon-button-danger {
    background: transparent;
    color: var(--cc-danger);
  }
  .cc-icon-button:not(:disabled):hover {
    background: var(--cc-surface-hover);
  }
</style>
