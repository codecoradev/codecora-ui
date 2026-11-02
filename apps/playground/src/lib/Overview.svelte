<!--
  The playground's front page: every theme side by side, what the library
  ships, how to install it and where to look next.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import { Button, CodeBlock, Link } from '@codecora/ui';
  import { catalogue, groupedThemes, repoUrl } from './catalogue.js';
  import LiveStrip from './LiveStrip.svelte';
  import NestedDemo from './NestedDemo.svelte';
  import ThemeTile from './ThemeTile.svelte';

  interface Props {
    theme: ThemeName;
    accent?: AccentName;
    density?: string;
    setTheme: (name: ThemeName) => void;
  }

  let { theme, accent, density, setTheme }: Props = $props();

  // Read out by screen readers when a tile applies its theme.
  let announcement = $state('');
  function useTheme(name: ThemeName) {
    setTheme(name);
    announcement = `${themes[name].label} theme applied to the playground.`;
  }

  const groups = groupedThemes();

  const componentCount = catalogue
    .flatMap((g) => g.sections)
    .reduce((n, s) => n + s.components.length, 0);

  const install = [
    'bun add https://github.com/codecoradev/codecora-ui/releases/download/v0.5.0/codecora-tokens-0.5.0.tgz',
    'bun add https://github.com/codecoradev/codecora-ui/releases/download/v0.4.0/codecora-ui-0.4.0.tgz',
  ].join('\n');

  const pages = [
    {
      href: resolve('/components'),
      label: 'Components',
      text: 'Every component in every state, with a state matrix and props.',
    },
    {
      href: resolve('/samples'),
      label: 'Samples',
      text: 'Sign in, settings, list and detail, a data table and a first run.',
    },
    {
      href: resolve('/dashboard'),
      label: 'Dashboard',
      text: 'An admin screen built with AppShell and Sidebar.',
    },
    {
      href: resolve('/tokens'),
      label: 'Tokens',
      text: 'Colour roles, type, radius, spacing and contrast pairs per theme.',
    },
    {
      href: resolve('/motion'),
      label: 'Motion',
      text: 'Durations and easings, with enter and exit replayed.',
    },
    { href: resolve('/icons'), label: 'Icons', text: 'Lucide and Phosphor, sized by the theme.' },
    { href: resolve('/brand'), label: 'Brand', text: 'Product marks and favicon sets.' },
  ];
</script>

<div class="start-row">
  <Button variant="primary" href={resolve('/components')}>Components</Button>
  <Button variant="secondary" href="#start-title">Install</Button>
</div>

<LiveStrip {theme} onpick={useTheme} />

<section aria-labelledby="themes-title" class="themes">
  <div class="head">
    <h2 id="themes-title">Eleven themes, one set of components</h2>
    <p>
      Each tile shows only what its theme changes: surfaces, display face, corners, label shape, the
      filled action, the focus ring and the floating shadow. The accent and density you pick in the
      toolbar apply to all of them; Access themes show their proof. Open a title for its full page.
    </p>
  </div>
  <p class="visually-hidden" aria-live="polite">{announcement}</p>
  <div class="gallery">
    {#each groups as { group, themes: names } (group)}
      <div class="theme-group">
        <h3 class="group-title">{group}</h3>
        <div class="grid">
          {#each names as name (name)}
            <ThemeTile {name} {accent} {density} current={name === theme} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<section aria-labelledby="nest-title">
  <div class="head">
    <h2 id="nest-title">Themes nest per element</h2>
    <p>A dark panel inside a light page needs no second stylesheet, only an attribute.</p>
  </div>
  <NestedDemo />
</section>

<section aria-labelledby="offer-title">
  <div class="head">
    <h2 id="offer-title">{componentCount} components on bits-ui</h2>
    <p>
      Plain CSS on semantic tokens, with or without Tailwind. Every one works with the keyboard
      alone and at 375 px.
    </p>
  </div>
  <ul class="groups">
    {#each catalogue as { group, sections } (group)}
      <li>
        <h3>{group}</h3>
        <p>
          {#each sections as section, i (section.id)}
            <a href="{resolve('/components')}#{section.id}">{section.components.join(', ')}</a>{i <
            sections.length - 1
              ? ', '
              : ''}
          {/each}
        </p>
      </li>
    {/each}
    <li>
      <h3>Layout</h3>
      <p><a href={resolve('/dashboard')}>AppShell, Sidebar</a></p>
    </li>
  </ul>
</section>

<section aria-labelledby="start-title" class="start">
  <div class="head">
    <h2 id="start-title">Install</h2>
    <p>
      Until the npm scope is live, install from the release tarballs; the import names stay the
      same. See the <Link href={repoUrl} external>README on GitHub</Link> for every package.
    </p>
  </div>
  <CodeBlock code={install} language="bash" />
</section>

<section aria-labelledby="pages-title">
  <h2 id="pages-title">Explore</h2>
  <dl class="pages">
    {#each pages as page (page.href)}
      <div>
        <dt><a href={page.href}>{page.label}</a></dt>
        <dd>{page.text}</dd>
      </div>
    {/each}
  </dl>
</section>

<style>
  .start-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-5);
    padding-block: var(--cc-space-10);
    border-top: 1px solid var(--cc-border);
  }
  section.themes {
    padding-top: var(--cc-space-6);
    border-top: 0;
  }
  .head {
    display: grid;
    gap: var(--cc-space-2);
  }
  h2 {
    margin: 0;
    font-size: var(--cc-font-size-2xl);
  }
  /* Under 80 characters a line in the body face. */
  .head p {
    max-width: 56ch;
    margin: 0;
    color: var(--cc-text-muted);
  }
  /* One column per group, so every group shows in the first viewport on wide screens. */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--cc-space-4);
    align-items: start;
  }
  .theme-group {
    display: grid;
    gap: var(--cc-space-3);
    min-width: 0;
  }
  .group-title {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .grid {
    display: grid;
    gap: var(--cc-space-3);
  }
  .groups {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr));
    gap: var(--cc-space-5) var(--cc-space-8);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .groups h3 {
    margin: 0 0 var(--cc-space-1);
    font-size: var(--cc-font-size-md);
  }
  .groups p {
    margin: 0;
    color: var(--cc-text-muted);
    line-height: 1.6;
  }
  .pages {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(18rem, 100%), 1fr));
    gap: var(--cc-space-4) var(--cc-space-8);
    margin: 0;
  }
  .pages dt {
    font-weight: 600;
  }
  .pages dd {
    margin: var(--cc-space-1) 0 0;
    color: var(--cc-text-muted);
  }
</style>
