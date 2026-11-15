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

  const section = 'grid grid-cols-1 gap-4 pb-10';
  const h2 = 'text-[length:var(--cc-font-size-xl)] font-bold';
  const row = 'flex flex-wrap items-center gap-3';
  const muted = 'text-muted-foreground max-w-[var(--pg-measure-intro)]';
  /* The section in view gets a tint, weight and an inset bar. */
  const link =
    'text-foreground hover:bg-accent aria-[current=location]:bg-primary-soft focus-visible:outline-ring grid gap-0.5 rounded-sm px-2 py-1 no-underline focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)] aria-[current=location]:font-semibold aria-[current=location]:[box-shadow:inset_2px_0_0_var(--cc-accent)]';

  function save() {
    saving = true;
    setTimeout(() => {
      saving = false;
      toast.success('Key saved', 'ci-deploy now has read and write scope.');
    }, 900);
  }
</script>

<!-- A component index beside the sections on wide screens, above them on narrow ones. -->
<div class="grid grid-cols-1 gap-8 lg:grid-cols-[calc(var(--spacing)*52)_minmax(0,1fr)]">
  <details class="group lg:sticky lg:top-4 lg:self-start" bind:open={indexOpen}>
    <summary
      class="border-input bg-card focus-visible:outline-ring flex min-h-11 cursor-pointer items-center rounded-md border px-3 text-[length:var(--cc-font-size-sm)] font-semibold group-open:mb-3 focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:outline-offset-[var(--cc-focus-offset)] lg:hidden"
      >Jump to a section</summary
    >
    <nav
      class="border-border bg-card grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*36),1fr))] content-start gap-4 rounded-md border p-4 text-[length:var(--cc-font-size-sm)] lg:max-h-[calc(100dvh-var(--cc-space-8))] lg:grid-cols-1 lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:p-0 lg:pr-2"
      aria-label="Sections on this page"
    >
      <a
        class="{link} col-span-full font-semibold lg:col-auto"
        href="#c-matrix"
        aria-current={active === 'c-matrix' ? 'location' : undefined}>State matrix</a
      >
      {#each catalogue as { group, sections } (group)}
        <div class="grid content-start gap-1">
          <p
            class="text-muted-foreground font-sans text-[length:var(--cc-font-size-xs)] font-semibold tracking-[var(--pg-tracking-label)] uppercase"
          >
            {group}
          </p>
          <ul class="grid content-start">
            {#each sections as section (section.id)}
              <li>
                <a
                  class={link}
                  href="#{section.id}"
                  aria-current={active === section.id ? 'location' : undefined}
                  ><span>{section.title}</span><small
                    class="text-muted-foreground text-[length:var(--cc-font-size-xs)] leading-[var(--pg-leading-small)]"
                    >{section.components.join(', ')}</small
                  ></a
                >
              </li>
            {/each}
          </ul>
        </div>
      {/each}
      <a class="{link} col-span-full font-semibold lg:col-auto" href={resolve('/dashboard')}
        >AppShell and Sidebar</a
      >
    </nav>
  </details>

  <div class="grid min-w-0 grid-cols-1 [&_h2[id]]:scroll-mt-6">
    <StateMatrix />

    <section class={section} aria-labelledby="c-buttons">
      <h2 id="c-buttons" class={h2}>Buttons</h2>
      <div class={row}>
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
      <div class={row}>
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

    <section class={section} aria-labelledby="c-forms">
      <h2 id="c-forms" class={h2}>Form fields</h2>
      <div class="grid max-w-md gap-4">
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

      <h3 id="c-invalid" class="text-[length:var(--cc-font-size-lg)] font-bold">Invalid state</h3>
      <p class={muted}>
        An icon and a screen-reader "Error:" prefix back the red text, and the control gets a
        stronger border, so the state never depends on colour alone.
      </p>
      <div class="grid max-w-md gap-4">
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

    <section class={section} aria-labelledby="c-overlays">
      <h2 id="c-overlays" class={h2}>Dialog, ConfirmDialog, Sheet, Toast</h2>
      <div class={row}>
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

    <section class={section} aria-labelledby="c-tabs">
      <h2 id="c-tabs" class={h2}>Tabs and Table</h2>
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
            <p class={muted}>Usage charts land with the dashboard sample.</p>
          {/if}
        {/snippet}
      </Tabs>
    </section>
    <Usage id="c-tabs" />

    <DataTableDemo />
    <Usage id="c-datatable" />

    <DisplayComponents />
    <Usage id="c-display" />

    <section class={section} aria-labelledby="c-status">
      <h2 id="c-status" class={h2}>Badge, Skeleton, EmptyState</h2>
      <div class={row}>
        <Badge>Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
      </div>
      <div class="flex max-w-sm items-center gap-4" aria-label="Loading example" role="group">
        <Skeleton width="3rem" height="3rem" circle />
        <div class="grid flex-1 gap-2">
          <Skeleton width="40%" height="1rem" />
          <Skeleton height="0.75rem" />
          <Skeleton width="80%" height="0.75rem" />
        </div>
      </div>
      <div class="border-input rounded-lg border border-dashed">
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
