<!--
  One theme, showing only what a theme may change: its surfaces, the display
  face, corners, label shape, the filled action, the focus ring and the
  floating shadow.
  Everything here is a static specimen except the title link, so the gallery
  costs a keyboard user one stop per theme; themes are applied from the rail
  above or the toolbar.
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
  import { Badge } from '@codecora/ui';
  import { accessNotes, northStars } from './catalogue.js';

  interface Props {
    name: ThemeName;
    accent?: AccentName;
    density?: string;
    current: boolean;
  }

  let { name, accent, density, current }: Props = $props();

  // Proof for the Access themes, computed from the theme's own colours.
  const colors = $derived(themes[name].colors);
  const ratio = (a: string, b: string) => contrastRatio(parseColor(a), parseColor(b)).toFixed(1);
  const lightness = (value: string) => /oklch\(\s*([\d.]+)%/.exec(value)?.[1];

  const muted = 'text-muted-foreground text-[length:var(--cc-font-size-sm)]';
  const surface = 'h-7 rounded-md border';
  const proof = 'bg-muted rounded-md px-3 py-2 text-[length:var(--cc-font-size-sm)]';
  const num = 'font-mono tabular-nums';
  const pair = 'inline-flex items-center gap-2';
</script>

<article
  class="border-input grid min-w-0 gap-3 rounded-lg border p-4"
  data-theme={name}
  data-accent={accent}
  data-density={density}
  aria-labelledby="tile-{name}"
>
  <header class="flex items-start justify-between gap-3">
    <div class="grid min-w-0 gap-1">
      <h4 id="tile-{name}" class="font-display text-[length:var(--cc-font-size-xl)] font-bold">
        <!-- The title opens the theme page, so it looks like a link at rest. -->
        <a
          class="decoration-input underline-offset-text focus-visible:outline-ring text-inherit underline decoration-2 hover:decoration-current focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)]"
          href={resolve('/themes/[theme]', { theme: name })}>{themes[name].label}</a
        >
      </h4>
      <p class={muted}>{northStars[name]}</p>
    </div>
    <span
      class="font-display text-[length:var(--cc-font-size-3xl)] leading-none font-semibold"
      aria-hidden="true">Aa</span
    >
  </header>

  <!-- Its surfaces in order, at the control radius: round themes read as pills. -->
  <div class="grid grid-cols-4 gap-1" aria-hidden="true">
    <span class="{surface} border-border bg-background"></span>
    <span class="{surface} border-border bg-card"></span>
    <span class="{surface} border-border bg-muted"></span>
    <span class="{surface} border-primary bg-primary"></span>
  </div>

  {#if accessNotes[name]}
    <p class={muted}>{accessNotes[name]}</p>
  {/if}
  <!-- The Access proof: measured from the theme, not claimed. -->
  {#if name === 'contrast'}
    <p class={proof}>
      Text <strong class={num}>{ratio(colors.text, colors.surface)}:1</strong>, muted text
      <strong class={num}>{ratio(colors.textMuted, colors.surface)}:1</strong> on the page
    </p>
  {:else if name === 'neutral-cvd'}
    <p class="{proof} flex flex-wrap gap-x-3 gap-y-1">
      <span class={pair}
        ><span class="bg-success size-4 rounded-sm" aria-hidden="true"></span>Success is blue</span
      >
      <span class={pair}
        ><span class="bg-destructive size-4 rounded-sm" aria-hidden="true"></span>Danger is
        vermillion</span
      >
    </p>
  {:else if name === 'dimmed'}
    <p class={proof}>
      Page at <strong class={num}>{lightness(colors.surface) ?? '?'}%</strong> lightness, text
      <strong class={num}>{ratio(colors.text, colors.surface)}:1</strong>: no white on black
    </p>
  {/if}

  <div class="flex flex-wrap items-center gap-2" aria-hidden="true">
    <!-- The filled action as the theme draws it: accent, radius, label colour. -->
    <span
      class="min-h-control px-control-x bg-primary text-primary-foreground inline-flex items-center rounded-md text-[length:var(--cc-font-size-sm)] font-semibold"
      >Save</span
    >
    <!-- The focus ring, drawn on so its width and offset can be compared. -->
    <span
      class="min-h-control px-control-x border-input bg-card outline-ring inline-flex items-center rounded-md border text-[length:var(--cc-font-size-sm)] outline-[length:var(--cc-focus-width)] outline-offset-[var(--cc-focus-offset)]"
      >Focused</span
    >
    <Badge tone="success">Active</Badge>
    <Badge tone="danger">Revoked</Badge>
    <!-- A floating layer: the theme's own shadow and large radius. -->
    <span
      class="border-border bg-card shadow-popover inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[length:var(--cc-font-size-sm)]"
      >Saved <span class="text-muted-foreground font-mono tabular-nums">now</span></span
    >
  </div>

  {#if current}
    <footer class="flex"><Badge tone="accent">Current theme</Badge></footer>
  {/if}
</article>
