<!--
  The memory browser from @codecora/memory over sample data in this page, or
  a live uteke-serve. The sample backends imitate the capabilities of
  uteke-serve, Uteke Cloud and the desktop app, so the same components show
  what each one offers. A key typed here stays in this page's memory.
-->
<script lang="ts">
  import {
    MemoryBrowser,
    MemoryDetail,
    MemoryList,
    createHttpClient,
    createInMemoryClient,
    type BackendKind,
  } from '@codecora/memory';
  import { Alert, Button, Card, Field, Input, RadioGroup } from '@codecora/ui';
  import { sampleMemories, sampleRooms } from './memory-samples.js';

  interface Props {
    /** Theme name for the delete dialog, which renders outside the stage. */
    theme?: string;
  }

  let { theme }: Props = $props();

  const backends = [
    {
      value: 'uteke-serve',
      label: 'Sample: uteke-serve',
      description: 'Every capability, rooms included.',
    },
    {
      value: 'cloud',
      label: 'Sample: Uteke Cloud',
      description: 'Through the portal: rooms, no namespaces, and no New memory.',
    },
    { value: 'tauri', label: 'Sample: desktop app', description: 'The Corin desktop commands.' },
    { value: 'live', label: 'Live uteke-serve', description: 'Connect to a server you run.' },
  ];

  // The Cloud portal has no route to create a memory, so the sample hides New memory too.
  const sample = (kind: BackendKind) =>
    new MemoryBrowser(
      createInMemoryClient({
        kind,
        capabilities: kind === 'cloud' ? { create: false } : {},
        memories: sampleMemories,
        rooms: sampleRooms,
      }),
      { pageSize: 20 },
    );

  let backend = $state('uteke-serve');
  let browser = $state<MemoryBrowser>(sample('uteke-serve'));
  let url = $state('http://127.0.0.1:8767');
  let accessKey = $state('');
  const keyHint = 'The --auth-token of the server; leave it empty when it has none.';
  let connecting = $state(false);
  let failure = $state<string | null>(null);

  function choose(value: string) {
    backend = value;
    failure = null;
    if (value !== 'live') browser = sample(value as BackendKind);
  }

  async function connect(event: SubmitEvent) {
    event.preventDefault();
    connecting = true;
    failure = null;
    try {
      const client = createHttpClient({ baseUrl: url.trim(), apiKey: accessKey || undefined });
      await client.health();
      browser = new MemoryBrowser(client, { pageSize: 20 });
    } catch (cause) {
      failure = cause instanceof Error ? cause.message : 'Could not reach the server.';
    } finally {
      connecting = false;
    }
  }
</script>

<div class="memory-demo">
  <Card>
    {#snippet header()}Backend{/snippet}
    <div class="backend">
      <RadioGroup label="Backend" items={backends} bind:value={() => backend, choose} />
      {#if backend === 'live'}
        <form class="connect" onsubmit={connect}>
          <p class="note">
            Start one with <code>uteke-serve --port 8767 --cors-origin &lt;this site&gt;</code>. The
            key is only kept in this page and is sent as a Bearer header.
          </p>
          <Field label="Server URL" required>
            {#snippet children(control)}
              <Input {...control} type="url" bind:value={url} autocomplete="off" />
            {/snippet}
          </Field>
          <Field label="Access key" description={keyHint}>
            {#snippet children(control)}
              <Input {...control} type="password" bind:value={accessKey} autocomplete="off" />
            {/snippet}
          </Field>
          <div><Button variant="primary" type="submit" loading={connecting}>Connect</Button></div>
          {#if failure}<Alert tone="danger" title="Not connected">{failure}</Alert>{/if}
        </form>
      {/if}
    </div>
  </Card>

  {#key browser}
    <div class="panes">
      <Card><MemoryList {browser} /></Card>
      <div class="detail"><Card><MemoryDetail {browser} {theme} /></Card></div>
    </div>
  {/key}
</div>

<style>
  .memory-demo {
    display: grid;
    gap: var(--cc-space-4);
  }
  .backend {
    display: grid;
    gap: var(--cc-space-4);
  }
  .connect {
    display: grid;
    gap: var(--cc-space-3);
    max-width: 32rem;
  }
  .note {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .panes {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    align-items: start;
    gap: var(--cc-space-4);
  }
  /* The detail stays in view below the sticky appearance toolbar while the list scrolls. */
  .detail {
    position: sticky;
    top: calc(var(--cc-space-16) + var(--cc-space-4));
  }
  @media (max-width: 52rem) {
    .panes {
      grid-template-columns: minmax(0, 1fr);
    }
    .detail {
      position: static;
    }
  }
</style>
