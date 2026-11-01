<!--
  Page frame of the interactive playground pages: page navigation, title,
  theme, accent and density switchers (restored from the URL or
  localStorage), a themed stage that wraps the content, and a footer with the
  fixed theme pages.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { themeNames, themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import type { Snippet } from 'svelte';
  import { createAppearance } from './appearance.svelte.js';
  import { repoUrl } from './catalogue.js';
  import Switchers from './Switchers.svelte';

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

  const links = [
    { href: resolve('/'), label: 'Overview' },
    { href: resolve('/components'), label: 'Components' },
    { href: resolve('/samples'), label: 'Samples' },
    { href: resolve('/dashboard'), label: 'Dashboard' },
    { href: resolve('/tokens'), label: 'Tokens' },
    { href: resolve('/icons'), label: 'Icons' },
    { href: resolve('/brand'), label: 'Brand' },
  ];
  const isCurrent = (href: string) =>
    page.url.pathname === href || page.url.pathname === `${href}.html`;

  // The switchers stay open on wide screens and fold into one line on phones.
  let appearanceOpen = $state(true);
  $effect(() => {
    const wide = matchMedia('(min-width: 48rem)');
    appearanceOpen = wide.matches;
    const sync = () => (appearanceOpen = wide.matches);
    wide.addEventListener('change', sync);
    return () => wide.removeEventListener('change', sync);
  });
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
    <div class="bar">
      <a class="home" href={resolve('/')}>CodeCora UI</a>
      <nav aria-label="Playground pages">
        {#each links as link (link.href)}
          <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}
            >{link.label}</a
          >
        {/each}
        <a href={repoUrl} class="repo" rel="external">GitHub</a>
      </nav>
    </div>

    <div class="intro">
      <h1>{title}</h1>
      <p>{lead}</p>
    </div>

    <details class="appearance" bind:open={appearanceOpen}>
      <summary>
        Appearance: {themes[appearance.theme].label}, {appearance.accent === 'default'
          ? 'theme accent'
          : appearance.accent}, {appearance.density}
      </summary>
      <Switchers
        bind:theme={appearance.theme}
        bind:accent={appearance.accent}
        bind:density={appearance.density}
      />
    </details>
  </header>

  <main id="content" tabindex="-1">
    {@render children({
      theme: appearance.theme,
      accent: appearance.accentName,
      density: appearance.densityName,
      setTheme: (name) => (appearance.theme = name),
    })}
  </main>

  <footer>
    <span>Fixed theme pages for visual snapshots:</span>
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
  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-2) var(--cc-space-6);
    padding-bottom: var(--cc-space-3);
    border-bottom: 1px solid var(--cc-border);
  }
  .home {
    font-family: var(--cc-font-display);
    font-weight: 700;
    color: var(--cc-text);
    text-decoration: none;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-1);
    font-size: var(--cc-font-size-sm);
  }
  nav a {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding-inline: var(--cc-space-2);
    border-radius: var(--cc-radius-md);
    color: var(--cc-text-muted);
    text-decoration: none;
  }
  nav a:hover {
    background: var(--cc-surface-hover);
    color: var(--cc-text);
  }
  /* The current page changes colour, weight and gets an underline bar. */
  nav a[aria-current='page'] {
    color: var(--cc-text);
    font-weight: 600;
    box-shadow: inset 0 -2px 0 var(--cc-accent);
    border-radius: 0;
  }
  nav a:focus-visible,
  .home:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .repo {
    margin-left: var(--cc-space-2);
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
  .appearance summary {
    display: flex;
    align-items: center;
    min-height: 2.75rem;
    padding-inline: var(--cc-space-3);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
    cursor: pointer;
  }
  .appearance[open] summary {
    margin-bottom: var(--cc-space-4);
  }
  .appearance summary:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
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
    /* Always open here, so the summary line is redundant. */
    .appearance summary {
      display: none;
    }
  }
</style>
