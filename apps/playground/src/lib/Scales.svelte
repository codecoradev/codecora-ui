<script lang="ts">
  import { fontSize, space } from '@codecora/tokens';

  // Class names in full, so Tailwind finds them; the pill is rounded-full in every theme.
  const radii = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', pill: 'rounded-full' };

  const section = 'grid content-start gap-3';
  const h3 = 'text-muted-foreground font-sans text-sm leading-heading font-semibold';
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--container-2xs)),1fr))] gap-8">
  <section aria-labelledby="sc-type" class={section}>
    <h3 id="sc-type" class={h3}>Type scale</h3>
    <ul class="grid gap-2">
      {#each Object.entries(fontSize).reverse() as [step, size] (step)}
        <li class="grid gap-1">
          <span class="text-muted-foreground text-xs leading-[inherit]"
            ><code>{step}</code> <span class="font-mono tabular-nums">{size}</span></span
          >
          <span class="font-display leading-heading" style:font-size={size}>Memories, kept</span>
        </li>
      {/each}
    </ul>
    <p class="text-muted-foreground text-sm leading-[inherit]">
      Mono, tabular: <span class="font-mono tabular-nums">0123456789 · 2026-10-29 · 4.92:1</span>
    </p>
  </section>

  <section aria-labelledby="sc-radius" class={section}>
    <h3 id="sc-radius" class={h3}>Radius</h3>
    <ul class="grid grid-cols-[var(--pg-cols-radius)] justify-start gap-4">
      {#each Object.entries(radii) as [r, rounded] (r)}
        <li class="grid justify-items-center gap-2">
          <span class="bg-muted border-input size-14 border {rounded}" aria-hidden="true"></span>
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
          class="grid grid-cols-[calc(var(--spacing)*8)_auto_1fr] items-center gap-3 text-sm leading-[inherit]"
        >
          <code>{step}</code>
          <span
            class="bg-primary h-3 rounded-sm"
            style:width="calc(var(--spacing) * {step})"
            aria-hidden="true"
          ></span>
          <span class="text-muted-foreground font-mono tabular-nums">{size}</span>
        </li>
      {/each}
    </ul>
  </section>
</div>
