<!--
  One theme, showing only what a theme may change: its surfaces, the display
  face, corners, label shape, the filled action, the focus ring and the
  floating shadow.
  Everything here is a static specimen except the title link and the Use
  button, so the gallery costs a keyboard user two stops per theme.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import {
    contrastRatio,
    parseColor,
    themes,
    type AccentName,
    type ThemeName,
  } from '@codecora/tokens';
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

  // Proof for the Access themes, computed from the theme's own colours.
  const colors = $derived(themes[name].colors);
  const ratio = (a: string, b: string) => contrastRatio(parseColor(a), parseColor(b)).toFixed(1);
  const lightness = (value: string) => /oklch\(\s*([\d.]+)%/.exec(value)?.[1];
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

  <!-- Its surfaces in order, at the control radius: round themes read as pills. -->
  <div class="surfaces" aria-hidden="true">
    <span class="surface"></span>
    <span class="raised"></span>
    <span class="sunken"></span>
    <span class="accent"></span>
  </div>

  {#if accessNotes[name]}
    <p class="note">{accessNotes[name]}</p>
  {/if}
  {#if name === 'contrast'}
    <p class="proof">
      Text <strong class="num">{ratio(colors.text, colors.surface)}:1</strong>, muted text
      <strong class="num">{ratio(colors.textMuted, colors.surface)}:1</strong> on the page
    </p>
  {:else if name === 'neutral-cvd'}
    <p class="proof pairs">
      <span class="pair"><span class="fill success" aria-hidden="true"></span>Success is blue</span>
      <span class="pair"
        ><span class="fill danger" aria-hidden="true"></span>Danger is vermillion</span
      >
    </p>
  {:else if name === 'dimmed'}
    <p class="proof">
      Page at <strong class="num">{lightness(colors.surface) ?? '?'}%</strong> lightness, text
      <strong class="num">{ratio(colors.text, colors.surface)}:1</strong>: no white on black
    </p>
  {/if}

  <div class="specimen" aria-hidden="true">
    <span class="action">Save</span>
    <span class="focus">Focused</span>
    <Badge tone="success">Active</Badge>
    <Badge tone="danger">Revoked</Badge>
    <span class="float">Saved <span class="when">now</span></span>
  </div>

  <footer>
    <!-- One button that stays put, so focus does not drop when the theme changes. -->
    <Button
      variant="secondary"
      aria-pressed={current}
      onclick={() => {
        if (!current) onuse();
      }}
    >
      {#if current}
        <span>Current theme</span>
      {:else}
        <span>Use<VisuallyHidden>&nbsp;{themes[name].label}</VisuallyHidden> theme</span>
      {/if}
    </Button>
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
  /* The title opens the theme page, so it looks like a link at rest. */
  h4 a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--cc-border-strong);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.2em;
  }
  h4 a:hover {
    text-decoration-color: currentColor;
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
  .surfaces {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--cc-space-1);
  }
  .surfaces span {
    height: 1.75rem;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
  }
  .surfaces .surface {
    background: var(--cc-surface);
  }
  .surfaces .raised {
    background: var(--cc-surface-raised);
  }
  .surfaces .sunken {
    background: var(--cc-surface-sunken);
  }
  .surfaces .accent {
    border-color: var(--cc-accent);
    background: var(--cc-accent);
  }
  /* The Access proof: measured from the theme, not claimed. */
  .proof {
    margin: 0;
    padding: var(--cc-space-2) var(--cc-space-3);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-sunken);
    font-size: var(--cc-font-size-sm);
  }
  .proof.pairs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-1) var(--cc-space-3);
  }
  .num {
    font-family: var(--cc-font-mono);
    font-variant-numeric: tabular-nums;
  }
  .pair {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-2);
  }
  .fill {
    width: 1rem;
    height: 1rem;
    border-radius: var(--cc-radius-sm);
  }
  .fill.success {
    background: var(--cc-success);
  }
  .fill.danger {
    background: var(--cc-danger);
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
</style>
