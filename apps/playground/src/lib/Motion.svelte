<!--
  The motion scale and the components that use it. Each overlay opens and
  closes on its own or in one replay; every other component moves as you use
  it. The switch applies what the tokens do under prefers-reduced-motion, so
  both states can be compared without changing the system setting.
-->
<script lang="ts">
  import { duration, ease } from '@codecora/tokens';
  import { marks } from '@codecora/brand';
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
    Pagination,
    Popover,
    Select,
    Sheet,
    Slider,
    Switch,
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
      enter: 'fade normal · ease-out, rise slow · spring',
      exit: 'fade and drop fast · ease-exit',
    },
    {
      id: 'sheet',
      name: 'Sheet',
      enter: 'slide normal · ease-out',
      exit: 'slide fast · ease-exit',
    },
    {
      id: 'palette',
      name: 'CommandPalette',
      enter: 'fade normal · ease-out, drop slow · spring',
      exit: 'fade and lift fast · ease-exit',
    },
    {
      id: 'popover',
      name: 'Popover',
      enter: 'fade and scale fast · ease-out',
      exit: 'fade and scale instant · ease-exit',
    },
    {
      id: 'toast',
      name: 'Toast',
      enter: 'fade normal · ease-out, rise slow · spring',
      exit: 'fade and drop fast · ease-exit',
    },
  ];

  const curves: { name: keyof typeof ease; use: string }[] = [
    { name: 'out', use: 'Entries: fast start, soft landing.' },
    { name: 'exit', use: 'Exits: leaves at full speed.' },
    { name: 'in-out', use: 'Moving between two resting places.' },
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

  type Change = { name: string; steps: [string, string][] };

  // What each component does when its state changes, in the order of the cards.
  const changes: Change[] = [
    {
      name: 'Accordion',
      steps: [
        ['Open', 'height and fade normal · ease-out'],
        ['Close', 'fast · ease-exit; chevron turns fast · in-out'],
      ],
    },
    { name: 'Tabs', steps: [['Select', 'underline slides slow · spring']] },
    {
      name: 'Tooltip',
      steps: [
        ['Enter', 'fade and scale fast · ease-out'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'DropdownMenu',
      steps: [
        ['Enter', 'fade and scale fast · ease-out'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Select',
      steps: [
        ['Enter', 'fade and scale fast · ease-out'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Combobox',
      steps: [
        ['Enter', 'fade and scale fast · ease-out'],
        ['Exit', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Checkbox',
      steps: [
        ['Check', 'fill fast · ease-out, mark slow · spring'],
        ['Uncheck', 'instant · ease-exit'],
      ],
    },
    {
      name: 'Slider',
      steps: [
        ['Step', 'keyboard steps glide fast · ease-out'],
        ['Hold', 'thumb grows fast · ease-out; drags never lag'],
      ],
    },
    { name: 'ToggleGroup', steps: [['Change', 'fill and colour fast · ease-out']] },
    { name: 'Pagination', steps: [['Change', 'fill and colour fast · ease-out']] },
    { name: 'Avatar', steps: [['Load', 'image fades in normal · ease-out']] },
    { name: 'Alert', steps: [['Arrive', 'fade and settle normal · ease-out']] },
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
    opacity var(--cc-duration-normal) var(--cc-ease-out),
    transform var(--cc-duration-slow) var(--cc-ease-spring);
}
.panel[data-state='closed'] {
  transition-duration: var(--cc-duration-fast);
  transition-timing-function: var(--cc-ease-exit);
}
/* Under prefers-reduced-motion the tokens are 0ms and the spring is ease-out. */`;

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
    const names = [...Object.keys(duration).map((k) => `--cc-duration-${k}`), '--cc-ease-spring'];
    for (const name of names) {
      root.setProperty(name, name === '--cc-ease-spring' ? 'var(--cc-ease-out)' : '0ms');
    }
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
</script>

<div class="motion">
  <div class="controls">
    <Switch
      bind:checked={reduce}
      label="Reduce motion"
      description="Applies what the tokens do under prefers-reduced-motion: every duration 0 ms, spring falls back to ease-out."
    />
    {#if systemReduces}
      <p class="note">
        Your system asks for reduced motion, so motion is already off on every page.
      </p>
    {/if}
  </div>

  <section aria-labelledby="m-scale">
    <div class="head">
      <h2 id="m-scale">Scale</h2>
      <Button variant="secondary" onclick={() => (moved = !moved)}
        >{moved ? 'Reset' : 'Play'}</Button
      >
    </div>
    <p class="lead">
      Durations run with <code>ease-out</code>. Curves run at <code>slow</code> so their shape shows.
    </p>
    <details class="usage">
      <summary>Use the tokens</summary>
      <CodeBlock code={snippet} language="css" />
    </details>
    <ul class="tracks">
      {#each Object.entries(duration) as [step, value] (step)}
        <li>
          <span class="meta"><code>duration-{step}</code> <span class="num">{value}</span></span>
          <span class="track" aria-hidden="true">
            <span
              class="dot"
              class:moved
              style:transition="transform var(--cc-duration-{step}) var(--cc-ease-out)"
            ></span>
          </span>
        </li>
      {/each}
      {#each curves as { name, use } (name)}
        <li>
          <span class="meta"><code>ease-{name}</code> {use}</span>
          <span class="track" aria-hidden="true">
            <span
              class="dot"
              class:moved
              style:transition="transform var(--cc-duration-slow) var(--cc-ease-{name})"
            ></span>
          </span>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="m-overlays">
    <div class="head">
      <h2 id="m-overlays">Enter and exit</h2>
      {#if playing}
        <Button variant="secondary" onclick={stop}>Stop</Button>
      {/if}
      <Button variant="primary" disabled={playing} onclick={replay}>
        {playing ? 'Replaying…' : 'Replay all'}
      </Button>
    </div>
    <p class="lead">
      Exits run one step shorter than entries, so closing never feels slower than opening.
    </p>
    <ul class="overlays">
      {#each overlays as overlay (overlay.id)}
        <li>
          <h3>{overlay.name}</h3>
          <dl>
            <dt>Enter</dt>
            <dd>{overlay.enter}</dd>
            <dt>Exit</dt>
            <dd>{overlay.exit}</dd>
          </dl>
          {#if overlay.id === 'popover'}
            <Popover label="Popover demo" bind:open={popoverOpen}>
              {#snippet trigger({ props })}
                <Button {...props} disabled={playing}>Open Popover</Button>
              {/snippet}
              <p class="plain">Anchored to its trigger. Press Escape to close.</p>
            </Popover>
          {:else}
            <Button disabled={playing} onclick={() => show(overlay.id)}>Open {overlay.name}</Button>
          {/if}
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="m-changes">
    <div class="head">
      <h2 id="m-changes">State changes</h2>
      <Button variant="secondary" onclick={() => (arrival += 1)}>Replay arrivals</Button>
    </div>
    <p class="lead">
      Use each one to see it move. Replay arrivals remounts Avatar and Alert, which only move when
      they appear.
    </p>
    <ul class="overlays changes">
      {#each changes as change (change.name)}
        <li>
          <h3>{change.name}</h3>
          <dl>
            {#each change.steps as [step, motion] (step)}
              <dt>{step}</dt>
              <dd>{motion}</dd>
            {/each}
          </dl>
          <div class="demo">
            {#if change.name === 'Accordion'}
              <Accordion
                items={[
                  { value: 'scope', label: 'Scopes' },
                  { value: 'expiry', label: 'Expiry' },
                ]}
              >
                {#snippet panel(value)}
                  <p class="plain">
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
                {#snippet panel(value)}<p class="plain">Showing {value} keys.</p>{/snippet}
              </Tabs>
            {:else if change.name === 'Tooltip'}
              <div class="row">
                <Tooltip content="Copy key">
                  {#snippet trigger({ props })}<Button {...props}>Copy</Button>{/snippet}
                </Tooltip>
                <Tooltip content="Rotate key">
                  {#snippet trigger({ props })}<Button {...props}>Rotate</Button>{/snippet}
                </Tooltip>
              </div>
            {:else if change.name === 'DropdownMenu'}
              <div class="row">
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
              <div class="row">
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
                <div class="row">
                  <Avatar name="Uteke" src={marks.uteke.favicons.icon192} size="lg" />
                  <Avatar name="Ada Lovelace" size="lg" />
                </div>
              {/key}
            {:else if change.name === 'Alert'}
              {#key arrival}
                <Alert tone="success" title="Key saved">ci-deploy can now write.</Alert>
              {/key}
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

<style>
  .usage summary {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    padding-inline: var(--cc-space-3);
    border: 1px solid var(--cc-border-strong);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
    cursor: pointer;
  }
  .usage[open] summary {
    margin-bottom: var(--cc-space-3);
  }
  .usage summary:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .motion {
    display: grid;
    gap: var(--cc-space-10);
  }
  .controls {
    display: grid;
    gap: var(--cc-space-2);
    max-width: 40rem;
  }
  .note,
  .lead {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  section {
    display: grid;
    gap: var(--cc-space-4);
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .tracks {
    display: grid;
    gap: var(--cc-space-4);
  }
  .tracks li {
    display: grid;
    gap: var(--cc-space-2);
  }
  .meta {
    font-size: var(--cc-font-size-sm);
    color: var(--cc-text-muted);
  }
  .meta code {
    color: var(--cc-text);
  }
  .track {
    container-type: inline-size;
    display: block;
    padding: var(--cc-space-1);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-surface-sunken);
  }
  .dot {
    display: block;
    width: var(--cc-space-4);
    height: var(--cc-space-4);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-accent);
  }
  .dot.moved {
    transform: translateX(calc(100cqi - 100%));
  }
  .overlays {
    display: grid;
    gap: var(--cc-space-4);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  }
  .changes {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  }
  .overlays li {
    display: grid;
    gap: var(--cc-space-3);
    align-content: start;
    justify-items: start;
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
  }
  h3 {
    font-size: var(--cc-font-size-md);
  }
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--cc-space-1) var(--cc-space-3);
    margin: 0;
    font-size: var(--cc-font-size-sm);
  }
  dt {
    color: var(--cc-text-muted);
  }
  dd {
    margin: 0;
  }
  .plain {
    margin: 0;
  }
  .demo {
    display: grid;
    width: 100%;
    margin-top: auto;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
</style>
