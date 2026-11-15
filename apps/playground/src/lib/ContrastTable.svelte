<script lang="ts">
  import { checkTheme, themes, type AccentName, type ThemeName } from '@codecora/tokens';

  let { theme, accent }: { theme: ThemeName; accent?: AccentName } = $props();

  const token = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const results = $derived(checkTheme(themes[theme], accent));
  const failures = $derived(results.filter((r) => !r.pass).length);

  const cell = 'py-cell-y px-cell-x border-border border-b whitespace-nowrap';
  const thCell = `${cell} bg-muted text-muted-foreground font-semibold`;
  const th = `${thCell} text-start`;
  const td = `${cell} in-[tr:last-child]:border-b-0`;
  const sample =
    'border-border inline-grid h-7 w-10 place-items-center rounded-sm border font-semibold';
</script>

<p class="mb-4">
  <span class="font-mono tabular-nums">{results.length}</span> pairs checked for {themes[theme]
    .label} with the
  <strong>{accent ?? themes[theme].defaultAccent}</strong> accent:
  {#if failures === 0}
    all meet WCAG 2.2 AA.
  {:else}
    <strong class="text-destructive"
      ><span class="font-mono tabular-nums">{failures}</span> below AA.</strong
    >
  {/if}
</p>

<!-- A scrollable region must be reachable by keyboard (axe: scrollable-region-focusable). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="border-border overflow-x-auto rounded-md border"
  role="region"
  aria-label="Table of contrast ratios"
  tabindex="0"
>
  <table class="w-full border-collapse text-[length:var(--cc-font-size-sm)]">
    <thead>
      <tr>
        <th scope="col" class={th}>Sample</th>
        <th scope="col" class={th}>Foreground</th>
        <th scope="col" class={th}>Background</th>
        <th scope="col" class="{thCell} text-end">Ratio</th>
        <th scope="col" class="{thCell} text-end">Minimum</th>
      </tr>
    </thead>
    <tbody>
      {#each results as r (`${r.fg}/${r.bg}`)}
        <tr class="hover:bg-accent">
          <td class={td}>
            {#if r.min >= 4.5}
              <span
                class={sample}
                style:color="var(--cc-{token(r.fg)})"
                style:background="var(--cc-{token(r.bg)})">Aa</span
              >
            {:else}
              <!-- A 3:1 pair is a boundary or focus ring, so it is drawn as one, not as text. -->
              <span class={sample} style:background="var(--cc-{token(r.bg)})" aria-hidden="true">
                <span
                  class="h-4 w-6 rounded-sm border-2"
                  style:border-color="var(--cc-{token(r.fg)})"
                ></span>
              </span>
            {/if}
          </td>
          <td class={td}><code>{token(r.fg)}</code></td>
          <td class={td}><code>{token(r.bg)}</code></td>
          <td class="{td} text-end font-mono tabular-nums">{r.ratio.toFixed(2)}:1</td>
          <td class="{td} text-end font-mono tabular-nums">
            {r.min}:1
            {#if !r.pass}<strong class="text-destructive">fails</strong>{/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
