<script lang="ts">
  import { resolve } from '$app/paths';
  import { themes } from '@codecora/tokens';
  import Catalogue from '../../../lib/Catalogue.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{themes[data.theme].label} theme · CodeCora UI playground</title>
</svelte:head>

<!-- Fixed theme, default accent and density: stable pages for visual snapshots. -->
<div class="stage" data-theme={data.theme}>
  <header>
    <h1>{themes[data.theme].label} theme</h1>
    <a href={resolve('/')}>Back to the interactive catalogue</a>
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
  h1 {
    font-size: var(--cc-font-size-3xl);
  }
  @media (min-width: 48rem) {
    .stage {
      padding-inline: var(--cc-space-8);
    }
  }
</style>
