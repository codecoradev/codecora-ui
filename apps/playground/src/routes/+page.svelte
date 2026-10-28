<script lang="ts">
  import { VisuallyHidden } from '@codecora/ui';
</script>

<svelte:head>
  <title>CodeCora UI playground</title>
</svelte:head>

{#snippet sample(title: string)}
  <h2>{title}</h2>
  <p class="muted">Muted text on the theme surface.</p>
  <button type="button" class="primary">Primary action</button>
  <span class="soft">Selected</span>
  <span class="danger">Danger text</span>
{/snippet}

<main>
  <h1>CodeCora UI playground</h1>
  <p class="muted">
    Skeleton for M0. The catalogue with theme, density and accent switchers comes with issue #5.
  </p>
  <button type="button" class="primary">
    <span aria-hidden="true">×</span>
    <VisuallyHidden>Close (sample of a package component)</VisuallyHidden>
  </button>

  <section aria-labelledby="nesting">
    <h2 id="nesting">Themes nest per element</h2>
    <div class="grid">
      <div class="panel" data-theme="uteke">
        {@render sample('uteke')}
        <div class="panel" data-theme="corin">
          {@render sample('corin inside uteke')}
        </div>
      </div>
      <div class="panel" data-theme="corin" data-accent="violet" data-density="compact">
        {@render sample('corin, violet accent, compact')}
        <div class="panel" data-theme="neutral" data-density="comfortable">
          {@render sample('neutral inside corin, comfortable')}
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  main {
    font-family: var(--cc-font-sans);
    padding: var(--cc-space-6) var(--cc-space-4);
    max-width: 72rem;
    margin-inline: auto;
  }
  h1,
  h2 {
    font-family: var(--cc-font-display);
  }
  .muted {
    color: var(--cc-text-muted);
  }
  .grid {
    display: grid;
    gap: var(--cc-space-4);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  }
  .panel {
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    padding: var(--cc-gap);
    display: grid;
    gap: var(--cc-gap);
    justify-items: start;
  }
  .primary {
    min-height: var(--cc-control-h);
    padding-inline: var(--cc-control-px);
    border: 0;
    border-radius: var(--cc-radius-md);
    background: var(--cc-accent);
    color: var(--cc-accent-text);
    font: inherit;
    cursor: pointer;
    transition: background-color var(--cc-duration-fast) var(--cc-ease-out);
  }
  .primary:hover {
    background: var(--cc-accent-hover);
  }
  .primary:focus-visible {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
  }
  .soft {
    background: var(--cc-accent-soft);
    padding: var(--cc-space-1) var(--cc-space-2);
    border-radius: var(--cc-radius-pill);
  }
  .danger {
    color: var(--cc-danger);
  }
</style>
