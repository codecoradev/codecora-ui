<!--
  The eleven fixed theme pages as an index, by group, so /tokens leads to
  each theme instead of repeating one of them.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themes, type ThemeName } from '@codecora/tokens';
  import { groupedThemes, northStars } from './catalogue.js';

  let { current }: { current: ThemeName } = $props();

  const groups = groupedThemes();
</script>

<section aria-labelledby="index-title" class="border-border mb-10 grid gap-5 border-b pb-10">
  <div class="grid gap-2">
    <h2 id="index-title" class="leading-heading text-2xl font-bold">Theme pages</h2>
    <p class="text-muted-foreground max-w-[var(--pg-measure-lead)]">
      One fixed page per theme, at its default accent and density. Below: the theme you picked.
    </p>
  </div>
  <div
    class="grid grid-cols-[repeat(auto-fit,minmax(min(calc(var(--spacing)*56),100%),1fr))] items-start gap-x-6 gap-y-4"
  >
    {#each groups as { group, themes: names } (group)}
      <div class="grid gap-2" role="group" aria-labelledby="index-{group}">
        <h3
          id="index-{group}"
          class="text-muted-foreground leading-heading text-sm font-semibold tracking-[var(--pg-tracking-label)] uppercase"
        >
          {group}
        </h3>
        <ul class="grid gap-1">
          {#each names as name (name)}
            <li>
              <!-- The theme picked in the toolbar gets the accent bar, not colour alone. -->
              <a
                class="group text-foreground hover:bg-accent focus-visible:outline-ring flex min-h-11 items-center gap-3 rounded-md px-2 py-1 no-underline focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)] aria-[current=true]:[box-shadow:inset_var(--cc-row-marker)_0_0_var(--primary)]"
                href={resolve('/themes/[theme]', { theme: name })}
                aria-current={name === current ? 'true' : undefined}
              >
                <!-- A mini swatch of that theme: surface, sunken and accent at its own radius. -->
                <span
                  class="border-input h-6 w-9 flex-none rounded-sm border bg-transparent bg-[linear-gradient(90deg,var(--background)_0_34%,var(--muted)_34%_67%,var(--primary)_67%)]"
                  data-theme={name}
                  aria-hidden="true"
                ></span>
                <span class="grid">
                  <span class="underline-offset-text font-semibold group-hover:underline"
                    >{themes[name].label}</span
                  >
                  <span class="text-muted-foreground text-sm leading-[inherit]"
                    >{northStars[name]}</span
                  >
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>
