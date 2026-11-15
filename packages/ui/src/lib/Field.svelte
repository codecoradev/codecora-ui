<!--
  Label, control, hint and error as one unit. The control is rendered by the
  caller and gets the ids it needs:

    <Field label="Email" error={err}>
      {#snippet children(control)}<Input type="email" {...control} />{/snippet}
    </Field>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Glyph from './internal/Glyph.svelte';
  import VisuallyHidden from './VisuallyHidden.svelte';

  interface ControlProps {
    id: string;
    'aria-describedby': string | undefined;
    invalid: boolean;
    required: boolean;
  }

  interface Props {
    label: string;
    description?: string;
    /** A message marks the field invalid and is announced with the control. */
    error?: string;
    required?: boolean;
    children: Snippet<[ControlProps]>;
  }

  let { label, description, error, required = false, children }: Props = $props();

  const uid = $props.id();
  const id = `${uid}-control`;
  const describedby = $derived(
    [description ? `${uid}-hint` : '', error ? `${uid}-error` : ''].filter(Boolean).join(' ') ||
      undefined,
  );
</script>

<div class="cc-field grid gap-1">
  <label for={id} class="text-sm leading-[inherit] font-medium">
    {label}{#if required}<span class="text-destructive" aria-hidden="true"> *</span>{/if}
  </label>
  {@render children({ id, 'aria-describedby': describedby, invalid: Boolean(error), required })}
  {#if description}<p id="{uid}-hint" class="text-muted-foreground m-0 text-sm leading-[inherit]">
      {description}
    </p>{/if}
  {#if error}
    <!-- The glyph is 1em: the icon size follows the text, nudged onto the first line. -->
    <p
      id="{uid}-error"
      class="error animate-error-in text-destructive m-0 flex items-start gap-1 text-sm leading-[inherit] [--cc-icon-size:var(--text-sm)] motion-reduce:animate-none [&_.cc-glyph]:mt-[calc(0.15*var(--text-sm))]"
    >
      <Glyph name="alert" /><VisuallyHidden>Error:</VisuallyHidden>
      {error}
    </p>
  {/if}
</div>
