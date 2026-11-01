<!--
  Theme, accent and density radios. `part` picks what to show: the theme
  groups, the accent and density rows ("more"), or everything.
-->
<script lang="ts">
  import { accentNames, densities, themes, type ThemeName } from '@codecora/tokens';
  import { accessNotes, groupedThemes } from './catalogue.js';

  let {
    theme = $bindable(),
    accent = $bindable(),
    density = $bindable(),
    part = 'all',
  }: {
    theme: ThemeName;
    accent: string;
    density: string;
    part?: 'all' | 'theme' | 'more';
  } = $props();

  const groups = groupedThemes();
</script>

<div class="switchers">
  {#if part !== 'more'}
    <fieldset>
      <legend>Theme</legend>
      <div class="groups">
        {#each groups as { group, themes: names } (group)}
          <div class="group" role="group" aria-labelledby="sw-{part}-{group}">
            <p class="group-name" id="sw-{part}-{group}">{group}</p>
            <!-- Access chips stack, each with its note right under it. -->
            <div class={group === 'Access' ? 'stack' : 'seg'}>
              {#each names as name (name)}
                <div class="item">
                  <label>
                    <input
                      type="radio"
                      name="theme-{part}"
                      value={name}
                      bind:group={theme}
                      aria-describedby={accessNotes[name] ? `note-${part}-${name}` : undefined}
                    />
                    <span
                      ><span class="chip" data-theme={name} aria-hidden="true"></span>{themes[name]
                        .label}</span
                    >
                  </label>
                  {#if accessNotes[name]}
                    <p class="note" id="note-{part}-{name}">{accessNotes[name]}</p>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </fieldset>
  {/if}

  {#if part !== 'theme'}
    <fieldset>
      <legend>Accent</legend>
      <div class="seg">
        <label>
          <input type="radio" name="accent-{part}" value="default" bind:group={accent} />
          <span
            ><span class="dot solo" data-theme={theme} aria-hidden="true"></span>Theme default</span
          >
        </label>
        {#each accentNames as name (name)}
          <label>
            <input type="radio" name="accent-{part}" value={name} bind:group={accent} />
            <span
              ><span class="dot solo" data-accent={name} aria-hidden="true"></span><span class="cap"
                >{name}</span
              ></span
            >
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset>
      <legend>Density</legend>
      <div class="seg">
        {#each densities as name (name)}
          <label>
            <input type="radio" name="density-{part}" value={name} bind:group={density} />
            <span><span class="cap">{name}</span></span>
          </label>
        {/each}
      </div>
    </fieldset>
  {/if}
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
  .groups {
    display: grid;
    gap: var(--cc-space-3);
  }
  .group {
    display: grid;
    gap: var(--cc-space-1);
  }
  .group-name {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
  }
  .stack {
    display: grid;
    gap: var(--cc-space-2);
  }
  .note {
    max-width: 40ch;
    margin: var(--cc-space-1) 0 0 var(--cc-space-3);
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
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
  label > span {
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    min-height: 2.25rem;
    padding-inline: var(--cc-space-3);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-pill);
    font-size: var(--cc-font-size-sm);
    background: var(--cc-surface-raised);
  }
  /* A theme chip is a mini swatch of that theme: surface, sunken, accent, at its own radius. */
  .chip {
    flex: none;
    width: 1.75rem;
    height: 1.125rem;
    margin-right: var(--cc-space-2);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-sm);
    background: linear-gradient(
      90deg,
      var(--cc-surface) 0 34%,
      var(--cc-surface-sunken) 34% 67%,
      var(--cc-accent) 67%
    );
  }
  .dot {
    display: block;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-accent);
  }
  /* Accent and density names are lower-case tokens; theme labels keep their own case. */
  .cap {
    text-transform: capitalize;
  }
  .dot.solo {
    width: 0.75rem;
    height: 0.75rem;
    margin-right: var(--cc-space-2);
    box-shadow: 0 0 0 1px var(--cc-surface-raised);
  }
  label:hover > span {
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
