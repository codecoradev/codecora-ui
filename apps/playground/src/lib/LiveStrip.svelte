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
      // A horizontal toolbar: Left and Right only, so Up and Down stay with the page.
      ArrowRight: (i) => (i + 1) % rail.length,
      ArrowLeft: (i) => (i - 1 + rail.length) % rail.length,
      Home: () => 0,
      End: () => rail.length - 1,
    };
    const step = keys[event.key];
    if (!step || !railEl) return;
    event.preventDefault();
    const next = step(rail.indexOf(focusable));
    railEl.querySelectorAll<HTMLButtonElement>('.pick')[next]?.focus();
  }

  // On phones the rail scrolls sideways; keep the applied theme in view by
  // scrolling the rail alone, never the page, and only when it overflows.
  $effect(() => {
    const index = rail.indexOf(theme);
    if (!railEl || railEl.scrollWidth <= railEl.clientWidth) return;
    const pick = railEl.querySelectorAll<HTMLElement>('.pick')[index];
    if (!pick) return;
    const left = pick.offsetLeft;
    const right = left + pick.offsetWidth;
    if (left < railEl.scrollLeft || right > railEl.scrollLeft + railEl.clientWidth) {
      railEl.scrollLeft = Math.max(0, left - (railEl.clientWidth - pick.offsetWidth) / 2);
    }
  });

  let name = $state('ci-deploy');
  let write = $state(true);
</script>

<section
  class="border-border bg-card mt-5 grid gap-4 rounded-lg border p-4"
  aria-labelledby="strip-title"
>
  <h2 id="strip-title" class="text-[length:var(--cc-font-size-md)] font-bold">
    Pick a theme, watch the components follow
  </h2>

  <!-- A toolbar: one Tab stop, arrows move between themes, Enter or Space applies one.
       Positioned, so each button's offsetLeft is measured from the rail. Phones keep the
       names in one row that scrolls sideways, faded at the edge so it reads as more. -->
  <div
    class="relative flex flex-wrap gap-2 max-[47.99rem]:-mx-4 max-[47.99rem]:snap-x max-[47.99rem]:snap-proximity max-[47.99rem]:scroll-px-4 max-[47.99rem]:[scrollbar-width:none] max-[47.99rem]:flex-nowrap max-[47.99rem]:overflow-x-auto max-[47.99rem]:[mask-image:linear-gradient(to_right,transparent,var(--cc-text)_var(--cc-space-4),var(--cc-text)_calc(100%-var(--cc-space-8)),transparent)] max-[47.99rem]:px-4 max-[47.99rem]:py-1"
    role="toolbar"
    tabindex="-1"
    aria-label="Theme"
    aria-orientation="horizontal"
    bind:this={railEl}
    onkeydown={move}
  >
    {#each rail as option (option)}
      <!-- The button carries the page's focus ring; its face is painted by the theme it picks. -->
      <button
        type="button"
        class="pick group font-inherit focus-visible:outline-ring cursor-pointer rounded-md border-0 bg-transparent p-0 focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)] max-[47.99rem]:flex-none max-[47.99rem]:snap-start"
        aria-pressed={option === theme}
        tabindex={option === focusable ? 0 : -1}
        onfocus={() => (focused = option)}
        onclick={() => {
          if (option !== theme) onpick(option);
        }}
      >
        <!-- The picked theme gets a heavier frame and a check, not colour alone. -->
        <span
          class="border-input bg-background text-foreground group-hover:bg-accent inline-flex min-h-11 min-w-11 items-center gap-2 rounded-md border px-3 text-[length:var(--cc-font-size-sm)] group-aria-pressed:[box-shadow:0_0_0_2px_var(--cc-surface),0_0_0_4px_var(--cc-text)]"
          data-theme={option}
        >
          <span
            class="font-display text-[length:var(--cc-font-size-lg)] leading-none font-semibold"
            aria-hidden="true">Aa</span
          ><!-- The theme's default accent. --><span
            class="bg-primary size-2 flex-none rounded-full"
            aria-hidden="true"
          ></span>
          <span>{themes[option].label}</span>
          {#if option === theme}<Check class="size-4" strokeWidth={2.5} aria-hidden="true" />{/if}
        </span>
      </button>
    {/each}
  </div>

  <div class="flex flex-wrap items-end gap-x-5 gap-y-3 [&>.cc-badge]:self-center">
    <div class="max-w-2xs shrink grow basis-48">
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
  <p class="flex flex-wrap gap-x-5 gap-y-1 text-[length:var(--cc-font-size-sm)]">
    <Link href="#themes-title">What each theme changes</Link>
    <Link href={resolve('/components')}>Every component in every state</Link>
  </p>
</section>

<Toaster />
