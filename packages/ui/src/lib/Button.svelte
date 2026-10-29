<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import Icon from './internal/Icon.svelte';
  import Spinner from './Spinner.svelte';
  import type { IconComponent } from './types.js';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

  type Props = {
    variant?: Variant;
    /** Leading icon component. */
    icon?: IconComponent;
    /** Shows a spinner and blocks activation; the button keeps its width. */
    loading?: boolean;
    children: Snippet;
  } & Omit<HTMLButtonAttributes, 'children'> &
    Omit<HTMLAnchorAttributes, 'children' | 'type'>;

  let {
    variant = 'secondary',
    icon,
    loading = false,
    href,
    type = 'button',
    disabled,
    class: className,
    children,
    ...rest
  }: Props = $props();

  const inactive = $derived(disabled || loading);
</script>

<!-- A link styled as a button when href is set; a disabled link drops its href. -->
{#if href !== undefined}
  <a
    {...rest as HTMLAnchorAttributes}
    href={inactive ? undefined : href}
    role={inactive ? 'link' : undefined}
    aria-disabled={inactive || undefined}
    class={['cc-button', `cc-button-${variant}`, className]}
  >
    {#if loading}<Spinner label="Loading" />{:else if icon}<Icon {icon} />{/if}
    {@render children()}
  </a>
{:else}
  <button
    {...rest as HTMLButtonAttributes}
    {type}
    disabled={inactive}
    aria-busy={loading || undefined}
    class={['cc-button', `cc-button-${variant}`, className]}
  >
    {#if loading}<Spinner label="Loading" />{:else if icon}<Icon {icon} />{/if}
    {@render children()}
  </button>
{/if}

<style>
  .cc-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--cc-space-2);
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 1px solid transparent;
    border-radius: var(--cc-radius-md);
    font: inherit;
    font-weight: 500;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition:
      background-color var(--cc-duration-fast) var(--cc-ease-out),
      border-color var(--cc-duration-fast) var(--cc-ease-out);
  }
  .cc-button:focus-visible {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
  }
  .cc-button:is(:disabled, [aria-disabled='true']) {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .cc-button-primary {
    background: var(--cc-accent);
    color: var(--cc-accent-text);
  }
  .cc-button-primary:not(:disabled, [aria-disabled='true']):hover {
    background: var(--cc-accent-hover);
  }
  .cc-button-secondary {
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    border-color: var(--cc-border-strong);
  }
  .cc-button-secondary:not(:disabled, [aria-disabled='true']):hover {
    background: var(--cc-surface-hover);
  }
  .cc-button-ghost {
    background: transparent;
    color: var(--cc-text);
  }
  .cc-button-ghost:not(:disabled, [aria-disabled='true']):hover {
    background: var(--cc-surface-hover);
  }
  .cc-button-danger {
    background: var(--cc-danger);
    color: var(--cc-danger-text);
  }
  .cc-button-danger:not(:disabled, [aria-disabled='true']):hover {
    background: color-mix(in srgb, var(--cc-danger) 88%, var(--cc-text));
  }
</style>
