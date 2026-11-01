<!--
  What a theme may change, at a glance: its fonts, corners, label shape, icon
  stroke and focus ring. Shown first on the Tokens and fixed theme pages.
-->
<script lang="ts">
  import { themes, type ThemeName } from '@codecora/tokens';
  import { Badge, CodeBlock } from '@codecora/ui';
  import { northStars } from './catalogue.js';

  let { theme }: { theme: ThemeName } = $props();

  const first = (stack: string) => (stack.split(',')[0] ?? stack).replaceAll("'", '').trim();
  const systemNames: Record<string, string> = {
    'ui-sans-serif': 'System sans',
    'ui-monospace': 'System mono',
  };
  const t = $derived(themes[theme]);
  // Split so the Svelte parser does not read it as the end of this block.
  const closeScript = '</' + 'script>';
  const setup = $derived(`<script>
  import '@codecora/tokens/tokens.css';
${closeScript}

<!-- the whole app, or any element -->
<html data-theme="${theme}">`);
  const faces = $derived([
    { role: 'Display', family: first(t.font.display) },
    { role: 'Text', family: first(t.font.sans) },
    { role: 'Data', family: first(t.font.mono) },
  ]);
</script>

<div class="character">
  <div class="type">
    <p class="glyph" aria-hidden="true">Aa</p>
    <div class="lines">
      <p class="name">{northStars[theme]}</p>
      <p class="body">
        Remember that Dana's birthday is 12 March. Any later conversation, on any device, finds it.
      </p>
      <p class="data">01a19474 · 2026-11-01 · 4.92:1</p>
      <dl class="faces">
        {#each faces as face (face.role)}
          <div>
            <dt>{face.role}</dt>
            <dd>{systemNames[face.family] ?? face.family}</dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>

  <div class="shape">
    <ul class="corners" aria-label="Corner radius">
      {#each ['sm', 'md', 'lg'] as r (r)}
        <li>
          <span class="box" style:border-radius="var(--cc-radius-{r})" aria-hidden="true"></span>
          <code>{r} {t.radius[r as 'sm' | 'md' | 'lg']}</code>
        </li>
      {/each}
    </ul>
    <div class="badges">
      <Badge>Draft</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="success">Synced</Badge>
      <Badge tone="danger">Failed</Badge>
    </div>
    <p class="facts">
      Icon stroke <span class="num">{t.icon.stroke}</span> · focus ring
      <span class="num">{t.shape.focusWidth}</span> · {t.colorScheme} scheme
    </p>
  </div>
  <div class="setup">
    <p class="facts">Use this theme</p>
    <CodeBlock code={setup} language="svelte" />
  </div>
</div>

<style>
  .character {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-8);
  }
  .type {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--cc-space-6);
    align-items: center;
  }
  .glyph {
    margin: 0;
    font-family: var(--cc-font-display);
    font-size: clamp(4rem, 12vw, 7rem);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .lines {
    display: grid;
    gap: var(--cc-space-2);
    min-width: 0;
  }
  .lines p {
    margin: 0;
  }
  .name {
    font-family: var(--cc-font-display);
    font-size: var(--cc-font-size-xl);
    font-weight: 600;
  }
  .body {
    max-width: 55ch;
    color: var(--cc-text-muted);
  }
  .data,
  .num {
    font-family: var(--cc-font-mono);
    font-variant-numeric: tabular-nums;
  }
  .data {
    font-size: var(--cc-font-size-sm);
  }
  .faces {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2) var(--cc-space-6);
    margin: var(--cc-space-2) 0 0;
    font-size: var(--cc-font-size-sm);
  }
  .faces dt {
    color: var(--cc-text-muted);
  }
  .faces dd {
    margin: 0;
    font-weight: 600;
  }
  .shape {
    display: grid;
    gap: var(--cc-space-4);
    align-content: start;
  }
  .corners {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-5);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .corners li {
    display: grid;
    justify-items: start;
    gap: var(--cc-space-2);
  }
  .box {
    width: 4.5rem;
    height: 3rem;
    border: 1px solid var(--cc-border-strong);
    background: var(--cc-accent-soft);
  }
  .corners code {
    font-size: var(--cc-font-size-xs);
    color: var(--cc-text-muted);
  }
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  .facts {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .setup {
    display: grid;
    gap: var(--cc-space-2);
    grid-column: 1 / -1;
  }
  @media (min-width: 64rem) {
    .character {
      grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    }
  }
  @media (max-width: 30rem) {
    .type {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
