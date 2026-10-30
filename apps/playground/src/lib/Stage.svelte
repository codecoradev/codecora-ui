<!--
  Page frame of the interactive playground pages: title, theme, accent and
  density switchers (restored from localStorage), page navigation, and a
  themed stage that wraps the content.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import type { Snippet } from 'svelte';
  import { createAppearance } from './appearance.svelte.js';
  import Switchers from './Switchers.svelte';

  interface Props {
    title: string;
    lead: string;
    children: Snippet<[{ theme: ThemeName; accent: AccentName | undefined }]>;
  }

  let { title, lead, children }: Props = $props();

  const appearance = createAppearance();
</script>

<svelte:head>
  <title>{title} · CodeCora UI playground</title>
</svelte:head>

<div
  class="stage"
  data-theme={appearance.theme}
  data-accent={appearance.accentName}
  data-density={appearance.densityName}
>
  <header>
    <div class="intro">
      <h1>{title}</h1>
      <p>{lead}</p>
    </div>
    <Switchers
      bind:theme={appearance.theme}
      bind:accent={appearance.accent}
      bind:density={appearance.density}
    />
    <nav aria-label="Playground pages">
      <a href={resolve('/')}>Tokens</a>
      <a href={resolve('/components')}>Components</a>
      <a href={resolve('/icons')}>Icons</a>
      <a href={resolve('/brand')}>Brand</a>
      <a href={resolve('/dashboard')}>Admin dashboard</a>
      <a href={resolve('/samples')}>Samples</a>
      <span class="sep" aria-hidden="true"></span>
      Fixed theme pages for visual snapshots:
      {#each themeNames as name (name)}
        <a href={resolve('/themes/[theme]', { theme: name })}>{themes[name].label}</a>
      {/each}
    </nav>
  </header>

  <main>
    {@render children({ theme: appearance.theme, accent: appearance.accentName })}
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
    grid-template-columns: minmax(0, 1fr);
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
    max-width: 65ch;
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
  nav a {
    display: inline-flex;
    align-items: center;
    min-height: 1.5rem;
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
