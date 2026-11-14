<script lang="ts">
  import { resolve } from '$app/paths';
  import { VisuallyHidden } from '@codecora/ui';
  import { themes, type AccentName, type ThemeName } from '@codecora/tokens';
  import Character from './Character.svelte';
  import ContrastTable from './ContrastTable.svelte';
  import NestedDemo from './NestedDemo.svelte';
  import Samples from './Samples.svelte';
  import Scales from './Scales.svelte';
  import Swatches from './Swatches.svelte';

  let { theme, accent }: { theme: ThemeName; accent?: AccentName } = $props();
</script>

<section class="border-border grid gap-4 border-t py-10" aria-labelledby="character">
  <h2 id="character" class="text-[length:var(--cc-font-size-2xl)] font-bold">
    The face of {themes[theme].label}
  </h2>
  <p class="text-muted-foreground">
    What a theme may change: fonts, corners, label shape, icon stroke and focus ring. Structure and
    accessibility stay the same in every theme.
  </p>
  <Character {theme} />
</section>

<section class="border-border grid gap-4 border-t py-10" aria-labelledby="colors">
  <h2 id="colors" class="text-[length:var(--cc-font-size-2xl)] font-bold">Colour roles</h2>
  <Swatches />
</section>

<section class="border-border grid gap-4 border-t py-10" aria-labelledby="samples">
  <h2 id="samples" class="text-[length:var(--cc-font-size-2xl)] font-bold">Controls and states</h2>
  <p class="text-muted-foreground">
    Plain HTML on tokens, to show density, focus, error, disabled and selected states. The real
    components are on the Components page.
  </p>
  <Samples id="samples-{theme}" />
</section>

<section class="border-border grid gap-4 border-t py-10" aria-labelledby="scales">
  <h2 id="scales" class="text-[length:var(--cc-font-size-2xl)] font-bold">
    Type, radius and spacing
  </h2>
  <Scales />
</section>

<section class="border-border grid gap-4 border-t py-10" aria-labelledby="components">
  <h2 id="components" class="text-[length:var(--cc-font-size-2xl)] font-bold">Utilities</h2>
  <p class="text-muted-foreground">
    Every <code>@codecora/ui</code> component is on the
    <a href={resolve('/components')}>Components page</a>. This one has no look of its own, so it is
    shown here.
  </p>
  <dl class="grid gap-2">
    <dt><code>VisuallyHidden</code></dt>
    <dd class="text-muted-foreground gap-stack flex flex-wrap items-center">
      Hides text visually and keeps it for screen readers. This close button announces “Close
      dialog”.
      <button
        type="button"
        class="border-input bg-card text-foreground hover:bg-accent size-control inline-grid cursor-pointer place-items-center rounded-md border px-1.5 py-px"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            class="[stroke-width:var(--cc-icon-stroke)]"
          />
        </svg>
        <VisuallyHidden>Close dialog</VisuallyHidden>
      </button>
    </dd>
  </dl>
</section>

<section class="border-border grid gap-4 border-t py-10" aria-labelledby="nesting">
  <h2 id="nesting" class="text-[length:var(--cc-font-size-2xl)] font-bold">
    Themes nest per element
  </h2>
  <NestedDemo />
</section>

<section class="border-border grid gap-4 border-t py-10" aria-labelledby="contrast">
  <h2 id="contrast" class="text-[length:var(--cc-font-size-2xl)] font-bold">Contrast pairs</h2>
  <ContrastTable {theme} {accent} />
</section>
