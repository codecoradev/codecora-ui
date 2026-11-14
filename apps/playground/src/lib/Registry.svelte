<!--
  The shadcn-svelte registry served by this site: one install command per
  item, built from the registry index, and the bridge setup it performs.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { Badge, Card, CodeBlock } from '@codecora/ui';
  import { onMount } from 'svelte';
  import { registryItems } from './registry.js';

  // Prerendered pages have no real origin; fill it in once the page runs.
  let origin = $state('https://<this-site>');
  onMount(() => {
    origin = location.origin;
  });
  const url = (name: string) =>
    `${origin}${resolve('/')}r/${name}.json`.replace(/([^:])\/\//, '$1/');

  const bridge = `@import 'tailwindcss';
@import '@codecora/tokens/theme.css';
@import '@codecora/ui/source.css';

:root,
.dark {
  --background: revert-layer;
  --primary: revert-layer;
  /* ... every shadcn variable, handed back to theme.css */
}`;
</script>

<section aria-labelledby="r-items">
  <h2 id="r-items">Items</h2>
  <p>
    Blocks are copied into your app (<code>$lib/components</code>) and are yours to change. They are
    built from <code>@codecora/ui</code>, which stays a package, and each one installs the theme
    item first.
  </p>
  <div class="items">
    {#each registryItems as item (item.name)}
      <Card>
        {#snippet header()}
          <div class="head">
            <h3>{item.title ?? item.name}</h3>
            <Badge tone={item.type === 'registry:theme' ? 'accent' : 'neutral'}>
              {item.type.replace('registry:', '')}
            </Badge>
          </div>
        {/snippet}
        <p>{item.description}</p>
        <CodeBlock code={`npx shadcn-svelte@latest add ${url(item.name)}`} language="sh" />
      </Card>
    {/each}
  </div>
</section>

<section aria-labelledby="r-bridge">
  <h2 id="r-bridge">What the theme item does</h2>
  <p>
    <code>cc-theme</code> installs <code>@codecora/tokens</code> and <code>@codecora/ui</code>, adds
    their Tailwind 4 imports to your global CSS and hands the shadcn variables in your
    <code>:root</code> and <code>.dark</code> blocks back to the theme, which declares them. Your
    shadcn components and the blocks then follow <code>data-theme</code>, <code>data-accent</code>
    and <code>data-density</code> on any element, nested regions included.
  </p>
  <CodeBlock code={bridge} language="css" />
  <p>
    Dark themes (for example <code>corin</code>) set their own colours, but shadcn's
    <code>dark:</code> utilities still follow the <code>.dark</code> class: add it next to a dark
    <code>data-theme</code>, or delete shadcn's <code>@custom-variant dark</code> line so
    <code>dark:</code> follows the dark themes too. See the
    <a href={resolve('/tokens')}>token catalogue</a> for every theme.
  </p>
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
    font-size: var(--cc-font-size-md);
  }
  p {
    max-inline-size: 65ch;
    color: var(--cc-text-muted);
  }
  .items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
    gap: var(--cc-space-4);
  }
  /* Long install commands scroll inside their code block instead of widening the page. */
  .items > :global(*) {
    min-inline-size: 0;
  }
  .items p {
    margin-bottom: var(--cc-space-3);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-2);
  }
</style>
