<script lang="ts">
  // Plain HTML styled straight from tokens: what the M1 components will build
  // on. Not @codecora/ui components.
  let { id }: { id: string } = $props();

  let query = $state('');
  let pinned = $state(true);
  const rows = ['Release notes for 0.1.0', 'Contrast check for corin', 'Density in tables'];
  let selected = $state(0);
</script>

<div class="samples">
  <div class="row">
    <button type="button" class="btn primary">Save changes</button>
    <button type="button" class="btn secondary">Cancel</button>
    <button type="button" class="btn danger">Delete</button>
    <button type="button" class="btn primary" disabled>Saving…</button>
  </div>

  <div class="field">
    <label for="{id}-q">Search memories</label>
    <input id="{id}-q" type="search" bind:value={query} placeholder="Title, tag or text" />
    <span class="hint">
      {#if query}Searching for “{query}”{:else}Matches titles, tags and full text.{/if}
    </span>
  </div>

  <div class="field error">
    <label for="{id}-ns">Namespace</label>
    <input id="{id}-ns" value="Team Notes" aria-invalid="true" aria-describedby="{id}-ns-err" />
    <span class="hint" id="{id}-ns-err">Use lowercase letters, digits and dashes.</span>
  </div>

  <label class="check">
    <input type="checkbox" bind:checked={pinned} />
    Pin to the top of the room
  </label>

  <div class="row" role="list" aria-label="Status badges">
    <span role="listitem" class="badge success">Synced</span>
    <span role="listitem" class="badge warning">Quota at 90%</span>
    <span role="listitem" class="badge danger">Failed</span>
    <span role="listitem" class="badge accent">Selected</span>
  </div>

  <ul class="list" aria-label="Selectable rows">
    {#each rows as row, i (row)}
      <li>
        <button
          type="button"
          class:selected={selected === i}
          aria-pressed={selected === i}
          onclick={() => (selected = i)}
        >
          {row}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .samples {
    display: grid;
    gap: var(--cc-space-6);
    max-width: 40rem;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-gap);
  }
  .btn {
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border-radius: var(--cc-radius-md);
    border: 1px solid transparent;
    font: 500 var(--cc-font-size-sm) / 1.5 var(--cc-font-sans);
    cursor: pointer;
    transition:
      background-color var(--cc-duration-fast) var(--cc-ease-out),
      transform var(--cc-duration-fast) var(--cc-ease-out);
  }
  .btn:active:not(:disabled) {
    transform: scale(0.98);
  }
  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .primary {
    background: var(--cc-accent);
    color: var(--cc-accent-text);
  }
  .primary:hover:not(:disabled) {
    background: var(--cc-accent-hover);
  }
  .secondary {
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    border-color: var(--cc-border-strong);
  }
  .secondary:hover {
    background: var(--cc-surface-hover);
  }
  .danger {
    background: var(--cc-danger);
    color: var(--cc-danger-text);
  }
  .field {
    display: grid;
    gap: var(--cc-space-1);
  }
  label {
    font-size: var(--cc-font-size-sm);
    font-weight: 500;
  }
  input:not([type='checkbox']) {
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font: inherit;
  }
  input::placeholder {
    color: var(--cc-text-muted);
  }
  .hint {
    font-size: var(--cc-font-size-xs);
    color: var(--cc-text-muted);
  }
  .error input {
    border-color: var(--cc-danger);
  }
  .error .hint {
    color: var(--cc-danger);
  }
  .check {
    display: flex;
    gap: var(--cc-space-2);
    align-items: center;
    font-weight: 400;
    font-size: var(--cc-font-size-md);
  }
  .check input {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--cc-accent);
  }
  .badge {
    padding: var(--cc-space-1) var(--cc-space-3);
    border-radius: var(--cc-radius-pill);
    font-size: var(--cc-font-size-xs);
    font-weight: 600;
  }
  .badge.success {
    background: var(--cc-success-soft);
    color: var(--cc-success);
  }
  .badge.warning {
    background: var(--cc-warning-soft);
    color: var(--cc-warning);
  }
  .badge.danger {
    background: var(--cc-danger-soft);
    color: var(--cc-danger);
  }
  .badge.accent {
    background: var(--cc-accent-soft);
    color: var(--cc-text);
  }
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    overflow: hidden;
  }
  .list li + li {
    border-top: 1px solid var(--cc-border);
  }
  .list button {
    width: 100%;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    text-align: start;
    background: transparent;
    color: var(--cc-text);
    border: 0;
    font: inherit;
    cursor: pointer;
  }
  .list button:hover {
    background: var(--cc-surface-hover);
  }
  /* Selected changes two things: fill and weight. */
  .list button.selected {
    background: var(--cc-accent-soft);
    font-weight: 600;
  }
</style>
