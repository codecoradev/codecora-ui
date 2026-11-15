<!-- Combobox, Slider and FieldGroup. -->
<script lang="ts">
  import { Combobox, Field, FieldGroup, RadioGroup, Slider } from '@codecora/ui';

  let region = $state('');
  let retention = $state(30);
  let digest = $state('');

  const regions = [
    { value: 'eu', label: 'Europe (Frankfurt)' },
    { value: 'us', label: 'United States (Virginia)' },
    { value: 'ap', label: 'Asia Pacific (Singapore)' },
    { value: 'sa', label: 'South America (São Paulo)', disabled: true },
  ];
</script>

<section aria-labelledby="c-inputs" class="grid grid-cols-1 gap-4 pb-10">
  <h2 id="c-inputs" class="leading-heading text-xl font-bold">Combobox, Slider, FieldGroup</h2>
  <div class="grid max-w-md gap-4">
    <Field label="Region" description="Type to filter.">
      {#snippet children(control)}
        <Combobox {...control} items={regions} bind:value={region} />
      {/snippet}
    </Field>
    <Field label="Region (invalid)" error="Choose a region to continue.">
      {#snippet children(control)}
        <Combobox {...control} items={regions} value="" />
      {/snippet}
    </Field>
    <Slider
      label="Retention"
      bind:value={retention}
      min={7}
      max={90}
      step={1}
      showValue
      format={(v) => `${v} days`}
    />
    <FieldGroup legend="Digest" description="How often we email you." required>
      {#snippet children(group)}
        <RadioGroup
          label="Digest"
          items={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
          bind:value={digest}
          {...group}
        />
      {/snippet}
    </FieldGroup>
  </div>
</section>
