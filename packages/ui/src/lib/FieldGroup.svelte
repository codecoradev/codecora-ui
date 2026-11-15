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

<fieldset class="cc-fieldgroup m-0 grid min-w-0 gap-1 border-0 p-0" aria-describedby={describedby}>
  <legend class="mb-1 p-0 text-[length:var(--cc-font-size-sm)] font-medium">
    {legend}{#if required}<span class="text-destructive" aria-hidden="true"> *</span>{/if}
  </legend>
  {#if description}<p
      id="{uid}-hint"
      class="text-muted-foreground m-0 text-[length:var(--cc-font-size-sm)]"
    >
      {description}
    </p>{/if}
  {@render children({ 'aria-describedby': describedby, invalid: Boolean(error), required })}
  {#if error}
    <p
      id="{uid}-error"
      class="error text-destructive m-0 flex items-center gap-1 text-[length:var(--cc-font-size-sm)] [--cc-icon-size:var(--cc-space-4)]"
    >
      <Glyph name="alert" /><VisuallyHidden>Error:</VisuallyHidden>
      {error}
    </p>
  {/if}
</fieldset>
