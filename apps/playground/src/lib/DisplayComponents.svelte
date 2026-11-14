<!-- Card, Alert, Avatar, Progress, Separator, Kbd, Link and CodeBlock. -->
<script lang="ts">
  import { createModKey } from './platform.svelte.js';
  import { Alert, Avatar, Card, CodeBlock, Kbd, Link, Progress, Separator } from '@codecora/ui';

  const mod = createModKey();
</script>

<section aria-labelledby="c-display" class="grid grid-cols-1 gap-4 pb-10">
  <h2 id="c-display" class="leading-heading text-xl font-bold">
    Card, Alert, Avatar, Progress and friends
  </h2>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(var(--container-2xs),1fr))] items-start gap-4">
    <Card>
      {#snippet header()}Memory plan{/snippet}
      <p class="mb-3">12,480 of 50,000 memories stored. Resets on the 1st.</p>
      <Progress label="Memories" value={12480} max={50000} showValue />
      {#snippet footer()}
        <Link href="https://github.com/codecoradev/codecora-ui" external>Usage details</Link>
      {/snippet}
    </Card>

    <div class="grid gap-2">
      <Alert tone="accent" title="New">Search now matches tags.</Alert>
      <Alert tone="success">Key saved.</Alert>
      <Alert tone="warning" title="Quota">80% of the monthly limit is used.</Alert>
      <Alert tone="danger" title="Could not sync">Check your connection and retry.</Alert>
      <Alert>A neutral note without a title.</Alert>
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <Avatar name="Ada Lovelace" size="sm" />
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" size="lg" />
    <Separator orientation="vertical" />
    <span>Press <Kbd>{mod.value}</Kbd> <Kbd>K</Kbd> to search, <Kbd>Esc</Kbd> to close.</span>
  </div>

  <Separator />

  <CodeBlock
    language="bash"
    code="bun add https://github.com/codecoradev/codecora-ui/releases/download/v0.7.0/codecora-ui-0.6.0.tgz"
  />
</section>
