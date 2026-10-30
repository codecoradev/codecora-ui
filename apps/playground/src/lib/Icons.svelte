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
</script>

<section aria-labelledby="i-contract">
  <h2 id="i-contract">Size and stroke come from the theme</h2>
  <p class="lead">
    <code>--cc-icon-size</code> and <code>--cc-icon-stroke</code> are semantic tokens, so a theme can
    change icon weight. Each row is one theme, drawn with that theme's own values.
  </p>
  <ul class="themes">
    {#each themeNames as name (name)}
      <li data-theme={name}>
        <span class="theme-name">{themes[name].label}</span>
        <span class="values">stroke {themes[name].icon.stroke}, size {themes[name].icon.size}</span>
        <span class="row" aria-hidden="true">
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

<section aria-labelledby="i-usage">
  <h2 id="i-usage">Using it</h2>
  <div class="row">
    <Button variant="primary" icon={lucide.Plus}>Create key</Button>
    <IconButton icon={lucide.Trash} label="Delete" variant="danger" />
    <span class="inline"><Icon icon={lucide.CircleCheck} label="Verified" /> Verified</span>
    <span class="inline"
      ><Icon icon={Copy} size="0.875rem" stroke={2.5} /> One-off size and stroke</span
    >
  </div>
  <p class="muted">
    Decorative icons are hidden from assistive technology; the one labelled "Verified" is an image
    with a name.
  </p>
</section>

<section aria-labelledby="i-phosphor">
  <h2 id="i-phosphor">Phosphor adapter</h2>
  <p class="lead">
    Phosphor draws weight with a prop, so the theme stroke maps to a weight. Weight for stroke 1.75
    is <code>{weightForStroke(1.75)}</code>; 2.5 is <code>{weightForStroke(2.5)}</code>.
  </p>
  <div class="row">
    {#each ['thin', 'light', 'regular', 'bold'] as const as weight (weight)}
      <span class="inline">
        <PhosphorIcon icon={PhPlus} {weight} />
        <PhosphorIcon icon={PhBell} {weight} />
        <PhosphorIcon icon={PhTrash} {weight} />
        {weight}
      </span>
    {/each}
  </div>
</section>

<section aria-labelledby="i-set">
  <h2 id="i-set">Curated Lucide set ({names.length})</h2>
  <ul class="grid">
    {#each names as name (name)}
      <li>
        <Icon icon={lucide[name]} />
        <span>{name}</span>
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  .lead,
  .muted {
    color: var(--cc-text-muted);
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .themes {
    display: grid;
    gap: var(--cc-space-3);
  }
  .themes li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-4);
    padding: var(--cc-space-3) var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
  }
  .theme-name {
    min-width: 5rem;
    font-weight: 600;
  }
  .values {
    min-width: 10rem;
    color: var(--cc-text-muted);
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-sm);
  }
  .row,
  .inline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-3);
  }
  .inline {
    gap: var(--cc-space-2);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: var(--cc-space-2);
  }
  .grid li {
    display: flex;
    align-items: center;
    gap: var(--cc-space-2);
    padding: var(--cc-space-2) var(--cc-space-3);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-sm);
    font-size: var(--cc-font-size-sm);
  }
</style>
