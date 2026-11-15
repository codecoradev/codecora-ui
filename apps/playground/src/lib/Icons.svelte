<!-- The @codecora/icons contract: Icon, the curated Lucide set, the Phosphor adapter. -->
<script lang="ts">
  import { Icon } from '@codecora/icons';
  import * as lucide from '@codecora/icons/lucide';
  import { PhosphorIcon, weightForStroke } from '@codecora/icons/phosphor';
  import { themeNames, themes } from '@codecora/tokens';
  import { Button, IconButton } from '@codecora/ui';
  import PhBell from 'phosphor-svelte/lib/Bell';
  import PhPlus from 'phosphor-svelte/lib/Plus';
  import PhTrash from 'phosphor-svelte/lib/Trash';
  import Copy from '@lucide/svelte/icons/copy';

  const names = Object.keys(lucide) as (keyof typeof lucide)[];

  const section = 'grid grid-cols-1 gap-4 pb-10';
  const h2 = 'text-xl leading-heading font-bold';
  const row = 'flex flex-wrap items-center gap-3';
  const inline = 'flex flex-wrap items-center gap-2';
</script>

<section aria-labelledby="i-contract" class={section}>
  <h2 id="i-contract" class={h2}>Size and stroke come from the theme</h2>
  <p class="text-muted-foreground">
    <code>--cc-icon-size</code> and <code>--cc-icon-stroke</code> are semantic tokens, so a theme can
    change icon weight. Each row is one theme, drawn with that theme's own values.
  </p>
  <ul class="grid gap-3">
    {#each themeNames as name (name)}
      <li
        data-theme={name}
        class="border-border bg-card text-foreground flex flex-wrap items-center gap-4 rounded-md border px-4 py-3"
      >
        <span class="min-w-20 font-semibold">{themes[name].label}</span>
        <span class="text-muted-foreground min-w-40 font-mono text-sm leading-[inherit]"
          >stroke {themes[name].icon.stroke}, size {themes[name].icon.size}</span
        >
        <span class={row} aria-hidden="true">
          <Icon icon={lucide.Plus} />
          <Icon icon={lucide.Search} />
          <Icon icon={lucide.Settings} />
          <Icon icon={lucide.Bell} />
          <Icon icon={lucide.Trash} />
        </span>
      </li>
    {/each}
  </ul>
</section>

<section aria-labelledby="i-usage" class={section}>
  <h2 id="i-usage" class={h2}>Using it</h2>
  <div class={row}>
    <Button variant="primary" icon={lucide.Plus}>Create key</Button>
    <IconButton icon={lucide.Trash} label="Delete" variant="danger" />
    <span class={inline}><Icon icon={lucide.CircleCheck} label="Verified" /> Verified</span>
    <span class={inline}
      ><Icon icon={Copy} size="0.875rem" stroke={2.5} /> One-off size and stroke</span
    >
  </div>
  <p class="text-muted-foreground">
    Decorative icons are hidden from assistive technology; the one labelled "Verified" is an image
    with a name.
  </p>
</section>

<section aria-labelledby="i-phosphor" class={section}>
  <h2 id="i-phosphor" class={h2}>Phosphor adapter</h2>
  <p class="text-muted-foreground">
    Phosphor draws weight with a prop, so the theme stroke maps to a weight. Weight for stroke 1.75
    is <code>{weightForStroke(1.75)}</code>; 2.5 is <code>{weightForStroke(2.5)}</code>.
  </p>
  <div class={row}>
    {#each ['thin', 'light', 'regular', 'bold'] as const as weight (weight)}
      <span class={inline}>
        <PhosphorIcon icon={PhPlus} {weight} />
        <PhosphorIcon icon={PhBell} {weight} />
        <PhosphorIcon icon={PhTrash} {weight} />
        {weight}
      </span>
    {/each}
  </div>
</section>

<section aria-labelledby="i-set" class={section}>
  <h2 id="i-set" class={h2}>Curated Lucide set ({names.length})</h2>
  <ul class="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*36),1fr))] gap-2">
    {#each names as name (name)}
      <li
        class="border-border flex items-center gap-2 rounded-sm border px-3 py-2 text-sm leading-[inherit]"
      >
        <Icon icon={lucide[name]} />
        <span>{name}</span>
      </li>
    {/each}
  </ul>
</section>
