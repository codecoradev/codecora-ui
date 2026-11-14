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
    { href: resolve('/memory'), label: 'Memory' },
    { href: resolve('/registry'), label: 'Registry' },
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

  const focus =
    'focus-visible:outline-ring focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)]';
  /* 44 px rows: the comfortable target the components use. The current page changes
     colour, weight and gets an underline bar. */
  const item = `text-muted-foreground hover:bg-accent hover:text-foreground aria-[current=page]:text-foreground inline-flex min-h-11 items-center rounded-md px-2 no-underline aria-[current=page]:rounded-none aria-[current=page]:font-semibold aria-[current=page]:[box-shadow:inset_0_-2px_0_var(--cc-accent)] max-[47.99rem]:flex-none ${focus}`;
</script>

<div
  class="border-border flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b pb-3 max-[47.99rem]:grid max-[47.99rem]:gap-2"
>
  <a
    class="font-display text-foreground inline-flex min-h-11 items-center font-bold no-underline {focus}"
    href={resolve('/')}>CodeCora UI</a
  >
  <!-- One scrollable row on phones instead of three wrapped ones; it fades at the
       right edge, so the pages past it read as more. -->
  <nav
    aria-label="Playground pages"
    class="flex flex-wrap gap-1 text-[length:var(--cc-font-size-sm)] max-[47.99rem]:-mx-4 max-[47.99rem]:[scrollbar-width:none] max-[47.99rem]:flex-nowrap max-[47.99rem]:overflow-x-auto max-[47.99rem]:[mask-image:linear-gradient(to_right,var(--cc-text)_calc(100%-var(--cc-space-10)),transparent)] max-[47.99rem]:ps-4 max-[47.99rem]:pe-10"
  >
    {#each links as link (link.href)}
      <a class={item} href={link.href} aria-current={isCurrent(link) ? 'page' : undefined}
        >{link.label}</a
      >
    {/each}
    <a href={repoUrl} class="{item} ml-2" rel="external">GitHub</a>
  </nav>
</div>
