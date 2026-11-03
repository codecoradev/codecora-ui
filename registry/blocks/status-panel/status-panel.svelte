<!--
  A status card for diagnostics and error states: a tinted icon, a title and
  subtitle, an action button, a strip of labelled stats (status, endpoint,
  latency, time) and a panel of explanation sections ("Why it failed", "What
  to do") with a footnote. The tone sets the icon and tint; danger is announced
  as an alert, the other tones as a polite status. The app owns this file:
  replace the copy and the stats with its own.
-->
<script lang="ts">
  import { Button, type IconComponent, type Tone } from '@codecora/ui';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import Info from '@lucide/svelte/icons/info';
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

  interface Stat {
    label: string;
    value: string;
    /** Colours the value, for example the status of a request. */
    tone?: Tone;
    /** Machine values (endpoints, times, counts) read better in mono. */
    mono?: boolean;
  }

  interface Props {
    tone?: Tone;
    title?: string;
    description?: string;
    /** Replaces the icon the tone picks. */
    icon?: IconComponent;
    actionLabel?: string;
    onaction?: () => void;
    stats?: Stat[];
    sections?: { title: string; text: string }[];
    /** A muted line under the sections. */
    note?: string;
  }

  let {
    tone = 'danger',
    title = 'Your first request needs a fix',
    description = 'Here is what went wrong and how to fix it.',
    icon,
    actionLabel = 'Open request log',
    onaction,
    stats = [
      { label: 'Status', value: '401 Unauthorized', tone: 'danger' },
      { label: 'Endpoint', value: 'GET /v1/items', mono: true },
      { label: 'Latency', value: '5 ms', mono: true },
      { label: 'Time', value: '11:12 AM', mono: true },
    ],
    sections = [
      {
        title: 'Why it failed',
        text: 'The request was refused for this key or plan. The key may lack the permission this endpoint needs, or the balance may be empty.',
      },
      {
        title: 'What to do',
        text: "Check the key's permissions on the keys page and your balance. The next request replaces this one.",
      },
    ],
    note = 'This panel updates on its own once a request succeeds.',
  }: Props = $props();

  const uid = $props.id();
  const glyphs: Record<Tone, IconComponent> = {
    danger: CircleAlert,
    warning: TriangleAlert,
    success: CircleCheck,
    accent: Info,
    neutral: Info,
  };
  const Glyph = $derived(icon ?? glyphs[tone]);
</script>

<section class="panel tone-{tone}" aria-labelledby="{uid}-title">
  <div class="head" role={tone === 'danger' ? 'alert' : 'status'}>
    <span class="mark" aria-hidden="true"><Glyph size={20} /></span>
    <div class="text">
      <h2 id="{uid}-title">{title}</h2>
      {#if description}<p class="muted">{description}</p>{/if}
    </div>
    {#if actionLabel}
      <div class="action"><Button onclick={onaction}>{actionLabel}</Button></div>
    {/if}
  </div>

  {#if stats.length > 0}
    <dl class="stats">
      {#each stats as stat (stat.label)}
        <div class="stat">
          <dt>{stat.label}</dt>
          <dd class={[stat.mono && 'mono', stat.tone && `value-${stat.tone}`]}>{stat.value}</dd>
        </div>
      {/each}
    </dl>
  {/if}

  {#if sections.length > 0}
    <div class="sections">
      {#each sections as section (section.title)}
        <p><strong>{section.title}:</strong> {section.text}</p>
      {/each}
    </div>
  {/if}

  {#if note}<p class="note muted">{note}</p>{/if}
</section>

<style>
  .panel {
    display: grid;
    gap: var(--cc-space-4);
    padding: var(--cc-space-5);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
  }
  .tone-danger {
    --tone: var(--cc-danger);
    --tone-soft: var(--cc-danger-soft);
  }
  .tone-warning {
    --tone: var(--cc-warning);
    --tone-soft: var(--cc-warning-soft);
  }
  .tone-success {
    --tone: var(--cc-success);
    --tone-soft: var(--cc-success-soft);
  }
  .tone-accent {
    --tone: var(--cc-accent);
    --tone-soft: var(--cc-accent-soft);
  }
  .tone-neutral {
    --tone: var(--cc-text-muted);
    --tone-soft: var(--cc-surface-sunken);
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-4);
  }
  .mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    inline-size: 2.75rem;
    block-size: 2.75rem;
    border-radius: var(--cc-radius-pill);
    background: var(--tone-soft);
    color: var(--tone);
  }
  .text {
    flex: 1 1 14rem;
    min-inline-size: 0;
  }
  h2 {
    margin: 0;
    font-size: var(--cc-font-size-xl);
  }
  p {
    margin: 0;
  }
  .muted {
    color: var(--cc-text-muted);
  }
  /* One bordered strip; the 1px gaps show the border colour between cells. */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: 1px;
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-border);
  }
  .stat {
    display: grid;
    gap: var(--cc-space-1);
    padding: var(--cc-space-3) var(--cc-space-4);
    background: var(--cc-surface-raised);
  }
  dt {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .mono {
    font-family: var(--cc-font-mono);
    font-variant-numeric: tabular-nums;
  }
  .value-danger {
    color: var(--cc-danger);
    font-weight: 600;
  }
  .value-warning {
    color: var(--cc-warning);
    font-weight: 600;
  }
  .value-success {
    color: var(--cc-success);
    font-weight: 600;
  }
  .value-accent {
    color: var(--cc-accent);
    font-weight: 600;
  }
  .sections {
    display: grid;
    gap: var(--cc-space-2);
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-sunken);
  }
  .note {
    font-size: var(--cc-font-size-sm);
  }
  @media (width < 40rem) {
    .panel {
      padding: var(--cc-space-4);
    }
  }
</style>
