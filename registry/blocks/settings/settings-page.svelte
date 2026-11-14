<!--
  Account settings: profile, notifications and a danger zone in tabs, saved
  with one button. The app owns this file: replace the fields with its own and
  wire `onsave` and `ondelete` to its API.
-->
<script lang="ts" module>
  export interface Settings {
    name: string;
    email: string;
    timezone: string;
    product: boolean;
    security: boolean;
    digest: string;
  }
</script>

<script lang="ts">
  import { Button, ConfirmDialog, Field, Input, Select, Switch, Tabs } from '@codecora/ui';

  interface Props {
    /** Starting values; the form keeps its own copy until it is saved. */
    initial?: Partial<Settings>;
    onsave?: (settings: Settings) => Promise<void> | void;
    ondelete?: () => Promise<void> | void;
  }

  let { initial = {}, onsave, ondelete }: Props = $props();

  const defaults: Settings = {
    name: '',
    email: '',
    timezone: 'UTC',
    product: true,
    security: true,
    digest: 'weekly',
  };
  // A one-time copy: the form edits its own state, not the caller's object.
  // svelte-ignore state_referenced_locally
  let values = $state<Settings>({ ...defaults, ...initial });
  let tab = $state('profile');
  let saving = $state(false);
  let status = $state('');
  let confirmOpen = $state(false);

  const timezones = ['UTC', 'Europe/London', 'America/New_York', 'Asia/Jakarta', 'Asia/Tokyo'].map(
    (zone) => ({ value: zone, label: zone }),
  );
  const digests = [
    { value: 'off', label: 'Off' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  async function save(event: SubmitEvent) {
    event.preventDefault();
    saving = true;
    status = '';
    try {
      await onsave?.($state.snapshot(values));
      status = 'Settings saved.';
    } catch (e) {
      status = e instanceof Error ? e.message : 'Could not save. Try again.';
    } finally {
      saving = false;
    }
  }
</script>

<form class="cc-settings grid w-full max-w-160 gap-6" onsubmit={save}>
  <header>
    <h1 class="leading-heading text-xl">Settings</h1>
    <p class="text-muted-foreground">Changes apply after you save.</p>
  </header>

  <Tabs
    label="Settings sections"
    items={[
      { value: 'profile', label: 'Profile' },
      { value: 'notifications', label: 'Notifications' },
      { value: 'danger', label: 'Danger zone' },
    ]}
    bind:value={tab}
  >
    {#snippet panel(value)}
      <div class="grid gap-4 py-4">
        {#if value === 'profile'}
          <Field label="Name">
            {#snippet children(control)}
              <Input {...control} autocomplete="name" bind:value={values.name} />
            {/snippet}
          </Field>
          <Field label="Email" description="Sign-in and notification emails go here.">
            {#snippet children(control)}
              <Input {...control} type="email" autocomplete="email" bind:value={values.email} />
            {/snippet}
          </Field>
          <Field label="Time zone">
            {#snippet children(control)}
              <Select {...control} items={timezones} bind:value={values.timezone} />
            {/snippet}
          </Field>
        {:else if value === 'notifications'}
          <Switch
            label="Product updates"
            description="New features and changes."
            bind:checked={values.product}
          />
          <Switch
            label="Security alerts"
            description="New sign-ins and key changes."
            bind:checked={values.security}
          />
          <Field label="Activity digest">
            {#snippet children(control)}
              <Select {...control} items={digests} bind:value={values.digest} />
            {/snippet}
          </Field>
        {:else}
          <div
            class="border-destructive flex flex-wrap items-center justify-between gap-4 rounded-md border p-4"
          >
            <div>
              <h2 class="leading-heading text-base">Delete account</h2>
              <p class="text-muted-foreground">
                Removes the account and everything in it. This cannot be undone.
              </p>
            </div>
            <Button variant="danger" onclick={() => (confirmOpen = true)}>Delete account</Button>
          </div>
        {/if}
      </div>
    {/snippet}
  </Tabs>

  <footer class="flex flex-wrap items-center justify-end gap-4">
    <p class="text-muted-foreground" role="status">{status}</p>
    <Button type="submit" variant="primary" loading={saving} loadingLabel="Saving">
      Save changes
    </Button>
  </footer>
</form>

<ConfirmDialog
  bind:open={confirmOpen}
  title="Delete this account?"
  description="Everything in it is removed for good."
  confirmLabel="Delete account"
  tone="danger"
  onconfirm={() => ondelete?.()}
/>
