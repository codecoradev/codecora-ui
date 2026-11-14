<script lang="ts">
  import { fontSize, space } from '@codecora/tokens';

  const radii = ['sm', 'md', 'lg', 'pill'] as const;

  const section = 'grid content-start gap-3';
  const h3 = 'text-muted-foreground font-sans text-[length:var(--cc-font-size-sm)] font-semibold';
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--container-2xs)),1fr))] gap-8">
  <section aria-labelledby="sc-type" class={section}>
    <h3 id="sc-type" class={h3}>Type scale</h3>
    <ul class="grid gap-2">
      {#each Object.entries(fontSize).reverse() as [step, size] (step)}
        <li class="grid gap-1">
          <span class="text-muted-foreground text-[length:var(--cc-font-size-xs)]"
            ><code>{step}</code> <span class="font-mono tabular-nums">{size}</span></span
          >
          <span
            class="font-display leading-[var(--cc-leading-tight)]"
            style:font-size="var(--cc-font-size-{step})">Memories, kept</span
          >
        </li>
      {/each}
    </ul>
    <p class="text-muted-foreground text-[length:var(--cc-font-size-sm)]">
      Mono, tabular: <span class="font-mono tabular-nums">0123456789 · 2026-10-29 · 4.92:1</span>
    </p>
  </section>

  <section aria-labelledby="sc-radius" class={section}>
    <h3 id="sc-radius" class={h3}>Radius</h3>
    <ul class="grid grid-cols-[var(--pg-cols-radius)] justify-start gap-4">
      {#each radii as r (r)}
        <li class="grid justify-items-center gap-2">
          <span
            class="bg-muted border-input size-14 border"
            style:border-radius="var(--cc-radius-{r})"
            aria-hidden="true"
          ></span>
          <code>{r}</code>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="sc-space" class={section}>
    <h3 id="sc-space" class={h3}>Spacing</h3>
    <ul class="grid gap-2">
      {#each Object.entries(space) as [step, size] (step)}
        <li
          class="grid grid-cols-[calc(var(--spacing)*8)_auto_1fr] items-center gap-3 text-[length:var(--cc-font-size-sm)]"
        >
          <code>{step}</code>
          <span
            class="bg-primary h-3 rounded-sm"
            style:width="var(--cc-space-{step})"
            aria-hidden="true"
          ></span>
          <span class="text-muted-foreground font-mono tabular-nums">{size}</span>
        </li>
      {/each}
    </ul>
  </section>
</div>
