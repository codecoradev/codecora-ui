<!-- Every @codecora/ui primitive in its states; icons come from Lucide, passed as props. -->
<script lang="ts">
  import { Bell, Copy, Download, Inbox, Plus, Search, Trash } from '@codecora/icons/lucide';
  import {
    Badge,
    Button,
    ConfirmDialog,
    Dialog,
    EmptyState,
    Field,
    IconButton,
    Input,
    Select,
    Sheet,
    Skeleton,
    Spinner,
    Table,
    Tabs,
    Textarea,
    Toaster,
    Tooltip,
    toast,
  } from '@codecora/ui';
  import { resolve } from '$app/paths';
  import { catalogue } from './catalogue.js';
  import ChoiceControls from './ChoiceControls.svelte';
  import DataTableDemo from './DataTableDemo.svelte';
  import DisplayComponents from './DisplayComponents.svelte';
  import InputComponents from './InputComponents.svelte';
  import NavigationComponents from './NavigationComponents.svelte';
  import StateMatrix from './StateMatrix.svelte';
  import Usage from './Usage.svelte';

  // The section in view, marked in the index.
  let active = $state('c-matrix');
  $effect(() => {
    const ids = ['c-matrix', ...catalogue.flatMap((g) => g.sections.map((x) => x.id))];
    const headings = ids.map((id) => document.getElementById(id)).filter((h) => h !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (seen[0]) active = seen[0];
      },
      { rootMargin: '0px 0px -70% 0px' },
    );
    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  });

  // Open beside the sections on wide screens, folded above them on narrow ones.
  let indexOpen = $state(true);
  $effect(() => {
    const wide = matchMedia('(min-width: 64rem)');
    indexOpen = wide.matches;
    const sync = () => (indexOpen = wide.matches);
    wide.addEventListener('change', sync);
    return () => wide.removeEventListener('change', sync);
  });

  let name = $state('');
  let region = $state('eu');
  let dialogOpen = $state(false);
  let confirmOpen = $state(false);
  let sheetOpen = $state(false);
  let saving = $state(false);

  const regions = [
    { value: 'eu', label: 'Europe (Frankfurt)' },
    { value: 'us', label: 'United States (Virginia)' },
    { value: 'ap', label: 'Asia Pacific (Singapore)' },
    { value: 'sa', label: 'South America (São Paulo)', disabled: true },
  ];

  const keys = [
    { name: 'ci-deploy', scope: 'read, write', status: 'Active', calls: 12840 },
    { name: 'dashboard', scope: 'read', status: 'Active', calls: 3112 },
    { name: 'old-importer', scope: 'read, write', status: 'Revoked', calls: 0 },
    { name: 'staging-bot', scope: 'read', status: 'Expiring', calls: 411 },
  ];
  const tone = { Active: 'success', Revoked: 'danger', Expiring: 'warning' } as const;

  const nameError = $derived(
    name.length > 0 && name.length < 3 ? 'Use at least 3 characters.' : '',
  );

  function save() {
    saving = true;
    setTimeout(() => {
      saving = false;
      toast.success('Key saved', 'ci-deploy now has read and write scope.');
    }, 900);
  }
</script>

<div class="layout">
  <details class="index-wrap" bind:open={indexOpen}>
    <summary>Jump to a section</summary>
    <nav class="index" aria-label="Sections on this page">
      <a
        class="index-top"
        href="#c-matrix"
        aria-current={active === 'c-matrix' ? 'location' : undefined}>State matrix</a
      >
      {#each catalogue as { group, sections } (group)}
        <div class="index-group">
          <p class="index-title">{group}</p>
          <ul>
            {#each sections as section (section.id)}
              <li>
                <a
                  href="#{section.id}"
                  aria-current={active === section.id ? 'location' : undefined}
                  ><span>{section.title}</span><small>{section.components.join(', ')}</small></a
                >
              </li>
            {/each}
          </ul>
        </div>
      {/each}
      <a class="index-top" href={resolve('/dashboard')}>AppShell and Sidebar</a>
    </nav>
  </details>

  <div class="sections">
    <StateMatrix />

    <section aria-labelledby="c-buttons">
      <h2 id="c-buttons">Buttons</h2>
      <div class="row">
        <Button variant="primary" icon={Plus}>Create key</Button>
        <Button>Secondary</Button>
        <Button variant="ghost" icon={Download}>Export</Button>
        <Button variant="danger" icon={Trash}>Revoke</Button>
        <Button variant="primary" loading={saving} loadingLabel="Saving key" onclick={save}>
          {saving ? 'Saving' : 'Save changes'}
        </Button>
        <Button disabled>Disabled</Button>
        <Button href="https://github.com/codecoradev/codecora-ui" variant="secondary"
          >As a link</Button
        >
      </div>
      <div class="row">
        <Tooltip content="Copy key">
          {#snippet trigger({ props })}
            <IconButton {...props} icon={Copy} label="Copy key" variant="secondary" />
          {/snippet}
        </Tooltip>
        <IconButton icon={Bell} label="Notifications" />
        <IconButton icon={Trash} label="Delete" variant="danger" />
        <IconButton icon={Search} label="Search" disabled />
        <Spinner label="Loading keys" />
      </div>
    </section>
    <Usage id="c-buttons" />

    <section aria-labelledby="c-forms">
      <h2 id="c-forms">Form fields</h2>
      <div class="form">
        <Field label="Key name" description="Shown in the audit log." error={nameError} required>
          {#snippet children(control)}
            <Input {...control} bind:value={name} placeholder="ci-deploy" autocomplete="off" />
          {/snippet}
        </Field>
        <Field label="Region" description="Where the data lives.">
          {#snippet children(control)}
            <Select {...control} items={regions} bind:value={region} />
          {/snippet}
        </Field>
        <Field label="Notes">
          {#snippet children(control)}
            <Textarea
              id={control.id}
              aria-describedby={control['aria-describedby']}
              placeholder="What is this key for?"
            />
          {/snippet}
        </Field>
        <Field label="Disabled field" description="Read only while the plan is paused.">
          {#snippet children(control)}
            <Input {...control} value="locked" disabled />
          {/snippet}
        </Field>
      </div>

      <h3 id="c-invalid">Invalid state</h3>
      <p class="muted">
        An icon and a screen-reader "Error:" prefix back the red text, and the control gets a
        stronger border, so the state never depends on colour alone.
      </p>
      <div class="form">
        <Field label="Email" error="Enter an address like name@example.com." required>
          {#snippet children(control)}
            <Input {...control} type="email" value="not-an-email" />
          {/snippet}
        </Field>
        <Field label="Region" error="Choose a region to continue." required>
          {#snippet children(control)}
            <Select {...control} items={regions} value="" />
          {/snippet}
        </Field>
        <Field label="Notes" error="Notes are limited to 200 characters.">
          {#snippet children(control)}
            <Textarea {...control} value={'x'.repeat(40) + ' …'} />
          {/snippet}
        </Field>
      </div>
    </section>
    <Usage id="c-forms" />

    <ChoiceControls />
    <Usage id="c-choice" />

    <InputComponents />
    <Usage id="c-inputs" />

    <section aria-labelledby="c-overlays">
      <h2 id="c-overlays">Dialog, ConfirmDialog, Sheet, Toast</h2>
      <div class="row">
        <Button onclick={() => (dialogOpen = true)}>Open dialog</Button>
        <Button variant="danger" onclick={() => (confirmOpen = true)}>Revoke key…</Button>
        <Button onclick={() => (sheetOpen = true)}>Open sheet</Button>
        <Button
          onclick={() =>
            toast.show({ title: 'Copied', description: 'Key copied to the clipboard.' })}
        >
          Show toast
        </Button>
        <Button
          variant="danger"
          onclick={() =>
            toast.error('Could not reach the server', 'Check your connection and retry.')}
        >
          Show error toast
        </Button>
      </div>

      <Dialog
        bind:open={dialogOpen}
        title="Rename key"
        description="The name appears in the audit log."
      >
        <Field label="Key name">
          {#snippet children(control)}<Input {...control} value="ci-deploy" />{/snippet}
        </Field>
        {#snippet footer()}
          <Button variant="secondary" onclick={() => (dialogOpen = false)}>Cancel</Button>
          <Button variant="primary" onclick={() => (dialogOpen = false)}>Rename</Button>
        {/snippet}
      </Dialog>

      <ConfirmDialog
        bind:open={confirmOpen}
        title="Revoke ci-deploy?"
        description="Anything using this key stops working immediately. This cannot be undone."
        confirmLabel="Revoke key"
        confirmText="ci-deploy"
        tone="danger"
        onconfirm={() => {
          toast.success('Key revoked');
        }}
      />

      <Sheet bind:open={sheetOpen} title="Filters" description="Narrow the key list.">
        <Field label="Status">
          {#snippet children(control)}
            <Select
              {...control}
              items={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
              ]}
              value="all"
            />
          {/snippet}
        </Field>
        {#snippet footer()}
          <Button variant="primary" onclick={() => (sheetOpen = false)}>Apply</Button>
        {/snippet}
      </Sheet>
    </section>
    <Usage id="c-overlays" />

    <NavigationComponents />
    <Usage id="c-nav" />

    <section aria-labelledby="c-tabs">
      <h2 id="c-tabs">Tabs and Table</h2>
      <Tabs
        label="Key views"
        items={[
          { value: 'keys', label: 'Keys' },
          { value: 'usage', label: 'Usage' },
          { value: 'audit', label: 'Audit log', disabled: true },
        ]}
      >
        {#snippet panel(value)}
          {#if value === 'keys'}
            <Table label="Keys in a tab">
              <thead>
                <tr
                  ><th scope="col">Name</th><th scope="col">Scope</th><th scope="col">Status</th><th
                    scope="col"
                    class="num">Calls (30 d)</th
                  ></tr
                >
              </thead>
              <tbody>
                {#each keys as key, i (key.name)}
                  <tr data-selected={i === 0 ? 'true' : undefined}>
                    <th scope="row">{key.name}</th>
                    <td>{key.scope}</td>
                    <td><Badge tone={tone[key.status as keyof typeof tone]}>{key.status}</Badge></td
                    >
                    <td class="num">{key.calls.toLocaleString('en')}</td>
                  </tr>
                {/each}
              </tbody>
            </Table>
          {:else}
            <p class="muted">Usage charts land with the dashboard sample.</p>
          {/if}
        {/snippet}
      </Tabs>
    </section>
    <Usage id="c-tabs" />

    <DataTableDemo />
    <Usage id="c-datatable" />

    <DisplayComponents />
    <Usage id="c-display" />

    <section aria-labelledby="c-status">
      <h2 id="c-status">Badge, Skeleton, EmptyState</h2>
      <div class="row">
        <Badge>Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
      </div>
      <div class="skeletons" aria-label="Loading example" role="group">
        <Skeleton width="3rem" height="3rem" circle />
        <div class="lines">
          <Skeleton width="40%" height="1rem" />
          <Skeleton height="0.75rem" />
          <Skeleton width="80%" height="0.75rem" />
        </div>
      </div>
      <div class="empty">
        <EmptyState
          icon={Inbox}
          title="No keys yet"
          description="Create an API key to connect a tool to your memory."
        >
          {#snippet action()}<Button variant="primary" icon={Plus}>Create key</Button>{/snippet}
        </EmptyState>
      </div>
    </section>
    <Usage id="c-status" />
  </div>
</div>

<Toaster />

<style>
  /* A component index beside the sections on wide screens, above them on narrow ones. */
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-8);
  }
  .sections {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-width: 0;
  }
  .sections :global(h2[id]) {
    scroll-margin-top: var(--cc-space-6);
  }
  .index {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: var(--cc-space-4);
    align-content: start;
    padding: var(--cc-space-4);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    font-size: var(--cc-font-size-sm);
  }
  .index-group {
    display: grid;
    align-content: start;
    gap: var(--cc-space-1);
  }
  .index .index-title {
    margin: 0;
    color: var(--cc-text-muted);
    font-family: var(--cc-font-sans);
    font-size: var(--cc-font-size-xs);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .index ul {
    display: grid;
    align-content: start;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .index a {
    display: grid;
    gap: 0.125rem;
    padding: var(--cc-space-1) var(--cc-space-2);
    border-radius: var(--cc-radius-sm);
    color: var(--cc-text);
    text-decoration: none;
  }
  .index a small {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-xs);
    line-height: 1.4;
  }
  .index a:hover {
    background: var(--cc-surface-hover);
  }
  /* The section in view gets a tint, weight and an inset bar. */
  .index a[aria-current='location'] {
    background: var(--cc-accent-soft);
    box-shadow: inset 2px 0 0 var(--cc-accent);
    font-weight: 600;
  }
  .index a:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .index-wrap summary {
    display: flex;
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
  .index-wrap[open] summary {
    margin-bottom: var(--cc-space-3);
  }
  .index-wrap summary:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .index-top {
    grid-column: 1 / -1;
    font-weight: 600;
  }
  @media (min-width: 64rem) {
    .layout {
      grid-template-columns: 13rem minmax(0, 1fr);
    }
    .index-wrap summary {
      display: none;
    }
    .index-wrap {
      position: sticky;
      top: var(--cc-space-4);
      align-self: start;
    }
    .index {
      grid-template-columns: minmax(0, 1fr);
      max-height: calc(100dvh - var(--cc-space-8));
      overflow-y: auto;
      padding: 0 var(--cc-space-2) 0 0;
      border: 0;
      background: none;
    }
    .index-top {
      grid-column: auto;
    }
  }

  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  h3 {
    margin: 0;
    font-size: var(--cc-font-size-lg);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-3);
  }
  .form {
    display: grid;
    gap: var(--cc-space-4);
    max-width: 28rem;
  }
  .muted {
    max-width: 60ch;
    color: var(--cc-text-muted);
  }
  .skeletons {
    display: flex;
    align-items: center;
    gap: var(--cc-space-4);
    max-width: 24rem;
  }
  .lines {
    display: grid;
    flex: 1;
    gap: var(--cc-space-2);
  }
  .empty {
    border: 1px dashed var(--cc-border-strong);
    border-radius: var(--cc-radius-lg);
  }
</style>
