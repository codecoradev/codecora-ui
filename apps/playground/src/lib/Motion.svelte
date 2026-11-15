<!--
  The motion scale and the components that use it. Each overlay opens and
  closes on its own or in one replay; every other component moves as you use
  it. The switch applies what the tokens do under prefers-reduced-motion, so
  both states can be compared without changing the system setting.
-->
<script lang="ts">
  import { duration, ease } from '@codecora/tokens';
  import { marks } from '@codecora/brand';
  import { Trash } from '@codecora/icons/lucide';
  import {
    Accordion,
    Alert,
    Avatar,
    Button,
    Checkbox,
    CodeBlock,
    Combobox,
    CommandPalette,
    Dialog,
    DropdownMenu,
    Field,
    IconButton,
    Input,
    Pagination,
    Popover,
    RadioGroup,
    Select,
    Sheet,
    Slider,
    Switch,
    Table,
    Tabs,
    Toaster,
    ToggleGroup,
    Tooltip,
    toast,
  } from '@codecora/ui';

  type Overlay = 'dialog' | 'sheet' | 'palette' | 'popover' | 'toast';

  const overlays: { id: Overlay; name: string; enter: string; exit: string }[] = [
    {
      id: 'dialog',
      name: 'Dialog',
      enter: 'fade normal · ease-enter, rise slow · spring',
      exit: 'fade and drop fast · ease-exit',
    },
    {
      id: 'sheet',
      name: 'Sheet',
      enter: 'slide normal · ease-enter',
      exit: 'slide fast · ease-exit',
    },
    {
      id: 'palette',
      name: 'CommandPalette',
      enter: 'fade normal · ease-enter, drop slow · spring',
      exit: 'fade and lift fast · ease-exit',
    },
    {
      id: 'popover',
      name: 'Popover',
      enter: 'fade and scale fast · ease-enter',
      exit: 'fade and scale instant · ease-exit',
    },
    {
      id: 'toast',
      name: 'Toast',
      enter: 'fade normal · ease-enter, rise slow · spring',
      exit: 'fade and drop fast · ease-exit',
    },
  ];

  const curves: { name: keyof typeof ease; use: string }[] = [
    { name: 'enter', use: 'Entries: fast start, soft landing.' },
    { name: 'exit', use: 'Exits: leaves at full speed.' },
    { name: 'move', use: 'Moving between two resting places.' },
    { name: 'spring', use: 'Movement and scale only, never opacity or colour.' },
  ];

  let reduce = $state(false);
  let systemReduces = $state(false);
  let moved = $state(false);
  let playing = $state(false);
  let dialogOpen = $state(false);
  let sheetOpen = $state(false);
  let popoverOpen = $state(false);
  let paletteOpen = $state(false);
  let planChoice = $state('team');
  let invalid = $state(false);

  type Change = { name: string; steps: [string, string][] };

  // What each component does when its state changes, in the order of the cards.
  const changes: Change[] = [
    {
      name: 'Button',
      steps: [
        ['Press', 'scales to --cc-press-scale instant · ease-enter; reduced motion keeps it at 1'],
        ['Hover', 'fill fast · ease-enter'],
      ],
    },
    {
      name: 'Accordion',
      steps: [
        ['Open', 'height and fade normal · ease-enter'],
        ['Close', 'fast · ease-exit; chevron turns fast · ease-move'],
      ],
    },
    { name: 'Tabs', steps: [['Select', 'underline slides slow · spring']] },
    {
      name: 'Tooltip',
      steps: [
        ['Enter', 'fade and scale fast · ease-enter'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'DropdownMenu',
      steps: [
        ['Enter', 'fade and scale fast · ease-enter'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Select',
      steps: [
        ['Enter', 'fade and scale fast · ease-enter'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Combobox',
      steps: [
        ['Enter', 'fade and scale fast · ease-enter'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Checkbox',
      steps: [
        ['Check', 'fill fast · ease-enter, mark slow · spring'],
        ['Uncheck', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Slider',
      steps: [
        ['Step', 'keyboard steps glide fast · ease-enter'],
        ['Hold', 'thumb grows fast · ease-enter; drags never lag'],
      ],
    },
    { name: 'ToggleGroup', steps: [['Change', 'fill and colour fast · ease-enter']] },
    { name: 'Pagination', steps: [['Change', 'fill and colour fast · ease-enter']] },
    { name: 'Avatar', steps: [['Load', 'image fades in normal · ease-enter']] },
    { name: 'Alert', steps: [['Arrive', 'fade and settle normal · ease-enter']] },
    {
      name: 'RadioGroup',
      steps: [['Select', 'dot fades fast · ease-enter, scales slow · spring']],
    },
    { name: 'Field', steps: [['Error', 'fade and settle normal · ease-enter']] },
    { name: 'Input', steps: [['Invalid', 'border and ring fast · ease-enter']] },
    { name: 'Table', steps: [['Row', 'hover and selection fill fast · ease-enter']] },
  ];

  const plans = [
    { value: 'free', label: 'Free' },
    { value: 'team', label: 'Team' },
    { value: 'business', label: 'Business' },
  ];
  const regions = [
    { value: 'ams', label: 'Amsterdam' },
    { value: 'fra', label: 'Frankfurt' },
    { value: 'sin', label: 'Singapore' },
    { value: 'syd', label: 'Sydney' },
    { value: 'iad', label: 'Washington' },
  ];
  let receipt = $state(true);
  let quota = $state(40);
  let page = $state(2);
  // Bumped by Replay to remount the components that only move on arrival.
  let arrival = $state(0);

  // Run the scale once on arrival so the page never opens on parked dots;
  // skipped when the system asks for reduced motion.
  $effect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => (moved = true), 400);
    return () => clearTimeout(timer);
  });

  const snippet = `.panel {
  transition:
    opacity var(--cc-duration-normal) var(--ease-enter),
    transform var(--cc-duration-slow) var(--ease-spring);
}
.panel[data-state='closed'] {
  transition-duration: var(--cc-duration-fast);
  transition-timing-function: var(--ease-exit);
}
/* Under prefers-reduced-motion the tokens are 0ms and the spring is ease-enter. */`;

  $effect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    systemReduces = query.matches;
    const update = (event: MediaQueryListEvent) => (systemReduces = event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  });

  // The values tokens apply under prefers-reduced-motion, set on the page root
  // so overlays in portals follow too. Removed again when the page unmounts.
  $effect(() => {
    if (!reduce) return;
    const root = document.documentElement.style;
    const names = [
      ...Object.keys(duration).map((k) => `--cc-duration-${k}`),
      '--ease-spring',
      '--cc-press-scale',
    ];
    const reduced: Record<string, string> = {
      '--ease-spring': 'var(--ease-enter)',
      '--cc-press-scale': '1',
    };
    for (const name of names) root.setProperty(name, reduced[name] ?? '0ms');
    return () => names.forEach((name) => root.removeProperty(name));
  });

  const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));

  /** The replayed toast stays until the replay dismisses it. */
  let toastId = 0;

  function show(id: Overlay, replaying = false) {
    if (id === 'dialog') dialogOpen = true;
    if (id === 'sheet') sheetOpen = true;
    if (id === 'popover') popoverOpen = true;
    if (id === 'palette') paletteOpen = true;
    if (id === 'toast') {
      toastId = toast.show({
        title: 'Key saved',
        description: 'ci-deploy now has read and write scope.',
        duration: replaying ? 0 : 5000,
      });
    }
  }

  function hide(id: Overlay) {
    if (id === 'dialog') dialogOpen = false;
    if (id === 'sheet') sheetOpen = false;
    if (id === 'popover') popoverOpen = false;
    if (id === 'palette') paletteOpen = false;
    if (id === 'toast') toast.dismiss(toastId);
  }

  // Checked between steps, so Stop closes the open overlay and ends the run.
  let stopping = false;

  async function replay() {
    playing = true;
    stopping = false;
    for (const { id } of overlays) {
      show(id, true);
      await wait(1200);
      hide(id);
      if (stopping) break;
      await wait(700);
      if (stopping) break;
    }
    playing = false;
  }

  function stop() {
    stopping = true;
  }

  const note = 'text-muted-foreground text-sm leading-[inherit]';
  const h2 = 'text-xl leading-heading font-bold';
  const h3 = 'text-base leading-heading font-bold';
  const meta = 'text-muted-foreground text-sm leading-[inherit]';
  const track = 'bg-muted @container block rounded-full p-1';
  const dot = 'bg-primary block size-4 rounded-full';
  /* The far end of the track: its width (100cqi) less the dot's own. */
  const moveTo = 'move-track-end';
  const card =
    'border-border bg-card grid content-start justify-items-start gap-3 rounded-md border p-4';
  const dl = 'grid grid-cols-term gap-x-3 gap-y-1 text-sm leading-[inherit]';
</script>

<div class="grid gap-10">
  <div class="grid max-w-160 gap-2">
    <Switch
      bind:checked={reduce}
      label="Reduce motion"
      description="Applies what the tokens do under prefers-reduced-motion: every duration 0 ms, spring falls back to ease-enter."
    />
    {#if systemReduces}
      <p class={note}>
        Your system asks for reduced motion, so motion is already off on every page.
      </p>
    {/if}
  </div>

  <section class="grid gap-4" aria-labelledby="m-scale">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 id="m-scale" class={h2}>Scale</h2>
      <Button variant="secondary" onclick={() => (moved = !moved)}
        >{moved ? 'Reset' : 'Play'}</Button
      >
    </div>
    <p class={note}>
      Durations run with <code>ease-enter</code>. Curves run at <code>slow</code> so their shape shows.
    </p>
    <details class="group">
      <summary
        class="border-input bg-card focus-visible:outline-ring focus-visible:outline-focus focus-visible:outline-offset-focus inline-flex min-h-11 cursor-pointer items-center rounded-md border px-3 text-sm leading-[inherit] font-semibold group-open:mb-3"
        >Use the tokens</summary
      >
      <CodeBlock code={snippet} language="css" />
    </details>
    <ul class="grid gap-4">
      {#each Object.entries(duration) as [step, value] (step)}
        <li class="grid gap-2">
          <span class={meta}
            ><code class="text-foreground">duration-{step}</code>
            <span class="font-mono tabular-nums">{value}</span></span
          >
          <span class={track} aria-hidden="true">
            <span
              class={[dot, moved && moveTo]}
              style:transition="transform var(--cc-duration-{step}) var(--ease-enter)"
            ></span>
          </span>
        </li>
      {/each}
      {#each curves as { name, use } (name)}
        <li class="grid gap-2">
          <span class={meta}><code class="text-foreground">ease-{name}</code> {use}</span>
          <span class={track} aria-hidden="true">
            <span
              class={[dot, moved && moveTo]}
              style:transition="transform var(--cc-duration-slow) var(--ease-{name})"
            ></span>
          </span>
        </li>
      {/each}
    </ul>
  </section>

  <section class="grid gap-4" aria-labelledby="m-overlays">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 id="m-overlays" class={h2}>Enter and exit</h2>
      {#if playing}
        <Button variant="secondary" onclick={stop}>Stop</Button>
      {/if}
      <Button variant="primary" disabled={playing} onclick={replay}>
        {playing ? 'Replaying…' : 'Replay all'}
      </Button>
    </div>
    <p class={note}>
      Exits run one step shorter than entries, so closing never feels slower than opening.
    </p>
    <ul
      class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*60)),1fr))] gap-4"
    >
      {#each overlays as overlay (overlay.id)}
        <li class={card}>
          <h3 class={h3}>{overlay.name}</h3>
          <dl class={dl}>
            <dt class="text-muted-foreground">Enter</dt>
            <dd>{overlay.enter}</dd>
            <dt class="text-muted-foreground">Exit</dt>
            <dd>{overlay.exit}</dd>
          </dl>
          {#if overlay.id === 'popover'}
            <Popover label="Popover demo" bind:open={popoverOpen}>
              {#snippet trigger({ props })}
                <Button {...props} disabled={playing}>Open Popover</Button>
              {/snippet}
              <p>Anchored to its trigger. Press Escape to close.</p>
            </Popover>
          {:else}
            <Button disabled={playing} onclick={() => show(overlay.id)}>Open {overlay.name}</Button>
          {/if}
        </li>
      {/each}
    </ul>
  </section>

  <section class="grid gap-4" aria-labelledby="m-changes">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 id="m-changes" class={h2}>State changes</h2>
      <Button variant="secondary" onclick={() => (arrival += 1)}>Replay arrivals</Button>
    </div>
    <p class={note}>
      Use each one to see it move. Replay arrivals remounts Avatar and Alert, which only move when
      they appear.
    </p>
    <ul class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--container-2xs)),1fr))] gap-4">
      {#each changes as change (change.name)}
        <li class={card}>
          <h3 class={h3}>{change.name}</h3>
          <dl class={dl}>
            {#each change.steps as [step, motion] (step)}
              <dt class="text-muted-foreground">{step}</dt>
              <dd>{motion}</dd>
            {/each}
          </dl>
          <div class="mt-auto grid w-full">
            {#if change.name === 'Accordion'}
              <Accordion
                items={[
                  { value: 'scope', label: 'Scopes' },
                  { value: 'expiry', label: 'Expiry' },
                ]}
              >
                {#snippet panel(value)}
                  <p>
                    {value === 'scope'
                      ? 'Read, write or admin, per key.'
                      : 'Keys expire after 90 days unless renewed.'}
                  </p>
                {/snippet}
              </Accordion>
            {:else if change.name === 'Tabs'}
              <Tabs
                label="Key views"
                items={[
                  { value: 'active', label: 'Active' },
                  { value: 'expiring', label: 'Expiring' },
                  { value: 'revoked', label: 'Revoked' },
                ]}
              >
                {#snippet panel(value)}<p>Showing {value} keys.</p>{/snippet}
              </Tabs>
            {:else if change.name === 'Tooltip'}
              <div class="flex flex-wrap gap-2">
                <Tooltip content="Copy key">
                  {#snippet trigger({ props })}<Button {...props}>Copy</Button>{/snippet}
                </Tooltip>
                <Tooltip content="Rotate key">
                  {#snippet trigger({ props })}<Button {...props}>Rotate</Button>{/snippet}
                </Tooltip>
              </div>
            {:else if change.name === 'DropdownMenu'}
              <div class="flex flex-wrap gap-2">
                <DropdownMenu
                  label="Key actions"
                  items={[
                    { label: 'Rename', onselect: () => {} },
                    { label: 'Rotate', onselect: () => {} },
                    { label: 'Revoke', danger: true, separatorBefore: true, onselect: () => {} },
                  ]}
                >
                  {#snippet trigger({ props })}<Button {...props}>Actions</Button>{/snippet}
                </DropdownMenu>
              </div>
            {:else if change.name === 'Select'}
              <Select label="Plan" items={plans} placeholder="Choose a plan" />
            {:else if change.name === 'Combobox'}
              <Combobox label="Region" items={regions} placeholder="Search regions" />
            {:else if change.name === 'Checkbox'}
              <Checkbox bind:checked={receipt} label="Send me a receipt" />
            {:else if change.name === 'Slider'}
              <Slider
                label="Monthly quota"
                bind:value={quota}
                step={10}
                showValue
                format={(v) => `${v} GB`}
              />
            {:else if change.name === 'ToggleGroup'}
              <div class="flex flex-wrap gap-2">
                <ToggleGroup
                  label="Range"
                  value="7d"
                  items={[
                    { value: '24h', label: '24 h' },
                    { value: '7d', label: '7 d' },
                    { value: '30d', label: '30 d' },
                  ]}
                />
              </div>
            {:else if change.name === 'Pagination'}
              <Pagination count={40} perPage={10} bind:page />
            {:else if change.name === 'Avatar'}
              {#key arrival}
                <div class="flex flex-wrap gap-2">
                  <Avatar name="Uteke" src={marks.uteke.favicons.icon192} size="lg" />
                  <Avatar name="Ada Lovelace" size="lg" />
                </div>
              {/key}
            {:else if change.name === 'Alert'}
              {#key arrival}
                <Alert tone="success" title="Key saved">ci-deploy can now write.</Alert>
              {/key}
            {:else if change.name === 'Button'}
              <div class="flex flex-wrap gap-2">
                <Button variant="primary">Press and hold</Button>
                <Button variant="secondary">Cancel</Button>
                <IconButton icon={Trash} label="Delete" />
              </div>
            {:else if change.name === 'RadioGroup'}
              <RadioGroup label="Plan" items={plans} bind:value={planChoice} />
            {:else if change.name === 'Field'}
              {#key arrival}
                <Field label="Email" error="Enter an address like ada@example.com">
                  {#snippet children(control)}
                    <Input {...control} value="not-an-email" />
                  {/snippet}
                </Field>
              {/key}
            {:else if change.name === 'Input'}
              <div class="flex flex-wrap gap-2">
                <Input aria-label="Key name" value="ci-deploy" {invalid} />
                <Button variant="secondary" onclick={() => (invalid = !invalid)}>
                  {invalid ? 'Clear error' : 'Mark invalid'}
                </Button>
              </div>
            {:else if change.name === 'Table'}
              <Table label="Keys to hover">
                <thead>
                  <tr><th scope="col">Name</th><th scope="col">Scope</th></tr>
                </thead>
                <tbody>
                  <tr><td>ci-deploy</td><td>read, write</td></tr>
                  <tr data-selected="true"><td>dashboard</td><td>read</td></tr>
                  <tr><td>old-importer</td><td>read</td></tr>
                </tbody>
              </Table>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </section>
</div>

<Dialog bind:open={dialogOpen} title="Rename key" description="The name appears in the audit log.">
  {#snippet footer()}
    <Button variant="secondary" onclick={() => (dialogOpen = false)}>Close</Button>
  {/snippet}
</Dialog>

<Sheet bind:open={sheetOpen} title="Filters" description="Narrow the key list.">
  {#snippet footer()}
    <Button variant="secondary" onclick={() => (sheetOpen = false)}>Close</Button>
  {/snippet}
</Sheet>

<CommandPalette
  bind:open={paletteOpen}
  shortcut=""
  groups={[
    {
      heading: 'Go to',
      items: [
        { value: 'keys', label: 'API keys', onselect: () => {} },
        { value: 'usage', label: 'Usage', onselect: () => {} },
      ],
    },
  ]}
/>

<Toaster />
