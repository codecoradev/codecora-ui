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
    { href: resolve('/tokens'), label: 'Tokens' },
    { href: resolve('/motion'), label: 'Motion' },
    { href: resolve('/icons'), label: 'Icons' },
    { href: resolve('/brand'), label: 'Brand' },
  ];
  const isCurrent = (href: string) =>
    page.url.pathname === href || page.url.pathname === `${href}.html`;
</script>

<div class="bar">
  <a class="home" href={resolve('/')}>CodeCora UI</a>
  <nav aria-label="Playground pages">
    {#each links as link (link.href)}
      <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label}</a>
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
