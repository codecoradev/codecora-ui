<!-- @codecora/brand: every product mark at several sizes on light and dark, and its favicon set. -->
<script lang="ts">
  import { Mark, marks, productNames } from '@codecora/brand';

  const sizes = [128, 64, 32, 16];
  const tile = 'border-border bg-background flex flex-wrap items-end gap-4 rounded-md border p-4';

  const kinds = {
    svg: 'Vector master (SVG)',
    png: 'Raster master (PNG)',
  } as const;

  const iconRows = (name: (typeof productNames)[number]) => {
    const f = marks[name].favicons;
    return [
      f.svg && { label: 'favicon.svg', src: f.svg, size: 32 },
      { label: 'favicon-16.png', src: f.png16, size: 16 },
      { label: 'favicon-32.png', src: f.png32, size: 32 },
      { label: 'favicon-48.png', src: f.png48, size: 48 },
      { label: 'apple-touch-icon.png (180)', src: f.appleTouch, size: 90 },
      { label: 'icon-192.png', src: f.icon192, size: 96 },
      f.icon512 && { label: 'icon-512.png', src: f.icon512, size: 128 },
    ].filter((row) => Boolean(row)) as { label: string; src: string; size: number }[];
  };
</script>

{#each productNames as name (name)}
  {@const product = marks[name]}
  <section aria-labelledby="b-{name}" class="grid grid-cols-1 gap-4 pb-10">
    <h2 id="b-{name}" class="leading-heading text-xl font-bold">{product.label}</h2>
    <p class="text-muted-foreground">
      {kinds[product.kind]}{product.rasterSize
        ? `, ${product.rasterSize} px: never scaled past its master`
        : ''}.
    </p>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*64),1fr))] gap-3">
      <!-- Each tile sets its own theme (neutral, corin): a light and a dark surface. -->
      <div class={tile} data-theme="neutral">
        {#each sizes as size (size)}<Mark product={name} {size} />{/each}
      </div>
      <div class={tile} data-theme="corin">
        {#each sizes as size (size)}<Mark product={name} {size} />{/each}
      </div>
    </div>

    <h3 class="leading-heading text-lg font-bold">Favicon set</h3>
    <ul class="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*52),1fr))] gap-3">
      {#each iconRows(name) as row (row.label)}
        <li
          class="border-border flex items-center gap-3 rounded-sm border p-3 text-sm leading-[inherit]"
        >
          <img src={row.src} alt="" width={row.size} height={row.size} />
          <code>{row.label}</code>
        </li>
      {/each}
    </ul>
  </section>
{/each}

<section aria-labelledby="b-usage" class="grid grid-cols-1 gap-4 pb-10">
  <h2 id="b-usage" class="leading-heading text-xl font-bold">Using it</h2>
  <!-- A scrollable code block must be keyboard reachable (axe: scrollable-region-focusable). -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre
    tabindex="0"
    aria-label="Brand package usage"
    class="border-border bg-muted overflow-x-auto rounded-md border p-4 font-mono text-sm leading-[inherit]"><code
      >{`import { Mark, Favicons } from '@codecora/brand';

<Favicons product="uteke" />   // in the root layout
<Mark product="uteke" size={32} label="Uteke" />`}</code
    ></pre>
</section>
