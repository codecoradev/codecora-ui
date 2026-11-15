<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes } from '@codecora/tokens';
  import Catalogue from '../../../lib/Catalogue.svelte';
  import { groupedThemes } from '../../../lib/catalogue.js';
  import PageNav from '../../../lib/PageNav.svelte';

  let { data } = $props();

  // Previous and next in gallery order, wrapping round.
  const order = groupedThemes().flatMap((g) => g.themes);
  const all = [...order, ...themeNames.filter((name) => !order.includes(name))];
  const index = $derived(all.indexOf(data.theme));
  const prev = $derived(all[(index - 1 + all.length) % all.length] ?? data.theme);
  const next = $derived(all[(index + 1) % all.length] ?? data.theme);

  const crumb = 'inline-flex min-h-6 items-center';
  /* Every crumb after the first leads with the separator. */
  const after = 'before:mr-2 before:content-[var(--pg-crumb-separator)]';
  const pager =
    'focus-visible:outline-ring inline-flex min-h-11 items-center gap-1 rounded-md border px-3 text-sm leading-[inherit] no-underline focus-visible:outline-focus focus-visible:outline-offset-focus';
</script>

<svelte:head>
  <title>{themes[data.theme].label} theme · CodeCora UI playground</title>
</svelte:head>

<!-- Fixed theme, default accent and density: stable pages for visual snapshots. -->
<div class="min-h-dvh px-4 pt-8 pb-16 md:px-8" data-theme={data.theme}>
  <header class="mx-auto grid max-w-6xl gap-3 pb-8">
    <PageNav />
    <h1 class="leading-heading text-3xl font-bold">
      {themes[data.theme].label} theme
    </h1>
    <nav aria-label="Breadcrumb">
      <ol class="text-muted-foreground flex flex-wrap gap-2 text-sm leading-[inherit]">
        <li><a class={crumb} href={resolve('/')}>Overview</a></li>
        <li class={after}><a class={crumb} href={resolve('/tokens')}>Tokens</a></li>
        <li class={after} aria-current="page">{themes[data.theme].label}</li>
      </ol>
    </nav>
    <!-- Step through the themes without going back to the index. -->
    <nav class="flex flex-wrap gap-2" aria-label="Theme pages">
      <a
        class="{pager} border-input bg-card text-foreground hover:bg-accent"
        href={resolve('/themes/[theme]', { theme: prev })}
        rel="prev"><span aria-hidden="true">←</span> {themes[prev].label}</a
      >
      <a
        class="{pager} border-primary bg-primary text-primary-foreground font-semibold"
        href="{resolve('/')}?theme={data.theme}">Try {themes[data.theme].label} live</a
      >
      <a
        class="{pager} border-input bg-card text-foreground hover:bg-accent"
        href={resolve('/themes/[theme]', { theme: next })}
        rel="next">{themes[next].label} <span aria-hidden="true">→</span></a
      >
    </nav>
  </header>
  <main class="mx-auto max-w-6xl">
    <Catalogue theme={data.theme} />
  </main>
</div>
