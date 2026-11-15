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

<div
  data-slot="choice"
  class="group/choice min-h-control py-control-y flex items-start gap-3"
  data-disabled={disabled || undefined}
>
  <Switch.Root
    id={controlId}
    bind:checked
    {name}
    {disabled}
    aria-describedby={described}
    data-slot="switch"
    class="border-input bg-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus relative h-6 w-10 flex-none cursor-pointer rounded-full border p-0 data-disabled:cursor-not-allowed data-disabled:opacity-55"
  >
    <Switch.Thumb
      data-slot="switch-thumb"
      class="bg-foreground duration-fast ease-enter data-[state=checked]:bg-primary-foreground ms-0.75 block size-4.5 rounded-full transition-transform data-[state=checked]:translate-x-4"
    />
  </Switch.Root>
  <div class="grid gap-1">
    <label
      for={controlId}
      class="group-data-disabled/choice:text-muted-foreground cursor-pointer group-data-disabled/choice:cursor-not-allowed"
      >{label}</label
    >
    {#if description}<p id={hintId} class="text-muted-foreground m-0 text-sm leading-[inherit]">
        {description}
      </p>{/if}
  </div>
</div>
