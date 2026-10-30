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

<section aria-labelledby="c-choice">
  <h2 id="c-choice">Checkbox, Switch, RadioGroup</h2>
  <div class="grid">
    <div class="col">
      <h3>Checkbox</h3>
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
      <p id="terms-error" class="error">Accept the terms to continue.</p>
    </div>
    <div class="col">
      <h3>Switch</h3>
      <Switch label="Email alerts" description="At most one a day." bind:checked={alerts} />
      <Switch label="Off" />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled and on" checked disabled />
    </div>
    <div class="col">
      <h3>RadioGroup</h3>
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

<style>
  section {
    display: grid;
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  h3 {
    margin: 0;
    font-size: var(--cc-font-size-lg);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--cc-space-6);
  }
  .col {
    display: grid;
    align-content: start;
    gap: var(--cc-space-1);
  }
  .error {
    margin: 0;
    color: var(--cc-danger);
    font-size: var(--cc-font-size-sm);
  }
</style>
