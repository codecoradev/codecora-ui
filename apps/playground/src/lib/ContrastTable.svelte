<script lang="ts">
  import { checkTheme, themes, type AccentName, type ThemeName } from '@codecora/tokens';

  let { theme, accent }: { theme: ThemeName; accent?: AccentName } = $props();

  const token = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const results = $derived(checkTheme(themes[theme], accent));
  const failures = $derived(results.filter((r) => !r.pass).length);
</script>

<p class="summary">
  <span class="num">{results.length}</span> pairs checked for {themes[theme].label} with the
  <strong>{accent ?? themes[theme].defaultAccent}</strong> accent:
  {#if failures === 0}
    all meet WCAG 2.2 AA.
  {:else}
    <strong class="fail"><span class="num">{failures}</span> below AA.</strong>
  {/if}
</p>

<div class="scroll">
  <table>
    <thead>
      <tr>
        <th scope="col">Sample</th>
        <th scope="col">Foreground</th>
        <th scope="col">Background</th>
        <th scope="col" class="n">Ratio</th>
        <th scope="col" class="n">Minimum</th>
      </tr>
    </thead>
    <tbody>
      {#each results as r (`${r.fg}/${r.bg}`)}
        <tr>
          <td>
            {#if r.min >= 4.5}
              <span
                class="sample"
                style:color="var(--cc-{token(r.fg)})"
                style:background="var(--cc-{token(r.bg)})">Aa</span
              >
            {:else}
              <!-- A 3:1 pair is a boundary or focus ring, so it is drawn as one, not as text. -->
              <span class="sample" style:background="var(--cc-{token(r.bg)})" aria-hidden="true">
                <span class="ring" style:border-color="var(--cc-{token(r.fg)})"></span>
              </span>
            {/if}
          </td>
          <td><code>{token(r.fg)}</code></td>
          <td><code>{token(r.bg)}</code></td>
          <td class="n num">{r.ratio.toFixed(2)}:1</td>
          <td class="n num">
            {r.min}:1
            {#if !r.pass}<strong class="fail">fails</strong>{/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .summary {
    margin-bottom: var(--cc-space-4);
  }
  .fail {
    color: var(--cc-danger);
  }
  .scroll {
    overflow-x: auto;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--cc-font-size-sm);
  }
  th {
    text-align: start;
    font-weight: 600;
    background: var(--cc-surface-sunken);
    color: var(--cc-text-muted);
  }
  th,
  td {
    padding: var(--cc-cell-py) var(--cc-cell-px);
    border-bottom: 1px solid var(--cc-border);
    white-space: nowrap;
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }
  tbody tr:hover {
    background: var(--cc-surface-hover);
  }
  .n {
    text-align: end;
  }
  .sample {
    display: inline-grid;
    place-items: center;
    width: 2.5rem;
    height: 1.75rem;
    border-radius: var(--cc-radius-sm);
    border: 1px solid var(--cc-border);
    font-weight: 600;
  }
  .ring {
    width: 1.5rem;
    height: 1rem;
    border: 2px solid;
    border-radius: var(--cc-radius-sm);
  }
</style>
