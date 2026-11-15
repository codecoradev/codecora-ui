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

<!-- Until the choice is restored, the stage inherits it from <html> (set in app.html), so nothing flashes. -->
<div
  class="duration-normal ease-enter min-h-dvh px-4 pt-4 pb-10 transition-[background-color,color] md:px-8"
  data-theme={appearance.restored ? appearance.theme : undefined}
  data-accent={appearance.restored ? appearance.accentName : undefined}
  data-density={appearance.restored ? appearance.densityName : undefined}
>
  <a
    class="bg-primary text-primary-foreground absolute -top-40 left-4 rounded-md px-3 py-2 focus:top-2"
    href="#content">Skip to content</a
  >
  <header class="mx-auto grid max-w-6xl grid-cols-1 gap-6 pb-6">
    <PageNav />

    <div class="grid gap-3">
      <h1 class="leading-heading text-3xl font-bold text-balance">{title}</h1>
      <p class="text-muted-foreground max-w-[var(--pg-measure-intro)] text-lg leading-[inherit]">
        {lead}
      </p>
    </div>
  </header>

  <!-- Sticky, so the theme can change from anywhere on a long page. Phones: one row,
       each trigger shrinks and truncates its value. -->
  <div
    class="z-sticky border-border bg-background sticky top-0 mx-auto mb-6 flex max-w-6xl flex-wrap gap-2 border-b py-2 max-[30rem]:flex-nowrap max-[30rem]:*:min-w-0 max-[30rem]:*:flex-1"
    role="region"
    aria-label="Appearance"
  >
    <AppearanceControls {appearance} />
  </div>

  <main id="content" tabindex="-1" class="mx-auto max-w-6xl focus:outline-none">
    {@render children({
      theme: appearance.theme,
      accent: appearance.accentName,
      density: appearance.densityName,
      setTheme: (name) => (appearance.theme = name),
    })}
  </main>

  <footer
    class="border-border text-muted-foreground mx-auto mt-10 flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 border-t pt-6 text-sm leading-[inherit]"
  >
    <span>Theme pages:</span>
    {#each themeNames as name (name)}
      <a class="inline-flex min-h-6 items-center" href={resolve('/themes/[theme]', { theme: name })}
        >{themes[name].label}</a
      >
    {/each}
  </footer>
</div>
