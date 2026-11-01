<!--
  A handful of real components in the current theme, right under the toolbar,
  so the first screen shows the library and not only text about it.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { Badge, Button, Field, Input, Link, Switch, Toaster, toast } from '@codecora/ui';

  let name = $state('ci-deploy');
  let write = $state(true);
</script>

<section class="strip" aria-labelledby="strip-title">
  <h2 id="strip-title" class="title">Live in the current theme</h2>
  <div class="row">
    <div class="name">
      <Field label="Key name">
        {#snippet children(control)}
          <Input {...control} bind:value={name} autocomplete="off" />
        {/snippet}
      </Field>
    </div>
    <Switch bind:checked={write} label="Write access" />
    <Badge tone={write ? 'warning' : 'success'}>{write ? 'Read and write' : 'Read only'}</Badge>
    <Button
      variant="primary"
      onclick={() =>
        toast.success(`${name || 'Key'} saved`, write ? 'Read and write scope.' : 'Read scope.')}
    >
      Save key
    </Button>
  </div>
  <p class="more">
    <Link href={resolve('/components')}>Every component in every state</Link>
  </p>
</section>

<Toaster />

<style>
  .strip {
    display: grid;
    gap: var(--cc-space-3);
    margin-top: var(--cc-space-5);
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
  }
  .title {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: var(--cc-space-3) var(--cc-space-5);
  }
  .name {
    flex: 1 1 12rem;
    max-width: 18rem;
  }
  .row > :global(.cc-badge) {
    align-self: center;
  }
  .more {
    margin: 0;
    font-size: var(--cc-font-size-sm);
  }
</style>
