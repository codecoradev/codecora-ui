<!--
  The front page's first screen: one click per theme, and a handful of real
  components that change with it, so the library shows before any text
  about it. Each theme button is drawn in its own theme (surface, display
  face, radius, accent); the full gallery follows below.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { themeNames, themes, type ThemeName } from '@codecora/tokens';
  import { Check } from '@codecora/icons/lucide';
  import { Badge, Button, Field, Input, Link, Switch, Toaster, toast } from '@codecora/ui';
  import { groupedThemes } from './catalogue.js';

  let { theme, onpick }: { theme: ThemeName; onpick: (name: ThemeName) => void } = $props();

  // Gallery order, so the rail and the tiles below read the same way.
  const order = groupedThemes().flatMap((g) => g.themes);
  const rail = [...order, ...themeNames.filter((name) => !order.includes(name))];

  // Roving focus: the last focused theme, else the applied one, holds the Tab stop.
  let focused = $state<ThemeName | undefined>();
  const focusable = $derived(focused ?? theme);
  let railEl = $state<HTMLElement>();

  function move(event: KeyboardEvent) {
    const keys: Record<string, (i: number) => number> = {
      ArrowRight: (i) => (i + 1) % rail.length,
      ArrowDown: (i) => (i + 1) % rail.length,
      ArrowLeft: (i) => (i - 1 + rail.length) % rail.length,
      ArrowUp: (i) => (i - 1 + rail.length) % rail.length,
      Home: () => 0,
      End: () => rail.length - 1,
    };
    const step = keys[event.key];
    if (!step || !railEl) return;
    event.preventDefault();
    const next = step(rail.indexOf(focusable));
    railEl.querySelectorAll<HTMLButtonElement>('.pick')[next]?.focus();
  }

  // On phones the rail scrolls sideways; keep the applied theme in view.
  $effect(() => {
    const index = rail.indexOf(theme);
    railEl
      ?.querySelectorAll<HTMLElement>('.pick')
      [index]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });

  let name = $state('ci-deploy');
  let write = $state(true);
</script>

<section class="strip" aria-labelledby="strip-title">
  <h2 id="strip-title" class="title">Pick a theme, watch the components follow</h2>

  <!-- A toolbar: one Tab stop, arrows move between themes, Enter or Space applies one. -->
  <div
    class="rail"
    role="toolbar"
    tabindex="-1"
    aria-label="Theme"
    bind:this={railEl}
    onkeydown={move}
  >
    {#each rail as option (option)}
      <button
        type="button"
        class="pick"
        aria-pressed={option === theme}
        tabindex={option === focusable ? 0 : -1}
        onfocus={() => (focused = option)}
        onclick={() => {
          if (option !== theme) onpick(option);
        }}
      >
        <span class="face" data-theme={option}>
          <span class="glyph" aria-hidden="true">Aa</span><span class="dot" aria-hidden="true"
          ></span>
          <span class="label">{themes[option].label}</span>
          {#if option === theme}<Check class="check" aria-hidden="true" />{/if}
        </span>
      </button>
    {/each}
  </div>

  <div class="row">
    <div class="name">
      <Field label="Key name">
        {#snippet children(control)}
          <Input {...control} bind:value={name} autocomplete="off" />
        {/snippet}
      </Field>
    </div>
    <Switch bind:checked={write} label="Write access" />
    <Badge tone={write ? 'accent' : 'neutral'}>{write ? 'Read and write' : 'Read only'}</Badge>
    <Button
      variant="primary"
      onclick={() =>
        toast.success(`${name || 'Key'} saved`, write ? 'Read and write scope.' : 'Read scope.')}
    >
      Save key
    </Button>
  </div>
  <p class="more">
    <Link href="#themes-title">What each theme changes</Link>
    <Link href={resolve('/components')}>Every component in every state</Link>
  </p>
</section>

<Toaster />

<style>
  .strip {
    display: grid;
    gap: var(--cc-space-4);
    margin-top: var(--cc-space-5);
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
  }
  .title {
    margin: 0;
    font-size: var(--cc-font-size-md);
  }
  .rail {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  /* The button carries the page's focus ring; its face is painted by the theme it picks. */
  .pick {
    padding: 0;
    border: 0;
    border-radius: var(--cc-radius-md);
    background: none;
    font: inherit;
    cursor: pointer;
  }
  .pick:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .face {
    display: inline-flex;
    align-items: center;
    gap: var(--cc-space-2);
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding-inline: var(--cc-space-3);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface);
    color: var(--cc-text);
    font-size: var(--cc-font-size-sm);
  }
  .pick:hover .face {
    background: var(--cc-surface-hover);
  }
  /* The picked theme gets a heavier frame and a check, not colour alone. */
  .pick[aria-pressed='true'] .face {
    box-shadow:
      0 0 0 2px var(--cc-surface),
      0 0 0 4px var(--cc-text);
  }
  .glyph {
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-lg);
    font-weight: 600;
    line-height: 1;
  }
  /* The theme's default accent. */
  .dot {
    flex: none;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-accent);
  }
  .face :global(.check) {
    width: 1rem;
    height: 1rem;
    stroke-width: 2.5;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: var(--cc-space-3) var(--cc-space-5);
  }
  .name {
    flex: 1 1 12rem;
    max-width: 18rem;
  }
  .row > :global(.cc-badge) {
    align-self: center;
  }
  .more {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-1) var(--cc-space-5);
    margin: 0;
    font-size: var(--cc-font-size-sm);
  }
  /* Phones keep the names in one row that scrolls sideways, faded at the edge so it reads as more. */
  @media (max-width: 47.99rem) {
    .rail {
      flex-wrap: nowrap;
      overflow-x: auto;
      margin-inline: calc(var(--cc-space-4) * -1);
      padding: var(--cc-space-1) var(--cc-space-4);
      scroll-snap-type: x proximity;
      scroll-padding-inline: var(--cc-space-4);
      scrollbar-width: none;
      mask-image: linear-gradient(
        to right,
        transparent,
        var(--cc-text) var(--cc-space-4),
        var(--cc-text) calc(100% - var(--cc-space-8)),
        transparent
      );
    }
    .pick {
      flex: none;
      scroll-snap-align: start;
    }
  }
</style>
