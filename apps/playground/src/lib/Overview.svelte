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
    'bun add https://github.com/codecoradev/codecora-ui/releases/download/v0.7.0/codecora-tokens-0.7.0.tgz',
    'bun add https://github.com/codecoradev/codecora-ui/releases/download/v0.7.0/codecora-ui-0.6.0.tgz',
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

  const section = 'border-border grid grid-cols-1 gap-5 border-t py-10';
  const head = 'grid gap-2';
  const h2 = 'text-[length:var(--cc-font-size-2xl)] font-bold';
  /* Under 80 characters a line in the body face. */
  const lead = 'text-muted-foreground max-w-[var(--pg-measure-lead)]';
  const h3 = 'mb-1 text-[length:var(--cc-font-size-md)] font-bold';
  const groupText = 'text-muted-foreground leading-[var(--pg-leading-loose)]';
</script>

<div class="flex flex-wrap gap-2">
  <Button variant="primary" href={resolve('/components')}>Components</Button>
  <Button variant="secondary" href="#start-title">Install</Button>
</div>

<LiveStrip {theme} onpick={useTheme} />

<section aria-labelledby="themes-title" class="grid grid-cols-1 gap-5 pt-6 pb-10">
  <div class={head}>
    <h2 id="themes-title" class={h2}>Eleven themes, one set of components</h2>
    <p class={lead}>
      Each tile shows only what its theme changes: surfaces, display face, corners, label shape, the
      filled action, the focus ring and the floating shadow. The accent and density you pick in the
      toolbar apply to all of them; Access themes show their proof. Open a title for its full page.
    </p>
  </div>
  <p class="sr-only" aria-live="polite">{announcement}</p>
  <!-- One column per group, so every group shows in the first viewport on wide screens. -->
  <div
    class="grid grid-cols-[repeat(auto-fit,minmax(min(calc(var(--spacing)*56),100%),1fr))] items-start gap-4"
  >
    {#each groups as { group, themes: names } (group)}
      <div class="grid min-w-0 gap-3">
        <h3
          class="text-muted-foreground text-[length:var(--cc-font-size-sm)] font-semibold tracking-[var(--pg-tracking-label)] uppercase"
        >
          {group}
        </h3>
        <div class="grid gap-3">
          {#each names as name (name)}
            <ThemeTile {name} {accent} {density} current={name === theme} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<section aria-labelledby="nest-title" class={section}>
  <div class={head}>
    <h2 id="nest-title" class={h2}>Themes nest per element</h2>
    <p class={lead}>
      A dark panel inside a light page needs no second stylesheet, only an attribute.
    </p>
  </div>
  <NestedDemo />
</section>

<section aria-labelledby="offer-title" class={section}>
  <div class={head}>
    <h2 id="offer-title" class={h2}>{componentCount} components on bits-ui</h2>
    <p class={lead}>
      Plain CSS on semantic tokens, with or without Tailwind. Every one works with the keyboard
      alone and at 375 px.
    </p>
  </div>
  <ul
    class="grid grid-cols-[repeat(auto-fill,minmax(min(calc(var(--spacing)*60),100%),1fr))] gap-x-8 gap-y-5"
  >
    {#each catalogue as { group, sections } (group)}
      <li>
        <h3 class={h3}>{group}</h3>
        <p class={groupText}>
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
      <h3 class={h3}>Layout</h3>
      <p class={groupText}><a href={resolve('/dashboard')}>AppShell, Sidebar</a></p>
    </li>
  </ul>
</section>

<section aria-labelledby="start-title" class={section}>
  <div class={head}>
    <h2 id="start-title" class={h2}>Install</h2>
    <p class={lead}>
      Until the npm scope is live, install from the release tarballs; the import names stay the
      same. See the <Link href={repoUrl} external>README on GitHub</Link> for every package.
    </p>
  </div>
  <CodeBlock code={install} language="bash" />
</section>

<section aria-labelledby="pages-title" class={section}>
  <h2 id="pages-title" class={h2}>Explore</h2>
  <dl
    class="grid grid-cols-[repeat(auto-fill,minmax(min(var(--container-2xs),100%),1fr))] gap-x-8 gap-y-4"
  >
    {#each pages as page (page.href)}
      <div>
        <dt class="font-semibold"><a href={page.href}>{page.label}</a></dt>
        <dd class="text-muted-foreground mt-1">{page.text}</dd>
      </div>
    {/each}
  </dl>
</section>
