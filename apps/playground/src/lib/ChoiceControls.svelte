<!-- Checkbox, Switch and RadioGroup in every state they can be in. -->
<script lang="ts">
  import { Checkbox, RadioGroup, Switch } from '@codecora/ui';

  let receipt = $state(true);
  let all = $state(false);
  let mixed = $state(true);
  let alerts = $state(true);
  let digest = $state('weekly');

  const digests = [
    { value: 'daily', label: 'Daily', description: 'A summary every morning.' },
    { value: 'weekly', label: 'Weekly', description: 'Mondays, 09:00.' },
    { value: 'never', label: 'Never', disabled: true },
  ];
</script>

<section aria-labelledby="c-choice" class="grid grid-cols-1 gap-4 pb-10">
  <h2 id="c-choice" class="leading-heading text-xl font-bold">Checkbox, Switch, RadioGroup</h2>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*56),1fr))] gap-6">
    <div class="grid content-start gap-1">
      <h3 class="leading-heading text-lg font-bold">Checkbox</h3>
      <Checkbox
        label="Send me a receipt"
        description="Emailed after each payment."
        bind:checked={receipt}
      />
      <Checkbox label="All keys" bind:checked={all} bind:indeterminate={mixed} />
      <Checkbox label="Unchecked" />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" checked disabled />
      <Checkbox label="I accept the terms" invalid aria-describedby="terms-error" required />
      <p id="terms-error" class="text-destructive text-sm leading-[inherit]">
        Accept the terms to continue.
      </p>
    </div>
    <div class="grid content-start gap-1">
      <h3 class="leading-heading text-lg font-bold">Switch</h3>
      <Switch label="Email alerts" description="At most one a day." bind:checked={alerts} />
      <Switch label="Off" />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled and on" checked disabled />
    </div>
    <div class="grid content-start gap-1">
      <h3 class="leading-heading text-lg font-bold">RadioGroup</h3>
      <RadioGroup label="Digest" items={digests} bind:value={digest} />
      <RadioGroup
        label="Layout"
        orientation="horizontal"
        items={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
        ]}
        value="list"
      />
    </div>
  </div>
</section>
