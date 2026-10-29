<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import Catalogue from '../lib/Catalogue.svelte';
  import Switchers from '../lib/Switchers.svelte';

  const KEY = 'cc-playground';
  let theme = $state<ThemeName>('neutral');
  let accent = $state('default');
  let density = $state('comfortable');
  let restored = $state(false);

  // Remember the last choice per browser; storage may be unavailable.
  $effect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
      if (themeNames.includes(saved.theme)) theme = saved.theme;
      if (typeof saved.accent === 'string') accent = saved.accent;
      if (typeof saved.density === 'string') density = saved.density;
    } catch {
      // keep the defaults
    }
    restored = true;
  });

  $effect(() => {
    const value = JSON.stringify({ theme, accent, density });
    if (!restored) return;
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // not persisted; the page still works
    }
  });

  const accentName = $derived(accent === 'default' ? undefined : (accent as AccentName));
</script>

<svelte:head>
  <title>CodeCora UI playground</title>
</svelte:head>

<div
  class="stage"
  data-theme={theme}
  data-accent={accentName}
  data-density={density === 'comfortable' ? undefined : density}
>
  <header>
    <div class="intro">
      <h1>CodeCora UI</h1>
      <p>
        Tokens, themes and components for CodeCora products. Pick a theme, accent and density;
        everything below follows.
      </p>
    </div>
    <Switchers bind:theme bind:accent bind:density />
    <nav aria-label="Snapshot pages">
      Fixed pages for visual snapshots:
      {#each themeNames as name (name)}
        <a href={resolve('/themes/[theme]', { theme: name })}>{themes[name].label}</a>
      {/each}
    </nav>
  </header>

  <main>
    <Catalogue {theme} accent={accentName} />
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
    gap: var(--cc-space-6);
    padding-bottom: var(--cc-space-8);
  }
  .intro {
    display: grid;
    gap: var(--cc-space-3);
  }
  h1 {
    font-size: var(--cc-font-size-3xl);
  }
  .intro p {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-lg);
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-3);
    font-size: var(--cc-font-size-sm);
    color: var(--cc-text-muted);
  }
  @media (min-width: 48rem) {
    .stage {
      padding-inline: var(--cc-space-8);
    }
  }
</style>
