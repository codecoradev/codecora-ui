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

<section aria-labelledby="r-items" class="grid grid-cols-1 gap-4 pb-10">
  <h2 id="r-items" class="text-[length:var(--cc-font-size-xl)] font-bold">Items</h2>
  <p class="text-muted-foreground">
    Blocks are copied into your app (<code>$lib/components</code>) and are yours to change. They are
    built from <code>@codecora/ui</code>, which stays a package, and each one installs the theme
    item first.
  </p>
  <div
    class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*88)),1fr))] gap-4 *:min-w-0"
  >
    {#each registryItems as item (item.name)}
      <Card>
        {#snippet header()}
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-[length:var(--cc-font-size-md)] font-bold">
              {item.title ?? item.name}
            </h3>
            <Badge tone={item.type === 'registry:theme' ? 'accent' : 'neutral'}>
              {item.type.replace('registry:', '')}
            </Badge>
          </div>
        {/snippet}
        <p class="text-muted-foreground mb-3">{item.description}</p>
        <CodeBlock code={`npx shadcn-svelte@latest add ${url(item.name)}`} language="sh" />
      </Card>
    {/each}
  </div>
</section>

<section aria-labelledby="r-bridge" class="grid grid-cols-1 gap-4 pb-10">
  <h2 id="r-bridge" class="text-[length:var(--cc-font-size-xl)] font-bold">
    What the theme item does
  </h2>
  <p class="text-muted-foreground">
    <code>cc-theme</code> installs <code>@codecora/tokens</code> and <code>@codecora/ui</code>, adds
    their Tailwind 4 imports to your global CSS and hands the shadcn variables in your
    <code>:root</code> and <code>.dark</code> blocks back to the theme, which declares them. Your
    shadcn components and the blocks then follow <code>data-theme</code>, <code>data-accent</code>
    and <code>data-density</code> on any element, nested regions included.
  </p>
  <CodeBlock code={bridge} language="css" />
  <p class="text-muted-foreground">
    Dark themes (for example <code>corin</code>) set their own colours, but shadcn's
    <code>dark:</code> utilities still follow the <code>.dark</code> class: add it next to a dark
    <code>data-theme</code>, or delete shadcn's <code>@custom-variant dark</code> line so
    <code>dark:</code> follows the dark themes too. See the
    <a href={resolve('/tokens')}>token catalogue</a> for every theme.
  </p>
</section>
