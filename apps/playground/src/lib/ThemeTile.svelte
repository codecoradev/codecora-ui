<!--
  One theme, shown with real components. Every tile on the overview is the
  same markup; only data-theme changes.
-->
<script lang="ts">
  import { themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import { Badge, Button, Input, Progress, Switch, VisuallyHidden } from '@codecora/ui';
  import { northStars } from './catalogue.js';

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
    <h3 id="tile-{name}">{themes[name].label}</h3>
    <p>{northStars[name]}</p>
  </header>

  <div class="specimen">
    <p class="sample">Memory synced 2 min ago.</p>
    <Input aria-label="Key name ({themes[name].label})" value="ci-deploy" autocomplete="off" />
    <div class="row">
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Expiring</Badge>
      <Badge tone="danger">Revoked</Badge>
    </div>
    <Progress label="Quota" value={62} showValue />
    <Switch label="Sync on save" checked id="switch-{name}" />
  </div>

  <footer>
    {#if current}
      <span class="current">Current theme</span>
    {:else}
      <Button variant="secondary" onclick={onuse}
        >Use<VisuallyHidden>&nbsp;{themes[name].label}</VisuallyHidden> theme</Button
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
    display: grid;
    gap: var(--cc-space-1);
  }
  h3 {
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
