<script lang="ts">
  import { fontSize, space } from '@codecora/tokens';

  const radii = ['sm', 'md', 'lg', 'pill'] as const;
</script>

<div class="scales">
  <section aria-labelledby="sc-type">
    <h3 id="sc-type">Type scale</h3>
    <ul class="type">
      {#each Object.entries(fontSize).reverse() as [step, size] (step)}
        <li>
          <span class="meta"><code>{step}</code> <span class="num">{size}</span></span>
          <span class="specimen" style:font-size="var(--cc-font-size-{step})">Memories, kept</span>
        </li>
      {/each}
    </ul>
    <p class="mono-line">
      Mono, tabular: <span class="num">0123456789 · 2026-10-29 · 4.92:1</span>
    </p>
  </section>

  <section aria-labelledby="sc-radius">
    <h3 id="sc-radius">Radius</h3>
    <ul class="radius">
      {#each radii as r (r)}
        <li>
          <span class="box" style:border-radius="var(--cc-radius-{r})" aria-hidden="true"></span>
          <code>{r}</code>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="sc-space">
    <h3 id="sc-space">Spacing</h3>
    <ul class="space">
      {#each Object.entries(space) as [step, size] (step)}
        <li>
          <code>{step}</code>
          <span class="bar" style:width="var(--cc-space-{step})" aria-hidden="true"></span>
          <span class="num">{size}</span>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .scales {
    display: grid;
    gap: var(--cc-space-8);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  }
  section {
    display: grid;
    gap: var(--cc-space-3);
    align-content: start;
  }
  h3 {
    font-size: var(--cc-font-size-sm);
    color: var(--cc-text-muted);
    font-family: var(--cc-font-sans);
    font-weight: 600;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--cc-space-2);
  }
  .type li {
    display: grid;
    gap: var(--cc-space-1);
  }
  .meta {
    font-size: var(--cc-font-size-xs);
    color: var(--cc-text-muted);
  }
  .specimen {
    font-family: var(--cc-font-display);
    line-height: var(--cc-leading-tight);
  }
  .mono-line {
    font-size: var(--cc-font-size-sm);
    color: var(--cc-text-muted);
  }
  .radius {
    grid-template-columns: repeat(4, auto);
    justify-content: start;
    gap: var(--cc-space-4);
  }
  .radius li {
    display: grid;
    gap: var(--cc-space-2);
    justify-items: center;
  }
  .box {
    width: 3.5rem;
    height: 3.5rem;
    background: var(--cc-surface-sunken);
    border: 1px solid var(--cc-border-strong);
  }
  .space li {
    display: grid;
    grid-template-columns: 2rem auto 1fr;
    gap: var(--cc-space-3);
    align-items: center;
    font-size: var(--cc-font-size-sm);
  }
  .bar {
    height: 0.75rem;
    background: var(--cc-accent);
    border-radius: var(--cc-radius-sm);
  }
  .space .num {
    color: var(--cc-text-muted);
  }
</style>
