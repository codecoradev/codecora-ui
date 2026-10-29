<script lang="ts">
  // Themes nest per element: a light document with a dark console beside it,
  // an accent switched on one toolbar, and density switched on the console.
</script>

<div class="split" data-theme="uteke">
  <article class="doc">
    <p class="label">
      <code>data-theme="uteke"</code>
    </p>
    <h3>Field notes, week 43</h3>
    <p>
      The document reads on green paper with ink text. Its toolbar switches the accent to blue
      without leaving the theme.
    </p>
    <div class="toolbar" data-accent="blue">
      <code>data-accent="blue"</code>
      <button type="button" class="action">Share</button>
    </div>
    <button type="button" class="action">Save note</button>
  </article>

  <aside class="console" data-theme="corin" data-density="compact" aria-label="Corin console">
    <p class="label">
      <code>data-theme="corin" data-density="compact"</code>
    </p>
    <h3>Console</h3>
    <ul>
      <li><span class="num">01a18</span> recall · 3 results</li>
      <li><span class="num">01a19</span> remember · stored</li>
      <li class="warn"><span class="num">01a1a</span> quota at 90%</li>
    </ul>
    <button type="button" class="action">Run recall</button>
    <footer data-theme="neutral" data-density="comfortable">
      <code>data-theme="neutral" data-density="comfortable"</code>
      <button type="button" class="action">Open settings</button>
    </footer>
  </aside>
</div>

<style>
  .split {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    overflow: hidden;
  }
  .doc,
  .console {
    display: grid;
    gap: var(--cc-gap);
    align-content: start;
    justify-items: start;
    padding: var(--cc-space-6);
  }
  .label {
    font-size: var(--cc-font-size-xs);
    color: var(--cc-text-muted);
  }
  h3 {
    font-size: var(--cc-font-size-xl);
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-gap);
    align-items: center;
    font-size: var(--cc-font-size-xs);
    color: var(--cc-text-muted);
  }
  .action {
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 0;
    border-radius: var(--cc-radius-md);
    background: var(--cc-accent);
    color: var(--cc-accent-text);
    font: 500 var(--cc-font-size-sm) / 1.5 var(--cc-font-sans);
    cursor: pointer;
  }
  .action:hover {
    background: var(--cc-accent-hover);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    font-size: var(--cc-font-size-sm);
  }
  li {
    padding-block: var(--cc-cell-py);
    border-bottom: 1px solid var(--cc-border);
  }
  li .num {
    color: var(--cc-text-muted);
    margin-inline-end: var(--cc-space-2);
  }
  .warn {
    color: var(--cc-warning);
  }
  footer {
    display: grid;
    gap: var(--cc-gap);
    justify-items: start;
    width: 100%;
    margin-top: var(--cc-space-2);
    padding: var(--cc-space-4);
    border-radius: var(--cc-radius-md);
    font-size: var(--cc-font-size-xs);
    color: var(--cc-text-muted);
  }
</style>
