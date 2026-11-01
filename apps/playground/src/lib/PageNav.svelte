<!-- The playground's page navigation, shared by the interactive and fixed theme pages. -->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { repoUrl } from './catalogue.js';

  const links = [
    { href: resolve('/'), label: 'Overview' },
    { href: resolve('/components'), label: 'Components' },
    { href: resolve('/samples'), label: 'Samples' },
    { href: resolve('/dashboard'), label: 'Dashboard' },
    // The fixed theme pages sit under Tokens.
    { href: resolve('/tokens'), label: 'Tokens', under: resolve('/').replace(/\/?$/, '/themes/') },
    { href: resolve('/motion'), label: 'Motion' },
    { href: resolve('/icons'), label: 'Icons' },
    { href: resolve('/brand'), label: 'Brand' },
  ];
  const isCurrent = (link: { href: string; under?: string }) =>
    page.url.pathname === link.href ||
    page.url.pathname === `${link.href}.html` ||
    (link.under !== undefined && page.url.pathname.startsWith(link.under));
</script>

<div class="bar">
  <a class="home" href={resolve('/')}>CodeCora UI</a>
  <nav aria-label="Playground pages">
    {#each links as link (link.href)}
      <a href={link.href} aria-current={isCurrent(link) ? 'page' : undefined}>{link.label}</a>
    {/each}
    <a href={repoUrl} class="repo" rel="external">GitHub</a>
  </nav>
</div>

<style>
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
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
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
  /* 44 px rows: the comfortable target the components use. */
  nav a {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
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
  /* One scrollable row on phones instead of three wrapped ones. */
  @media (max-width: 47.99rem) {
    .bar {
      display: grid;
      gap: var(--cc-space-2);
    }
    nav {
      flex-wrap: nowrap;
      overflow-x: auto;
      margin-inline: calc(var(--cc-space-4) * -1);
      padding-inline: var(--cc-space-4);
      scrollbar-width: none;
    }
    nav a {
      flex: none;
    }
  }
</style>
