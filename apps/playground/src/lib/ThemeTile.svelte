<!--
  One theme, shown with real components. Every tile on the overview is the
  same markup; only data-theme changes.
-->
<script lang="ts">
  import { themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import { resolve } from '$app/paths';
  import { Badge, Button, Input, Switch, VisuallyHidden } from '@codecora/ui';
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

  <div class="specimen">
    <p class="sample">Memory synced 2 min ago.</p>
    <Input aria-label="Key name ({themes[name].label})" value="ci-deploy" autocomplete="off" />
    <div class="row">
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Expiring</Badge>
      <Badge tone="danger">Revoked</Badge>
    </div>
    <p class="float">Saved to memory <span class="when">now</span></p>
    <Switch label="Sync on save" checked id="switch-{name}" />
  </div>

  <footer>
    {#if current}
      <span class="current">Current theme</span>
    {:else}
      <Button variant="secondary" onclick={onuse}
        ><span>Use<VisuallyHidden>&nbsp;{themes[name].label}</VisuallyHidden> theme</span></Button
      >
    {/if}
    <Button variant="primary">Save</Button>
  </footer>
</article>

<style>
  .tile {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: var(--cc-space-4);
    min-width: 0;
    padding: var(--cc-space-5);
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
  .glyph {
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-3xl);
    font-weight: 600;
    line-height: 1;
  }
  .note {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  /* A floating layer: the theme's own shadow and large radius. */
  .float {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-2);
    margin: 0;
    padding: var(--cc-space-3);
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
  h4 {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-xl);
  }
  header p {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .specimen {
    display: grid;
    align-content: start;
    gap: var(--cc-space-3);
  }
  .sample {
    margin: 0;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-2);
  }
  .current {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
  }
</style>
