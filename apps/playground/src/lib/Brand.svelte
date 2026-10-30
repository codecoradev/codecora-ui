<!-- @codecora/brand: every product mark at several sizes on light and dark, and its favicon set. -->
<script lang="ts">
  import { Mark, marks, productNames } from '@codecora/brand';

  const sizes = [128, 64, 32, 16];

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
  <section aria-labelledby="b-{name}">
    <h2 id="b-{name}">{product.label}</h2>
    <p class="muted">
      {kinds[product.kind]}{product.rasterSize
        ? `, ${product.rasterSize} px: never scaled past its master`
        : ''}.
    </p>

    <div class="tiles">
      <div class="tile" data-theme="neutral">
        {#each sizes as size (size)}<Mark product={name} {size} />{/each}
      </div>
      <div class="tile" data-theme="corin">
        {#each sizes as size (size)}<Mark product={name} {size} />{/each}
      </div>
    </div>

    <h3>Favicon set</h3>
    <ul class="set">
      {#each iconRows(name) as row (row.label)}
        <li>
          <img src={row.src} alt="" width={row.size} height={row.size} />
          <code>{row.label}</code>
        </li>
      {/each}
    </ul>
  </section>
{/each}

<section aria-labelledby="b-usage">
  <h2 id="b-usage">Using it</h2>
  <pre><code
      >{`import { Mark, Favicons } from '@codecora/brand';

<Favicons product="uteke" />   // in the root layout
<Mark product="uteke" size={32} label="Uteke" />`}</code
    ></pre>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  h3 {
    margin: 0;
    font-size: var(--cc-font-size-lg);
  }
  .muted {
    color: var(--cc-text-muted);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: var(--cc-space-3);
  }
  .tile {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--cc-space-4);
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    /* Each tile sets its own theme (neutral, corin): a light and a dark surface. */
    background: var(--cc-surface);
  }
  .set {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
    gap: var(--cc-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .set li {
    display: flex;
    align-items: center;
    gap: var(--cc-space-3);
    padding: var(--cc-space-3);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-sm);
    font-size: var(--cc-font-size-sm);
  }
  pre {
    margin: 0;
    padding: var(--cc-space-4);
    overflow-x: auto;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-sunken);
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-sm);
  }
</style>
