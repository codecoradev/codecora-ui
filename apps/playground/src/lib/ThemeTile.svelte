<!--
  One theme, showing only what a theme may change: the display face, corners,
  label shape, the filled action, the focus ring and the floating shadow.
  Everything here is a static specimen except the title link and Use button,
  so the gallery costs a keyboard user two stops per theme.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import { Badge, Button, VisuallyHidden } from '@codecora/ui';
  import { accessNotes, northStars } from './catalogue.js';

  interface Props {
    name: ThemeName;
    accent?: AccentName;
    density?: string;
    current: boolean;
    onuse: () => void;
  }

  let { name, accent, density, current, onuse }: Props = $props();
</script>

<article
  class="tile"
  data-theme={name}
  data-accent={accent}
  data-density={density}
  aria-labelledby="tile-{name}"
>
  <header>
    <div>
      <h4 id="tile-{name}">
        <a href={resolve('/themes/[theme]', { theme: name })}>{themes[name].label}</a>
      </h4>
      <p>{northStars[name]}</p>
    </div>
    <span class="glyph" aria-hidden="true">Aa</span>
  </header>

  {#if accessNotes[name]}
    <p class="note">{accessNotes[name]}</p>
  {/if}

  <div class="specimen" aria-hidden="true">
    <span class="action">Save</span>
    <span class="focus">Focused</span>
    <Badge tone="success">Active</Badge>
    <Badge tone="danger">Revoked</Badge>
    <span class="float">Saved <span class="when">now</span></span>
  </div>

  <footer>
    {#if current}
      <span class="current">Current theme</span>
    {:else}
      <Button variant="secondary" onclick={onuse}
        ><span>Use<VisuallyHidden>&nbsp;{themes[name].label}</VisuallyHidden> theme</span></Button
      >
    {/if}
  </footer>
</article>

<style>
  .tile {
    display: grid;
    gap: var(--cc-space-3);
    min-width: 0;
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-lg);
  }
  header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--cc-space-3);
  }
  header > div {
    display: grid;
    gap: var(--cc-space-1);
    min-width: 0;
  }
  h4 {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-xl);
  }
  h4 a {
    color: inherit;
    text-decoration: none;
  }
  h4 a:hover {
    text-decoration: underline;
  }
  h4 a:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  header p,
  .note {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .glyph {
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-3xl);
    font-weight: 600;
    line-height: 1;
  }
  .specimen {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-2);
  }
  /* The filled action as the theme draws it: accent, radius, label colour. */
  .action {
    display: inline-flex;
    align-items: center;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border-radius: var(--cc-radius-md);
    background: var(--cc-accent);
    color: var(--cc-accent-text);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
  }
  /* The focus ring, drawn on so its width and offset can be compared. */
  .focus {
    display: inline-flex;
    align-items: center;
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
    font-size: var(--cc-font-size-sm);
  }
  /* A floating layer: the theme's own shadow and large radius. */
  .float {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-2);
    padding: var(--cc-space-2) var(--cc-space-3);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
    box-shadow: var(--cc-shadow-popover);
    font-size: var(--cc-font-size-sm);
  }
  .when {
    color: var(--cc-text-muted);
    font-family: var(--cc-font-mono);
    font-variant-numeric: tabular-nums;
  }
  footer {
    display: flex;
    align-items: center;
    min-height: var(--cc-control-h);
  }
  .current {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
  }
</style>
