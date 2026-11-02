<script lang="ts">
  import { Alert, Button, Field, Input, Select, Textarea } from '@codecora/ui';
  import type { Memory, MemoryDraft } from './types.js';

  interface Props {
    /** The memory to edit; leave it out to write a new one. */
    memory?: Memory | null;
    /** Types offered for a new memory. */
    types?: string[];
    /** Called with the cleaned draft; a thrown error is shown in the form. */
    onsave: (draft: MemoryDraft) => void | Promise<void>;
    oncancel?: () => void;
  }

  let {
    memory = null,
    types = ['fact', 'decision', 'procedure', 'context'],
    onsave,
    oncancel,
  }: Props = $props();

  // A draft: the form starts from the memory and does not follow later changes to it.
  // svelte-ignore state_referenced_locally
  let content = $state(memory?.content ?? '');
  // svelte-ignore state_referenced_locally
  let tagText = $state(memory?.tags.join(', ') ?? '');
  // svelte-ignore state_referenced_locally
  let type = $state(types[0] ?? 'fact');
  let touched = $state(false);
  let saving = $state(false);
  let failure = $state<string | null>(null);

  const contentError = $derived(
    touched && content.trim() === '' ? 'Write what the memory should hold.' : undefined,
  );

  /** Comma or newline separated, trimmed, without blanks or repeats. */
  function parseTags(text: string) {
    return [
      ...new Set(
        text
          .split(/[,\n]/)
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    ];
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    touched = true;
    if (content.trim() === '') return;
    saving = true;
    failure = null;
    try {
      const draft: MemoryDraft = { content: content.trim(), tags: parseTags(tagText) };
      if (!memory) draft.type = type;
      await onsave(draft);
    } catch (cause) {
      failure = cause instanceof Error ? cause.message : 'The memory could not be saved.';
    } finally {
      saving = false;
    }
  }
</script>

<form class="cc-memory-editor" onsubmit={submit} novalidate>
  {#if failure}
    <Alert tone="danger" title="Not saved">{failure}</Alert>
  {/if}

  <Field label="Content" required error={contentError}>
    {#snippet children(control)}
      <Textarea {...control} bind:value={content} rows={6} onblur={() => (touched = true)} />
    {/snippet}
  </Field>

  <Field label="Tags" description="Separate tags with commas, for example project:atlas, auth.">
    {#snippet children(control)}
      <Input {...control} bind:value={tagText} autocomplete="off" spellcheck={false} />
    {/snippet}
  </Field>

  {#if !memory}
    <Field label="Type">
      {#snippet children(control)}
        <Select
          id={control.id}
          aria-describedby={control['aria-describedby']}
          items={types.map((t) => ({ value: t, label: t }))}
          bind:value={type}
        />
      {/snippet}
    </Field>
  {/if}

  <div class="actions">
    {#if oncancel}
      <Button variant="ghost" onclick={oncancel} disabled={saving}>Cancel</Button>
    {/if}
    <Button variant="primary" type="submit" loading={saving} loadingLabel="Saving">
      {memory ? 'Save changes' : 'Save memory'}
    </Button>
  </div>
</form>

<style>
  .cc-memory-editor {
    display: grid;
    gap: var(--cc-space-4);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--cc-space-2);
  }
</style>
