<!--
  Page frame of the interactive playground pages: title, theme, accent and
  density switchers (restored from localStorage), page navigation, and a
  themed stage that wraps the content.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import {
    accentNames,
    densities,
    themeNames,
    themes,
    type AccentName,
    type ThemeName,
  } from '@codecora/tokens';
  import type { Snippet } from 'svelte';
  import Switchers from './Switchers.svelte';

  interface Props {
    title: string;
    lead: string;
    children: Snippet<[{ theme: ThemeName; accent: AccentName | undefined }]>;
  }

  let { title, lead, children }: Props = $props();

  const KEY = 'cc-playground';
  let theme = $state<ThemeName>('neutral');
  let accent = $state('default');
  let density = $state('comfortable');
  let restored = $state(false);

  const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
    list.includes(value as T);

  // Remember the last choice per browser; storage may be unavailable or hold
  // stale values, so only known names are restored.
  $effect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
      if (isOneOf(themeNames, saved?.theme)) theme = saved.theme;
      if (saved?.accent === 'default' || isOneOf(accentNames, saved?.accent)) accent = saved.accent;
      if (isOneOf(densities, saved?.density)) density = saved.density;
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
  <title>{title} · CodeCora UI playground</title>
</svelte:head>

<div
  class="stage"
  data-theme={theme}
  data-accent={accentName}
  data-density={density === 'comfortable' ? undefined : density}
>
  <header>
    <div class="intro">
      <h1>{title}</h1>
      <p>{lead}</p>
    </div>
    <Switchers bind:theme bind:accent bind:density />
    <nav aria-label="Playground pages">
      <a href={resolve('/')}>Tokens</a>
      <a href={resolve('/components')}>Components</a>
      <span class="sep" aria-hidden="true"></span>
      Fixed theme pages for visual snapshots:
      {#each themeNames as name (name)}
        <a href={resolve('/themes/[theme]', { theme: name })}>{themes[name].label}</a>
      {/each}
    </nav>
  </header>

  <main>
    {@render children({ theme, accent: accentName })}
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
    align-items: center;
    gap: var(--cc-space-3);
    font-size: var(--cc-font-size-sm);
    color: var(--cc-text-muted);
  }
  .sep {
    width: 1px;
    height: 1em;
    background: var(--cc-border-strong);
  }
  @media (min-width: 48rem) {
    .stage {
      padding-inline: var(--cc-space-8);
    }
  }
</style>
