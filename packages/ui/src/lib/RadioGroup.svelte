<!-- Single choice from a short list (bits-ui): arrow keys move and select. Give it a `label`. -->
<script lang="ts">
  import { RadioGroup } from 'bits-ui';

  interface Item {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }

  interface Props {
    items: Item[];
    /** Names the group for assistive tech; shown by the Field legend when used in one. */
    label: string;
    value?: string;
    name?: string;
    orientation?: 'vertical' | 'horizontal';
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    'aria-describedby'?: string;
  }

  let {
    items,
    label,
    value = $bindable(''),
    name,
    orientation = 'vertical',
    invalid = false,
    required = false,
    disabled = false,
    'aria-describedby': describedby,
  }: Props = $props();

  const uid = $props.id();
</script>

<RadioGroup.Root
  bind:value
  {name}
  {orientation}
  {required}
  {disabled}
  aria-label={label}
  aria-describedby={describedby}
  aria-invalid={invalid || undefined}
  class={['cc-radios', `cc-radios-${orientation}`]}
>
  {#each items as item (item.value)}
    <div class="cc-choice" data-disabled={disabled || item.disabled || undefined}>
      <RadioGroup.Item
        id="{uid}-{item.value}"
        value={item.value}
        disabled={item.disabled}
        aria-describedby={item.description ? `${uid}-${item.value}-hint` : undefined}
        class="cc-radio"
      >
        {#snippet children({ checked })}
          {#if checked}<span class="dot"></span>{/if}
        {/snippet}
      </RadioGroup.Item>
      <div class="text">
        <label for="{uid}-{item.value}">{item.label}</label>
        {#if item.description}<p id="{uid}-{item.value}-hint">{item.description}</p>{/if}
      </div>
    </div>
  {/each}
</RadioGroup.Root>

<style>
  :global(.cc-radios) {
    display: flex;
    gap: var(--cc-space-1) var(--cc-space-6);
  }
  :global(.cc-radios-vertical) {
    flex-direction: column;
  }
  :global(.cc-radios-horizontal) {
    flex-flow: row wrap;
  }
  .cc-choice {
    display: flex;
    align-items: flex-start;
    gap: var(--cc-space-3);
    min-height: var(--cc-control-h);
    padding-block: var(--cc-space-2);
  }
  :global(.cc-radio) {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-surface-raised);
    cursor: pointer;
  }
  :global(.cc-radio[data-state='checked']) {
    border-color: var(--cc-accent);
  }
  :global(.cc-radios[aria-invalid='true'] .cc-radio) {
    border-color: var(--cc-danger);
    box-shadow: inset 0 0 0 1px var(--cc-danger);
  }
  :global(.cc-radio:focus-visible) {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  :global(.cc-radio[data-disabled]) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-accent);
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
