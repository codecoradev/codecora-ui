<script lang="ts">
  // Plain HTML styled straight from tokens: what the M1 components will build
  // on. Not @codecora/ui components.
  let { id }: { id: string } = $props();

  let query = $state('');
  let pinned = $state(true);
  const rows = ['Release notes for 0.1.0', 'Contrast check for corin', 'Density in tables'];
  let selected = $state(0);

  // The browser's 1 px block padding on buttons and inputs is kept (py-px): preflight removes it.
  const btn =
    'min-h-control px-control-x duration-fast ease-enter disabled:opacity-60 cursor-pointer rounded-md border py-px font-sans text-[length:var(--cc-font-size-sm)] leading-normal font-medium transition-[background-color,scale] not-disabled:active:scale-[var(--cc-press-scale)] disabled:cursor-not-allowed';
  const primary =
    'bg-primary text-primary-foreground not-disabled:hover:bg-primary-hover border-transparent';
  const label = 'text-[length:var(--cc-font-size-sm)] font-medium';
  const input =
    'min-h-control px-control-x bg-card text-foreground font-inherit placeholder:text-muted-foreground rounded-md border py-px';
  const hint = 'text-[length:var(--cc-font-size-xs)]';
  const badge = 'rounded-full px-3 py-1 text-[length:var(--cc-font-size-xs)] font-semibold';
</script>

<div class="grid max-w-160 gap-6">
  <div class="gap-stack flex flex-wrap">
    <button type="button" class="{btn} {primary}">Save changes</button>
    <button type="button" class="{btn} bg-card text-foreground border-input hover:bg-accent"
      >Cancel</button
    >
    <button
      type="button"
      class="{btn} bg-destructive text-destructive-foreground border-transparent">Delete</button
    >
    <button type="button" class="{btn} {primary}" disabled>Saving…</button>
  </div>

  <div class="grid gap-1">
    <label class={label} for="{id}-q">Search memories</label>
    <input
      class="{input} border-input"
      id="{id}-q"
      type="search"
      bind:value={query}
      placeholder="Title, tag or text"
    />
    <span class="{hint} text-muted-foreground">
      {#if query}Searching for “{query}”{:else}Matches titles, tags and full text.{/if}
    </span>
  </div>

  <div class="grid gap-1">
    <label class={label} for="{id}-ns">Namespace</label>
    <input
      class="{input} border-destructive"
      id="{id}-ns"
      value="Team Notes"
      aria-invalid="true"
      aria-describedby="{id}-ns-err"
    />
    <span class="{hint} text-destructive" id="{id}-ns-err"
      >Use lowercase letters, digits and dashes.</span
    >
  </div>

  <label class="flex items-center gap-2 text-[length:var(--cc-font-size-md)] font-normal">
    <!-- The browser's own checkbox margins, which preflight removes. -->
    <input
      class="accent-primary my-0.75 mr-0.75 ml-1 size-4.5"
      type="checkbox"
      bind:checked={pinned}
    />
    Pin to the top of the room
  </label>

  <div class="gap-stack flex flex-wrap" role="list" aria-label="Status badges">
    <span role="listitem" class="{badge} bg-success-soft text-success">Synced</span>
    <span role="listitem" class="{badge} bg-warning-soft text-warning">Quota at 90%</span>
    <span role="listitem" class="{badge} bg-destructive-soft text-destructive">Failed</span>
    <span role="listitem" class="{badge} bg-primary-soft text-foreground">Selected</span>
  </div>

  <ul class="border-border overflow-hidden rounded-md border" aria-label="Selectable rows">
    {#each rows as row, i (row)}
      <li class="border-border not-first:border-t">
        <!-- Selected changes two things: fill and weight. -->
        <button
          type="button"
          class={[
            'min-h-control px-control-x font-inherit text-foreground w-full cursor-pointer border-0 py-px text-start',
            selected === i ? 'bg-primary-soft font-semibold' : 'hover:bg-accent bg-transparent',
          ]}
          aria-pressed={selected === i}
          onclick={() => (selected = i)}
        >
          {row}
        </button>
      </li>
    {/each}
  </ul>
</div>
