<script lang="ts">
  import { resolve } from '$app/paths';
  import { themes } from '@codecora/tokens';
  import Catalogue from '../../../lib/Catalogue.svelte';
  import PageNav from '../../../lib/PageNav.svelte';

  let { data } = $props();
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
  @media (min-width: 48rem) {
    .stage {
      padding-inline: var(--cc-space-8);
    }
  }
</style>
