<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes } from '@codecora/tokens';
  import Catalogue from '../../../lib/Catalogue.svelte';
  import { groupedThemes } from '../../../lib/catalogue.js';
  import PageNav from '../../../lib/PageNav.svelte';

  let { data } = $props();

  // Previous and next in gallery order, wrapping round.
  const order = groupedThemes().flatMap((g) => g.themes);
  const all = [...order, ...themeNames.filter((name) => !order.includes(name))];
  const index = $derived(all.indexOf(data.theme));
  const prev = $derived(all[(index - 1 + all.length) % all.length] ?? data.theme);
  const next = $derived(all[(index + 1) % all.length] ?? data.theme);
</script>

<svelte:head>
  <title>{themes[data.theme].label} theme · CodeCora UI playground</title>
</svelte:head>

<!-- Fixed theme, default accent and density: stable pages for visual snapshots. -->
<div class="stage" data-theme={data.theme}>
  <header>
    <PageNav />
    <h1>{themes[data.theme].label} theme</h1>
    <nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href={resolve('/')}>Overview</a></li>
        <li><a href={resolve('/tokens')}>Tokens</a></li>
        <li aria-current="page">{themes[data.theme].label}</li>
      </ol>
    </nav>
    <nav class="pager" aria-label="Theme pages">
      <a href={resolve('/themes/[theme]', { theme: prev })} rel="prev"
        ><span aria-hidden="true">←</span> {themes[prev].label}</a
      >
      <a class="try" href="{resolve('/')}?theme={data.theme}">Try {themes[data.theme].label} live</a
      >
      <a href={resolve('/themes/[theme]', { theme: next })} rel="next"
        >{themes[next].label} <span aria-hidden="true">→</span></a
      >
    </nav>
  </header>
  <main>
    <Catalogue theme={data.theme} />
  </main>
</div>

<style>
  .stage {
    min-height: 100dvh;
    padding: var(--cc-space-8) var(--cc-space-4) var(--cc-space-16);
  }
  header,
  main {
    max-width: 72rem;
    margin-inline: auto;
  }
  header {
    display: grid;
    gap: var(--cc-space-3);
    padding-bottom: var(--cc-space-8);
  }
  .crumbs ol {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .crumbs li + li::before {
    content: '/';
    margin-right: var(--cc-space-2);
  }
  .crumbs a {
    display: inline-flex;
    align-items: center;
    min-height: 1.5rem;
  }
  h1 {
    font-size: var(--cc-font-size-3xl);
  }
  /* Step through the themes without going back to the index. */
  .pager {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  .pager a {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-1);
    min-height: 2.75rem;
    padding-inline: var(--cc-space-3);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font-size: var(--cc-font-size-sm);
    text-decoration: none;
  }
  .pager a:hover {
    background: var(--cc-surface-hover);
  }
  .pager a:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .pager .try {
    border-color: var(--cc-accent);
    background: var(--cc-accent);
    color: var(--cc-accent-text);
    font-weight: 600;
  }
  @media (min-width: 48rem) {
    .stage {
      padding-inline: var(--cc-space-8);
    }
  }
</style>
