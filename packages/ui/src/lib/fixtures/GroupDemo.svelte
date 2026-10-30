<script lang="ts">
  import FieldGroup from '../FieldGroup.svelte';
  import RadioGroup from '../RadioGroup.svelte';

  let { error }: { error?: string } = $props();
</script>

<FieldGroup legend="Digest" description="How often we email you." {error} required>
  {#snippet children(group)}
    <RadioGroup
      label="Digest"
      items={[
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
      ]}
      {...group}
    />
  {/snippet}
</FieldGroup>
