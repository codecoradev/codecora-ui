<!--
  A status card for diagnostics and error states: a tinted icon, a title and
  subtitle, an action button, a strip of labelled stats (status, endpoint,
  latency, time) and a panel of explanation sections ("Why it failed", "What
  to do") with a footnote. The tone sets the icon and tint; danger is announced
  as an alert, the other tones as a polite status. The app owns this file:
  replace the copy and the stats with its own.
-->
<script lang="ts">
  import { Button, cn, type IconComponent, type Tone } from '@codecora/ui';
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
  // The tone tints the icon mark and colours a stat value that sets one.
  const markTone: Record<Tone, string> = {
    danger: 'bg-destructive-soft text-destructive',
    warning: 'bg-warning-soft text-warning',
    success: 'bg-success-soft text-success',
    accent: 'bg-primary-soft text-primary',
    neutral: 'bg-muted text-muted-foreground',
  };
  const valueTone: Record<Tone, string> = {
    danger: 'text-destructive font-semibold',
    warning: 'text-warning font-semibold',
    success: 'text-success font-semibold',
    accent: 'text-primary font-semibold',
    neutral: '',
  };
  const mark = $derived(
    cn('inline-flex size-11 flex-none items-center justify-center rounded-full', markTone[tone]),
  );
</script>

<section
  class="border-border bg-card text-foreground grid gap-4 rounded-lg border p-5 max-sm:p-4"
  aria-labelledby="{uid}-title"
>
  <div class="flex flex-wrap items-center gap-4" role={tone === 'danger' ? 'alert' : 'status'}>
    <span class={mark} aria-hidden="true"><Glyph size={20} /></span>
    <div class="min-w-0 shrink grow basis-56">
      <h2 class="m-0 text-[length:var(--cc-font-size-xl)]" id="{uid}-title">{title}</h2>
      {#if description}<p class="text-muted-foreground m-0">{description}</p>{/if}
    </div>
    {#if actionLabel}
      <div><Button onclick={onaction}>{actionLabel}</Button></div>
    {/if}
  </div>

  {#if stats.length > 0}
    <!-- One bordered strip; the 1px gaps show the border colour between cells. -->
    <dl
      class="border-border bg-border m-0 grid grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*36),1fr))] gap-px overflow-hidden rounded-md border"
    >
      {#each stats as stat (stat.label)}
        <div class="bg-card grid gap-1 px-4 py-3">
          <dt class="text-muted-foreground text-[length:var(--cc-font-size-sm)]">{stat.label}</dt>
          <dd
            class={cn(
              'm-0 wrap-anywhere',
              stat.mono && 'font-mono tabular-nums',
              stat.tone && valueTone[stat.tone],
            )}
          >
            {stat.value}
          </dd>
        </div>
      {/each}
    </dl>
  {/if}

  {#if sections.length > 0}
    <div class="border-border bg-muted grid gap-2 rounded-md border p-4">
      {#each sections as section (section.title)}
        <p class="m-0"><strong>{section.title}:</strong> {section.text}</p>
      {/each}
    </div>
  {/if}

  {#if note}
    <p class="text-muted-foreground m-0 text-[length:var(--cc-font-size-sm)]">{note}</p>
  {/if}
</section>
