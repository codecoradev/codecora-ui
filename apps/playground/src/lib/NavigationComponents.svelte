<!-- Breadcrumb, Accordion, ToggleGroup, Pagination, Popover and DropdownMenu. -->
<script lang="ts">
  import { Ellipsis, Pencil, Trash } from '@codecora/icons/lucide';
  import {
    Accordion,
    Breadcrumb,
    Button,
    DropdownMenu,
    IconButton,
    Pagination,
    Popover,
    ToggleGroup,
    toast,
  } from '@codecora/ui';

  let view = $state('list');
  let page = $state(3);
</script>

<section aria-labelledby="c-nav">
  <h2 id="c-nav">Breadcrumb, Accordion, ToggleGroup, Pagination, Popover, Menu</h2>

  <Breadcrumb
    items={[
      { label: 'Home', href: '#c-nav' },
      { label: 'API keys', href: '#c-nav' },
      { label: 'ci-deploy' },
    ]}
  />

  <div class="row">
    <ToggleGroup
      label="View"
      bind:value={view}
      items={[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'table', label: 'Table', disabled: true },
      ]}
    />

    <Popover label="Filters">
      {#snippet trigger({ props })}<Button {...props}>Filters</Button>{/snippet}
      <p class="plain">Narrow the list by status or scope.</p>
    </Popover>

    <DropdownMenu
      label="Key actions"
      items={[
        { label: 'Rename', icon: Pencil, onselect: () => toast.show({ title: 'Rename chosen' }) },
        {
          label: 'Revoke',
          icon: Trash,
          danger: true,
          separatorBefore: true,
          onselect: () => toast.error('Key revoked'),
        },
      ]}
    >
      {#snippet trigger({ props })}
        <IconButton {...props} icon={Ellipsis} label="Key actions" variant="secondary" />
      {/snippet}
    </DropdownMenu>
  </div>

  <Accordion
    items={[
      { value: 'billing', label: 'Billing' },
      { value: 'security', label: 'Security' },
      { value: 'danger', label: 'Danger zone', disabled: true },
    ]}
    value="billing"
  >
    {#snippet panel(value)}
      {#if value === 'billing'}
        Invoices are emailed on the first of the month.
      {:else}
        Rotate keys every 90 days and revoke any that are unused.
      {/if}
    {/snippet}
  </Accordion>

  <Pagination count={240} perPage={10} bind:page />
  <p class="plain">Page {page} of 24</p>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cc-space-3);
  }
  .plain {
    margin: 0;
  }
</style>
