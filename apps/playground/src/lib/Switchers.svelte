<script lang="ts">
  import { accentNames, densities, themeNames, themes, type ThemeName } from '@codecora/tokens';

  let {
    theme = $bindable(),
    accent = $bindable(),
    density = $bindable(),
  }: { theme: ThemeName; accent: string; density: string } = $props();
</script>

<div class="switchers">
  <fieldset>
    <legend>Theme</legend>
    <div class="seg">
      {#each themeNames as name (name)}
        <label>
          <input type="radio" name="theme" value={name} bind:group={theme} />
          <span>{themes[name].label}</span>
        </label>
      {/each}
    </div>
  </fieldset>

  <fieldset>
    <legend>Accent</legend>
    <div class="seg">
      <label>
        <input type="radio" name="accent" value="default" bind:group={accent} />
        <span>Theme default</span>
      </label>
      {#each accentNames as name (name)}
        <label>
          <input type="radio" name="accent" value={name} bind:group={accent} />
          <span>{name}</span>
        </label>
      {/each}
    </div>
  </fieldset>

  <fieldset>
    <legend>Density</legend>
    <div class="seg">
      {#each densities as name (name)}
        <label>
          <input type="radio" name="density" value={name} bind:group={density} />
          <span>{name}</span>
        </label>
      {/each}
    </div>
  </fieldset>
</div>

<style>
  .switchers {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-4) var(--cc-space-8);
  }
  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--cc-space-2);
    min-width: 0;
  }
  legend {
    padding: 0;
    font-size: var(--cc-font-size-xs);
    font-weight: 600;
    color: var(--cc-text-muted);
  }
  .seg {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-1);
  }
  label {
    position: relative;
  }
  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    margin: 0;
    cursor: pointer;
  }
  span {
    display: inline-flex;
    align-items: center;
    min-height: 2.25rem;
    padding-inline: var(--cc-space-3);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-pill);
    font-size: var(--cc-font-size-sm);
    text-transform: capitalize;
    background: var(--cc-surface-raised);
  }
  label:hover span {
    background: var(--cc-surface-hover);
  }
  /* Checked changes fill, text colour and weight. */
  input:checked + span {
    background: var(--cc-accent);
    border-color: var(--cc-accent);
    color: var(--cc-accent-text);
    font-weight: 600;
  }
  input:focus-visible + span {
    outline: 2px solid var(--cc-focus);
    outline-offset: 2px;
  }
</style>
