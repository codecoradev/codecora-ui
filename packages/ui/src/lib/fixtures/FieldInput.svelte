<!-- Test fixture: a Field wrapping a real Input through the control props. -->
<script lang="ts">
  import Field from '../Field.svelte';
  import Input from '../Input.svelte';

  let { error, required = false }: { error?: string; required?: boolean } = $props();
</script>

<Field label="Email" description="Work address" {error} {required}>
  {#snippet children(control)}
    <Input {...control} type="email" />
  {/snippet}
</Field>
