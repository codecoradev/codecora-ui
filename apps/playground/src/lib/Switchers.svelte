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

  const fieldset = 'grid min-w-0 gap-2';
  const legend = 'text-muted-foreground text-[length:var(--cc-font-size-xs)] font-semibold';
  const seg = 'flex flex-wrap gap-1';
  const label = 'group relative';
  const input = 'peer absolute inset-0 cursor-pointer opacity-0';
  /* Checked changes fill, text colour and weight. */
  const chipText =
    'border-input bg-card group-hover:peer-not-checked:bg-accent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-ring inline-flex min-h-9 max-w-full items-center rounded-full border px-3 text-[length:var(--cc-font-size-sm)] peer-checked:font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2';
  /* A theme chip is a mini swatch of that theme: surface, sunken, accent, at its own radius. */
  const chip =
    'border-input mr-2 h-4.5 w-7 flex-none rounded-sm border bg-transparent bg-[linear-gradient(90deg,var(--cc-surface)_0_34%,var(--cc-surface-sunken)_34%_67%,var(--cc-accent)_67%)]';
  const dot =
    'bg-primary mr-2 block size-3 rounded-full [box-shadow:0_0_0_1px_var(--cc-surface-raised)]';
</script>

<div class="flex flex-wrap gap-x-8 gap-y-4">
  {#if part !== 'more'}
    <fieldset class={fieldset}>
      <legend class={legend}>Theme</legend>
      <div class="grid gap-3">
        {#each groups as { group, themes: names } (group)}
          <div class="grid gap-1" role="group" aria-labelledby="sw-{part}-{group}">
            <p
              class="text-muted-foreground text-[length:var(--cc-font-size-xs)]"
              id="sw-{part}-{group}"
            >
              {group}
            </p>
            <!-- Access chips stack, each with its note right under it. -->
            <div class={group === 'Access' ? 'grid gap-2' : seg}>
              {#each names as name (name)}
                <div>
                  <label class={label}>
                    <input
                      class={input}
                      type="radio"
                      name="theme-{part}"
                      value={name}
                      bind:group={theme}
                      aria-describedby={accessNotes[name] ? `note-${part}-${name}` : undefined}
                    />
                    <span class={chipText}
                      ><span class={chip} data-theme={name} aria-hidden="true"></span>{themes[name]
                        .label}</span
                    >
                  </label>
                  {#if accessNotes[name]}
                    <p
                      class="text-muted-foreground max-w-description mt-1 ml-3 text-[length:var(--cc-font-size-xs)]"
                      id="note-{part}-{name}"
                    >
                      {accessNotes[name]}
                    </p>
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
    <fieldset class={fieldset}>
      <legend class={legend}>Accent</legend>
      <div class={seg}>
        <label class={label}>
          <input
            class={input}
            type="radio"
            name="accent-{part}"
            value="default"
            bind:group={accent}
          />
          <span class={chipText}
            ><span class={dot} data-theme={theme} aria-hidden="true"></span>Theme default
            <span class="font-normal">({themes[theme].defaultAccent})</span></span
          >
        </label>
        {#each accentNames as name (name)}
          <label class={label}>
            <input
              class={input}
              type="radio"
              name="accent-{part}"
              value={name}
              bind:group={accent}
            />
            <span class={chipText}
              ><span class={dot} data-accent={name} aria-hidden="true"></span><span
                class="capitalize">{name}</span
              ></span
            >
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset class={fieldset}>
      <legend class={legend}>Density</legend>
      <div class={seg}>
        {#each densities as name (name)}
          <label class={label}>
            <input
              class={input}
              type="radio"
              name="density-{part}"
              value={name}
              bind:group={density}
            />
            <span class={chipText}><span class="capitalize">{name}</span></span>
          </label>
        {/each}
      </div>
    </fieldset>
  {/if}
</div>
