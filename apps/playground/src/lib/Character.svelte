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
  const setup = $derived(`/* app.css */
@import 'tailwindcss';
@import '@codecora/tokens/theme.css';

<!-- the whole app, or any element -->
<html data-theme="${theme}">`);
  const faces = $derived([
    { role: 'Display', family: first(t.font.display) },
    { role: 'Text', family: first(t.font.sans) },
    { role: 'Data', family: first(t.font.mono) },
  ]);
  const facts = 'text-muted-foreground text-sm leading-[inherit]';
</script>

<div class="grid grid-cols-1 gap-8 lg:grid-cols-[var(--pg-cols-character)]">
  <div class="grid grid-cols-[var(--pg-cols-glyph)] items-center gap-6 max-[30rem]:grid-cols-1">
    <p
      class="font-display text-[length:var(--pg-glyph-size)] leading-none font-semibold tracking-[var(--pg-tracking-glyph)]"
      aria-hidden="true"
    >
      Aa
    </p>
    <div class="grid min-w-0 gap-2">
      <p class="font-display text-xl leading-[inherit] font-semibold">
        {northStars[theme]}
      </p>
      <p class="text-muted-foreground max-w-[var(--pg-measure-body)]">
        Remember that Dana's birthday is 12 March. Any later conversation, on any device, finds it.
      </p>
      <p class="font-mono text-sm leading-[inherit] tabular-nums">01a19474 · 2026-11-01 · 4.92:1</p>
      <dl class="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm leading-[inherit]">
        {#each faces as face (face.role)}
          <div>
            <dt class="text-muted-foreground">{face.role}</dt>
            <dd class="font-semibold">{systemNames[face.family] ?? face.family}</dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>

  <div class="grid content-start gap-4">
    <ul class="flex flex-wrap gap-5" aria-label="Corner radius">
      {#each ['sm', 'md', 'lg'] as r (r)}
        <li class="grid justify-items-start gap-2">
          <span
            class="border-input bg-primary-soft h-12 w-18 border"
            style:border-radius="var(--radius-{r})"
            aria-hidden="true"
          ></span>
          <code class="text-muted-foreground text-xs leading-[inherit]"
            >{r} {t.radius[r as 'sm' | 'md' | 'lg']}</code
          >
        </li>
      {/each}
    </ul>
    <div class="flex flex-wrap gap-2">
      <Badge>Draft</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="success">Synced</Badge>
      <Badge tone="danger">Failed</Badge>
    </div>
    <p class={facts}>
      Icon stroke <span class="font-mono tabular-nums">{t.icon.stroke}</span> · focus ring
      <span class="font-mono tabular-nums">{t.shape.focusWidth}</span> · {t.colorScheme} scheme
    </p>
  </div>
  <div class="col-span-full grid gap-2">
    <p class={facts}>Use this theme</p>
    <CodeBlock code={setup} language="svelte" />
  </div>
</div>
