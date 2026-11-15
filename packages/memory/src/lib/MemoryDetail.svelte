<script lang="ts">
  import {
    Alert,
    Badge,
    Button,
    cn,
    ConfirmDialog,
    EmptyState,
    type ClassValue,
  } from '@codecora/ui';
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
    class?: ClassValue;
  }

  let { browser, theme, level = 2, class: className }: Props = $props();

  const uid = $props.id();
  const title = cn(
    'font-display focus-visible:outline-ring leading-heading focus-visible:outline-focus focus-visible:outline-offset-focus m-0 flex flex-wrap items-center gap-2 text-lg font-bold focus:outline-none focus-visible:outline-solid',
  );
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

<section
  class={cn('cc-memory-detail grid min-w-0 content-start gap-4', className)}
  aria-labelledby="{uid}-title"
>
  {#if browser.mode === 'new'}
    <svelte:element this={`h${level}`} id="{uid}-title" class={title}>New memory</svelte:element>
    <MemoryEditor onsave={saveNew} oncancel={() => browser.cancel()} />
  {:else if !memory}
    <span id="{uid}-title" hidden>Memory</span>
    <EmptyState
      title="No memory selected"
      description="Pick a memory from the list to read, edit or delete it."
      level={level === 2 ? 3 : 4}
    />
  {:else if browser.mode === 'edit'}
    <svelte:element this={`h${level}`} id="{uid}-title" class={title}>Edit memory</svelte:element>
    {#key memory.id}
      <MemoryEditor {memory} onsave={saveEdit} oncancel={() => browser.cancel()} />
    {/key}
  {:else}
    <header class="flex flex-wrap items-center justify-between gap-3">
      <svelte:element
        this={`h${level}`}
        id="{uid}-title"
        class={title}
        tabindex="-1"
        bind:this={heading}
      >
        <span class="capitalize">{memory.memoryType}</span>
        {#if memory.pinned}<Badge tone="accent">Pinned</Badge>{/if}
        {#if memory.deprecated}<Badge tone="warning">Deprecated</Badge>{/if}
      </svelte:element>
      <div class="flex flex-wrap gap-2">
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

    <p class="max-w-measure m-0 leading-normal wrap-anywhere whitespace-pre-wrap">
      {memory.content}
    </p>

    {#if memory.tags.length > 0}
      <ul class="m-0 flex list-none flex-wrap gap-1 p-0" aria-label="Tags">
        {#each memory.tags as tag (tag)}
          <li><Badge>{tag}</Badge></li>
        {/each}
      </ul>
    {/if}

    <dl
      class="border-border [&_dt]:text-muted-foreground m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*40)),1fr))] gap-3 border-t pt-4 [&_dd]:m-0 [&_dd]:tabular-nums [&_dt]:text-xs [&_dt]:leading-[inherit]"
    >
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
        <dd class="font-mono text-xs leading-[inherit] wrap-anywhere">{memory.id}</dd>
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
