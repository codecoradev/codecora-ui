<script lang="ts">
  import { Alert, Badge, Button, ConfirmDialog, EmptyState } from '@codecora/ui';
  import type { MemoryBrowser } from './browser.svelte.js';
  import { formatDate } from './format.js';
  import MemoryEditor from './MemoryEditor.svelte';
  import type { MemoryDraft } from './types.js';

  interface Props {
    browser: MemoryBrowser;
    /** Theme name for the delete dialog, which renders in a portal outside the page frame. */
    theme?: string;
    /** Heading level, so the pane fits the page outline. */
    level?: 2 | 3;
  }

  let { browser, theme, level = 2 }: Props = $props();

  const uid = $props.id();
  const memory = $derived(browser.selected);
  const caps = $derived(browser.capabilities);

  let confirming = $state(false);
  let pinning = $state(false);
  let failure = $state<string | null>(null);
  let heading = $state<HTMLElement>();

  // A new selection or mode starts without the last error.
  $effect(() => {
    void browser.selectedId;
    void browser.mode;
    failure = null;
  });

  async function act(run: () => Promise<unknown>) {
    failure = null;
    try {
      await run();
    } catch (cause) {
      failure = cause instanceof Error ? cause.message : 'That did not work.';
    }
  }

  async function togglePin() {
    if (!memory) return;
    pinning = true;
    await act(() => browser.pin(memory.id, !memory.pinned));
    pinning = false;
  }

  async function saveEdit(draft: MemoryDraft) {
    if (!memory) return;
    await browser.update(memory.id, { content: draft.content, tags: draft.tags });
    heading?.focus();
  }

  async function saveNew(draft: MemoryDraft) {
    await browser.remember({
      content: draft.content,
      tags: draft.tags,
      type: draft.type,
      author: 'human',
    });
    heading?.focus();
  }

  async function forget() {
    if (!memory) return;
    // ConfirmDialog keeps itself open and shows nothing if this throws, so report it here.
    await act(() => browser.forget(memory.id));
  }
</script>

<section class="cc-memory-detail" aria-labelledby="{uid}-title">
  {#if browser.mode === 'new'}
    <svelte:element this={`h${level}`} id="{uid}-title" class="title">New memory</svelte:element>
    <MemoryEditor onsave={saveNew} oncancel={() => browser.cancel()} />
  {:else if !memory}
    <span id="{uid}-title" hidden>Memory</span>
    <EmptyState
      title="No memory selected"
      description="Pick a memory from the list to read, edit or delete it."
      level={level === 2 ? 3 : 4}
    />
  {:else if browser.mode === 'edit'}
    <svelte:element this={`h${level}`} id="{uid}-title" class="title">Edit memory</svelte:element>
    {#key memory.id}
      <MemoryEditor {memory} onsave={saveEdit} oncancel={() => browser.cancel()} />
    {/key}
  {:else}
    <header>
      <svelte:element
        this={`h${level}`}
        id="{uid}-title"
        class="title"
        tabindex="-1"
        bind:this={heading}
      >
        <span class="type">{memory.memoryType}</span>
        {#if memory.pinned}<Badge tone="accent">Pinned</Badge>{/if}
        {#if memory.deprecated}<Badge tone="warning">Deprecated</Badge>{/if}
      </svelte:element>
      <div class="actions">
        {#if caps.pin}
          <Button loading={pinning} loadingLabel="Saving" onclick={togglePin}>
            {memory.pinned ? 'Unpin' : 'Pin'}
          </Button>
        {/if}
        {#if caps.update}
          <Button onclick={() => browser.edit()}>Edit</Button>
        {/if}
        <Button variant="danger" onclick={() => (confirming = true)}>Delete</Button>
      </div>
    </header>

    {#if failure}
      <Alert tone="danger" title="That did not work">{failure}</Alert>
    {/if}

    <p class="content">{memory.content}</p>

    {#if memory.tags.length > 0}
      <ul class="tags" aria-label="Tags">
        {#each memory.tags as tag (tag)}
          <li><Badge>{tag}</Badge></li>
        {/each}
      </ul>
    {/if}

    <dl class="facts">
      {#if caps.namespaces === 'full'}
        <div>
          <dt>Namespace</dt>
          <dd>{memory.namespace}</dd>
        </div>
      {/if}
      <div>
        <dt>Importance</dt>
        <dd>{memory.importance.toFixed(2)}</dd>
      </div>
      <div>
        <dt>Created</dt>
        <dd>{formatDate(memory.createdAt, true)}</dd>
      </div>
      {#if memory.updatedAt && memory.updatedAt !== memory.createdAt}
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(memory.updatedAt, true)}</dd>
        </div>
      {/if}
      <div>
        <dt>Recalled</dt>
        <dd>{memory.recallCount} times</dd>
      </div>
      <div>
        <dt>ID</dt>
        <dd class="id">{memory.id}</dd>
      </div>
    </dl>

    <ConfirmDialog
      bind:open={confirming}
      {theme}
      tone="danger"
      title="Delete this memory?"
      description="It is removed from every search and recall. This cannot be undone."
      confirmLabel="Delete memory"
      onconfirm={forget}
    />
  {/if}
</section>

<style>
  .cc-memory-detail {
    display: grid;
    align-content: start;
    gap: var(--cc-space-4);
    min-width: 0;
  }
  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
  }
  .title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-2);
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
  }
  .type {
    text-transform: capitalize;
  }
  .title:focus {
    outline: none;
  }
  .title:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  .content {
    margin: 0;
    max-width: 72ch;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: var(--cc-leading-normal);
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
    gap: var(--cc-space-3);
    margin: 0;
    padding-top: var(--cc-space-4);
    border-top: 1px solid var(--cc-border);
  }
  dt {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
  }
  dd {
    margin: 0;
    font-variant-numeric: tabular-nums;
  }
  .id {
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-xs);
    overflow-wrap: anywhere;
  }
</style>
