<script lang="ts">
  // Themes nest per element: a light document with a dark console beside it,
  // an accent switched on one toolbar, and density switched on the console.
  const pane = 'gap-stack grid content-start justify-items-start p-6';
  const label = 'text-muted-foreground text-[length:var(--cc-font-size-xs)]';
  const h3 = 'text-[length:var(--cc-font-size-xl)] font-bold';
  const action =
    'min-h-control px-control-x bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer rounded-md border-0 py-px font-sans text-[length:var(--cc-font-size-sm)] leading-normal font-medium';
  const line = 'py-cell-y border-border border-b';
  const num = 'text-muted-foreground me-2 font-mono tabular-nums';
</script>

<div
  class="border-border grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--container-xs)),1fr))] overflow-hidden rounded-lg border"
  data-theme="uteke"
>
  <article class={pane}>
    <p class={label}>
      <code>data-theme="uteke"</code>
    </p>
    <h3 class={h3}>Field notes, week 43</h3>
    <p>
      The document reads on green paper with ink text. Its toolbar switches the accent to blue
      without leaving the theme.
    </p>
    <div
      class="gap-stack text-muted-foreground flex flex-wrap items-center text-[length:var(--cc-font-size-xs)]"
      data-accent="blue"
    >
      <code>data-accent="blue"</code>
      <button type="button" class={action}>Share</button>
    </div>
    <button type="button" class={action}>Save note</button>
  </article>

  <aside class={pane} data-theme="corin" data-density="compact" aria-label="Corin console">
    <p class={label}>
      <code>data-theme="corin" data-density="compact"</code>
    </p>
    <h3 class={h3}>Console</h3>
    <ul class="w-full text-[length:var(--cc-font-size-sm)]">
      <li class={line}><span class={num}>01a18</span> recall · 3 results</li>
      <li class={line}><span class={num}>01a19</span> remember · stored</li>
      <li class="{line} text-warning"><span class={num}>01a1a</span> quota at 90%</li>
    </ul>
    <button type="button" class={action}>Run recall</button>
    <footer
      class="gap-stack text-muted-foreground mt-2 grid w-full justify-items-start rounded-md p-4 text-[length:var(--cc-font-size-xs)]"
      data-theme="neutral"
      data-density="comfortable"
    >
      <code>data-theme="neutral" data-density="comfortable"</code>
      <button type="button" class={action}>Open settings</button>
    </footer>
  </aside>
</div>
