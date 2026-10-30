<!--
  Four whole screens composed only from @codecora/ui. Each sits in a framed
  region so the surfaces read as separate pages.
-->
<script lang="ts">
  import { Inbox, Plus } from '@codecora/icons/lucide';
  import {
    Alert,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    CodeBlock,
    EmptyState,
    Field,
    FieldGroup,
    Input,
    Link,
    Progress,
    RadioGroup,
    Select,
    Separator,
    Slider,
    Switch,
    toast,
    Toaster,
  } from '@codecora/ui';

  // Sign in
  let email = $state('');
  let password = $state('');
  let remember = $state(true);
  let attempted = $state(false);
  const emailError = $derived(
    attempted && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter an address like name@example.com.' : '',
  );
  const passwordError = $derived(
    attempted && password.length < 8 ? 'Use at least 8 characters.' : '',
  );

  // Settings
  let digest = $state('weekly');
  let alerts = $state(true);
  let retention = $state(30);
  let region = $state('eu');
  const regions = [
    { value: 'eu', label: 'Europe (Frankfurt)' },
    { value: 'us', label: 'United States (Virginia)' },
    { value: 'ap', label: 'Asia Pacific (Singapore)' },
  ];

  // List and detail
  const memories = [
    {
      id: 'm1',
      title: 'Chose uteke-serve over a custom API',
      type: 'decision',
      tags: ['project:corin'],
      body: 'The desktop app talks to uteke-serve on localhost so the CLI, MCP server and app share one store.',
    },
    {
      id: 'm2',
      title: 'Embedding model downloads on first use',
      type: 'gotcha',
      tags: ['project:uteke'],
      body: 'A fresh UTEKE_HOME fetches the model (about 40 s). Tests need a long timeout on a cold start.',
    },
    {
      id: 'm3',
      title: 'Release v0.1.0 ships as tarballs',
      type: 'fact',
      tags: ['project:codecora-ui'],
      body: 'Packages install from GitHub Release tarballs until the npm scope is claimed.',
    },
  ];
  let current = $state('m1');
  const open = $derived(memories.find((m) => m.id === current)!);

  // First run
  const steps = [
    { label: 'Create an API key', done: true },
    { label: 'Connect your editor', done: true },
    { label: 'Save your first memory', done: false },
    { label: 'Invite a teammate', done: false },
  ];
  const progress = steps.filter((s) => s.done).length;
</script>

<section aria-labelledby="s-login">
  <h2 id="s-login">Sign in</h2>
  <div class="frame center">
    <Card class="narrow">
      {#snippet header()}Sign in to Uteke{/snippet}
      <form
        class="stack"
        novalidate
        onsubmit={(event) => {
          event.preventDefault();
          attempted = true;
          if (!emailError && !passwordError && email && password) toast.success('Signed in');
        }}
      >
        {#if attempted && (emailError || passwordError)}
          <Alert tone="danger" title="Check the form">Fix the highlighted fields to continue.</Alert
          >
        {/if}
        <Field label="Email" error={emailError} required>
          {#snippet children(control)}
            <Input {...control} type="email" bind:value={email} autocomplete="email" />
          {/snippet}
        </Field>
        <Field label="Password" error={passwordError} required>
          {#snippet children(control)}
            <Input
              {...control}
              type="password"
              bind:value={password}
              autocomplete="current-password"
            />
          {/snippet}
        </Field>
        <Checkbox label="Keep me signed in" bind:checked={remember} />
        <Button variant="primary" type="submit">Sign in</Button>
        <p class="muted center-text">
          New here? <Link href="#s-login">Create an account</Link>
        </p>
      </form>
    </Card>
  </div>
</section>

<section aria-labelledby="s-settings">
  <h2 id="s-settings">Settings</h2>
  <div class="frame">
    <div class="stack wide">
      <Breadcrumb items={[{ label: 'Workspace', href: '#s-settings' }, { label: 'Settings' }]} />
      <Card>
        {#snippet header()}Memory{/snippet}
        <div class="stack">
          <Field label="Region" description="Where your memories are stored.">
            {#snippet children(control)}<Select
                {...control}
                items={regions}
                bind:value={region}
              />{/snippet}
          </Field>
          <Slider
            label="Keep deleted memories for"
            bind:value={retention}
            min={7}
            max={90}
            showValue
            format={(v) => `${v} days`}
          />
        </div>
      </Card>
      <Card>
        {#snippet header()}Notifications{/snippet}
        <div class="stack">
          <Switch label="Email alerts" description="At most one a day." bind:checked={alerts} />
          <Separator />
          <FieldGroup legend="Digest" description="A summary of new memories.">
            {#snippet children(group)}
              <RadioGroup
                label="Digest"
                bind:value={digest}
                items={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'never', label: 'Never' },
                ]}
                {...group}
              />
            {/snippet}
          </FieldGroup>
        </div>
        {#snippet footer()}
          <Button variant="primary" onclick={() => toast.success('Settings saved')}
            >Save changes</Button
          >
        {/snippet}
      </Card>
    </div>
  </div>
</section>

<section aria-labelledby="s-list">
  <h2 id="s-list">List and detail</h2>
  <div class="frame split">
    <ul class="list" aria-label="Memories">
      {#each memories as memory (memory.id)}
        <li>
          <button
            type="button"
            class="item"
            aria-current={memory.id === current ? 'true' : undefined}
            onclick={() => (current = memory.id)}
          >
            <span class="title">{memory.title}</span>
            <Badge
              tone={memory.type === 'decision'
                ? 'accent'
                : memory.type === 'gotcha'
                  ? 'warning'
                  : 'neutral'}>{memory.type}</Badge
            >
          </button>
        </li>
      {/each}
    </ul>
    <Card>
      {#snippet header()}{open.title}{/snippet}
      <div class="stack">
        <p>{open.body}</p>
        <div class="tags">
          {#each open.tags as tag (tag)}<Badge>{tag}</Badge>{/each}
        </div>
        <CodeBlock language="bash" code={`uteke get ${open.id}`} />
      </div>
      {#snippet footer()}
        <Button>Edit</Button>
        <Button variant="danger">Forget</Button>
      {/snippet}
    </Card>
  </div>
</section>

<section aria-labelledby="s-first">
  <h2 id="s-first">First run</h2>
  <div class="frame split">
    <Card>
      {#snippet header()}Get started{/snippet}
      <div class="stack">
        <Progress label="Setup" value={progress} max={steps.length} showValue />
        <ol class="steps">
          {#each steps as step (step.label)}
            <li class:done={step.done}>
              <Checkbox label={step.label} checked={step.done} disabled />
            </li>
          {/each}
        </ol>
      </div>
    </Card>
    <div class="empty">
      <EmptyState
        icon={Inbox}
        title="No memories yet"
        description="Save one from your editor or the command line and it shows up here."
      >
        {#snippet action()}<Button variant="primary" icon={Plus}>Save a memory</Button>{/snippet}
      </EmptyState>
    </div>
  </div>
</section>

<Toaster />

<style>
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-3);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  .frame {
    padding: var(--cc-space-6);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface-sunken);
  }
  .frame.center {
    display: grid;
    place-items: center;
  }
  .frame.split {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: var(--cc-space-4);
    align-items: start;
  }
  .stack {
    display: grid;
    gap: var(--cc-space-4);
  }
  .wide {
    max-width: 40rem;
  }
  :global(.narrow) {
    width: min(100%, 24rem);
  }
  .muted {
    margin: 0;
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
  }
  .center-text {
    text-align: center;
  }
  .list {
    display: grid;
    gap: var(--cc-space-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cc-space-3);
    width: 100%;
    min-height: var(--cc-control-h);
    padding: var(--cc-space-2) var(--cc-space-3);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-raised);
    color: var(--cc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .item:hover {
    background: var(--cc-surface-hover);
  }
  .item[aria-current='true'] {
    border-color: var(--cc-accent);
    box-shadow: inset var(--cc-row-marker) 0 0 var(--cc-accent);
  }
  .item:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: var(--cc-focus-offset);
  }
  .title {
    font-weight: 500;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cc-space-2);
  }
  .steps {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .empty {
    border: 1px dashed var(--cc-border-strong);
    border-radius: var(--cc-radius-lg);
    background: var(--cc-surface);
  }
</style>
