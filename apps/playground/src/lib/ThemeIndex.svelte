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

<section aria-labelledby="index-title" class="index">
  <div class="head">
    <h2 id="index-title">Theme pages</h2>
    <p>One fixed page per theme, at its default accent and density. Below: the theme you picked.</p>
  </div>
  <div class="groups">
    {#each groups as { group, themes: names } (group)}
      <div class="group" role="group" aria-labelledby="index-{group}">
        <h3 id="index-{group}">{group}</h3>
        <ul>
          {#each names as name (name)}
            <li>
              <a
                href={resolve('/themes/[theme]', { theme: name })}
                aria-current={name === current ? 'true' : undefined}
              >
                <span class="swatch" data-theme={name} aria-hidden="true"></span>
                <span class="text">
                  <span class="label">{themes[name].label}</span>
                  <span class="star">{northStars[name]}</span>
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>

<style>
  .index {
    display: grid;
    gap: var(--cc-space-5);
    padding-bottom: var(--cc-space-10);
    margin-bottom: var(--cc-space-10);
    border-bottom: 1px solid var(--cc-border);
  }
  .head {
    display: grid;
    gap: var(--cc-space-2);
  }
  h2 {
    margin: 0;
    font-size: var(--cc-font-size-2xl);
  }
  .head p {
    max-width: 56ch;
    margin: 0;
    color: var(--cc-text-muted);
  }
  .groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--cc-space-4) var(--cc-space-6);
    align-items: start;
  }
  .group {
    display: grid;
    gap: var(--cc-space-2);
  }
  h3 {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  ul {
    display: grid;
    gap: var(--cc-space-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  a {
    display: flex;
    align-items: center;
    gap: var(--cc-space-3);
    min-height: 2.75rem;
    padding: var(--cc-space-1) var(--cc-space-2);
    border-radius: var(--cc-radius-md);
    color: var(--cc-text);
    text-decoration: none;
  }
  a:hover {
    background: var(--cc-surface-hover);
  }
  a:hover .label {
    text-decoration: underline;
  }
  a:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  /* The theme picked in the toolbar gets the accent bar, not colour alone. */
  a[aria-current='true'] {
    box-shadow: inset var(--cc-row-marker) 0 0 var(--cc-accent);
  }
  /* A mini swatch of that theme: surface, sunken and accent at its own radius. */
  .swatch {
    flex: none;
    width: 2.25rem;
    height: 1.5rem;
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-sm);
    background: linear-gradient(
      90deg,
      var(--cc-surface) 0 34%,
      var(--cc-surface-sunken) 34% 67%,
      var(--cc-accent) 67%
    );
  }
  .text {
    display: grid;
  }
  .label {
    font-weight: 600;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.2em;
  }
  .star {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
</style>
