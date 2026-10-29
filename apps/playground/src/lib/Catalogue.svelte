<script lang="ts">
  import { VisuallyHidden } from '@codecora/ui';
  import type { AccentName, ThemeName } from '@codecora/tokens';
  import ContrastTable from './ContrastTable.svelte';
  import NestedDemo from './NestedDemo.svelte';
  import Samples from './Samples.svelte';
  import Scales from './Scales.svelte';
  import Swatches from './Swatches.svelte';

  let { theme, accent }: { theme: ThemeName; accent?: AccentName } = $props();
</script>

<section aria-labelledby="colors">
  <h2 id="colors">Colour roles</h2>
  <Swatches />
</section>

<section aria-labelledby="samples">
  <h2 id="samples">Controls and states</h2>
  <p class="lead">
    Plain HTML on tokens, to show density, focus, error, disabled and selected states before the M1
    components land.
  </p>
  <Samples id="samples-{theme}" />
</section>

<section aria-labelledby="scales">
  <h2 id="scales">Type, radius and spacing</h2>
  <Scales />
</section>

<section aria-labelledby="components">
  <h2 id="components">Components</h2>
  <p class="lead">Everything <code>@codecora/ui</code> exports today.</p>
  <dl>
    <dt><code>VisuallyHidden</code></dt>
    <dd>
      Hides text visually and keeps it for screen readers. This close button announces “Close
      dialog”.
      <button type="button" class="icon">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <VisuallyHidden>Close dialog</VisuallyHidden>
      </button>
    </dd>
  </dl>
</section>

<section aria-labelledby="nesting">
  <h2 id="nesting">Themes nest per element</h2>
  <NestedDemo />
</section>

<section aria-labelledby="contrast">
  <h2 id="contrast">Contrast pairs</h2>
  <ContrastTable {theme} {accent} />
</section>

<style>
  section {
    display: grid;
    gap: var(--cc-space-4);
    padding-block: var(--cc-space-10);
    border-top: 1px solid var(--cc-border);
  }
  h2 {
    font-size: var(--cc-font-size-2xl);
  }
  .lead {
    color: var(--cc-text-muted);
  }
  dl {
    margin: 0;
    display: grid;
    gap: var(--cc-space-2);
  }
  dd {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-gap);
    align-items: center;
    color: var(--cc-text-muted);
  }
  .icon {
    display: inline-grid;
    place-items: center;
    width: var(--cc-control-h);
    height: var(--cc-control-h);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    cursor: pointer;
  }
  .icon:hover {
    background: var(--cc-surface-hover);
  }
  .icon path {
    fill: none;
    stroke: currentColor;
    stroke-width: var(--cc-icon-stroke);
    stroke-linecap: round;
  }
</style>
