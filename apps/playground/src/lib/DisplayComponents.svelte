<!-- Card, Alert, Avatar, Progress, Separator, Kbd, Link and CodeBlock. -->
<script lang="ts">
  import { Alert, Avatar, Card, CodeBlock, Kbd, Link, Progress, Separator } from '@codecora/ui';
</script>

<section aria-labelledby="c-display">
  <h2 id="c-display">Card, Alert, Avatar, Progress and friends</h2>

  <div class="grid">
    <Card>
      {#snippet header()}Memory plan{/snippet}
      <p class="plain">12,480 of 50,000 memories stored. Resets on the 1st.</p>
      <Progress label="Memories" value={12480} max={50000} showValue />
      {#snippet footer()}
        <Link href="https://github.com/codecoradev/codecora-ui" external>Usage details</Link>
      {/snippet}
    </Card>

    <div class="stack">
      <Alert tone="accent" title="New">Search now matches tags.</Alert>
      <Alert tone="success">Key saved.</Alert>
      <Alert tone="warning" title="Quota">80% of the monthly limit is used.</Alert>
      <Alert tone="danger" title="Could not sync">Check your connection and retry.</Alert>
      <Alert>A neutral note without a title.</Alert>
    </div>
  </div>

  <div class="row">
    <Avatar name="Ada Lovelace" size="sm" />
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" size="lg" />
    <Separator orientation="vertical" />
    <span>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, <Kbd>Esc</Kbd> to close.</span>
  </div>

  <Separator />

  <CodeBlock
    language="bash"
    code="bun add https://github.com/codecoradev/codecora-ui/releases/download/v0.1.0/codecora-ui-0.1.0.tgz"
  />
</section>

<style>
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: var(--cc-space-4);
    align-items: start;
  }
  .stack {
    display: grid;
    gap: var(--cc-space-2);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-3);
  }
  .plain {
    margin: 0 0 var(--cc-space-3);
  }
</style>
