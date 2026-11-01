<!--
  Page frame of the interactive playground pages: page navigation, title, a
  sticky appearance toolbar (theme in one popover, accent and density in
  another; restored from the URL or localStorage), a themed stage that wraps
  the content, and a footer with the fixed theme pages.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import type { Snippet } from 'svelte';
  import AppearanceControls from './AppearanceControls.svelte';
  import { createAppearance } from './appearance.svelte.js';
  import PageNav from './PageNav.svelte';

  interface Props {
    title: string;
    lead: string;
    children: Snippet<
      [
        {
          theme: ThemeName;
          accent: AccentName | undefined;
          density: string | undefined;
          setTheme: (name: ThemeName) => void;
        },
      ]
    >;
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
  <a class="skip" href="#content">Skip to content</a>
  <header>
    <PageNav />

    <div class="intro">
      <h1>{title}</h1>
      <p>{lead}</p>
    </div>
  </header>

  <div class="toolbar" role="region" aria-label="Appearance">
    <AppearanceControls {appearance} />
  </div>

  <main id="content" tabindex="-1">
    {@render children({
      theme: appearance.theme,
      accent: appearance.accentName,
      density: appearance.densityName,
      setTheme: (name) => (appearance.theme = name),
    })}
  </main>

  <footer>
    <span>Theme pages:</span>
    {#each themeNames as name (name)}
      <a href={resolve('/themes/[theme]', { theme: name })}>{themes[name].label}</a>
    {/each}
  </footer>
</div>

<style>
  .stage {
    min-height: 100dvh;
    padding: var(--cc-space-4) var(--cc-space-4) var(--cc-space-10);
    transition:
      background-color var(--cc-duration-normal) var(--cc-ease-out),
      color var(--cc-duration-normal) var(--cc-ease-out);
  }
  header,
  main,
  footer {
    max-width: 72rem;
    margin-inline: auto;
  }
  header {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-6);
    padding-bottom: var(--cc-space-6);
  }
  .skip {
    position: absolute;
    left: var(--cc-space-4);
    top: -10rem;
    padding: var(--cc-space-2) var(--cc-space-3);
    border-radius: var(--cc-radius-md);
    background: var(--cc-accent);
    color: var(--cc-accent-text);
  }
  .skip:focus {
    top: var(--cc-space-2);
  }

  .intro {
    display: grid;
    gap: var(--cc-space-3);
  }
  h1 {
    font-size: var(--cc-font-size-3xl);
    text-wrap: balance;
  }
  .intro p {
    max-width: 60ch;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-lg);
  }

  /* Sticky, so the theme can change from anywhere on a long page. */
  .toolbar {
    position: sticky;
    top: 0;
    z-index: var(--cc-layer-sticky);
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
    max-width: 72rem;
    margin: 0 auto var(--cc-space-6);
    padding-block: var(--cc-space-2);
    background: var(--cc-surface);
    border-bottom: 1px solid var(--cc-border);
  }
  main:focus {
    outline: none;
  }
  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-2) var(--cc-space-3);
    margin-top: var(--cc-space-10);
    padding-top: var(--cc-space-6);
    border-top: 1px solid var(--cc-border);
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  footer a {
    display: inline-flex;
    align-items: center;
    min-height: 1.5rem;
  }
  @media (min-width: 48rem) {
    .stage {
      padding-inline: var(--cc-space-8);
    }
  }
</style>
