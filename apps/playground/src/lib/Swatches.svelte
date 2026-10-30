<script lang="ts">
  // Every colour role, painted from the live tokens of the surrounding scope.
  const groups: { id: string; title: string; roles: { name: string; use: string }[] }[] = [
    {
      id: 'surfaces',
      title: 'Surfaces and lines',
      roles: [
        { name: 'surface', use: 'Page' },
        { name: 'surface-raised', use: 'Cards, inputs, popovers' },
        { name: 'surface-sunken', use: 'Wells, sidebars' },
        { name: 'surface-hover', use: 'Hover tint' },
        { name: 'border', use: 'Decorative hairline' },
        { name: 'border-strong', use: 'Control boundary, 3:1' },
      ],
    },
    {
      id: 'text',
      title: 'Text and accent',
      roles: [
        { name: 'text', use: 'Body text' },
        { name: 'text-muted', use: 'Secondary text' },
        { name: 'accent', use: 'Action, link, selection' },
        { name: 'accent-hover', use: 'Action on hover' },
        { name: 'accent-soft', use: 'Selected row' },
        { name: 'focus', use: 'Focus ring' },
      ],
    },
    {
      id: 'status',
      title: 'Status',
      roles: [
        { name: 'danger', use: 'Errors, destructive' },
        { name: 'danger-soft', use: 'Behind danger text' },
        { name: 'success', use: 'Done, healthy' },
        { name: 'success-soft', use: 'Behind success text' },
        { name: 'warning', use: 'Needs attention' },
        { name: 'warning-soft', use: 'Behind warning text' },
      ],
    },
  ];
</script>

<div class="groups">
  {#each groups as group (group.id)}
    <section class="group" aria-labelledby="sw-{group.id}">
      <h3 id="sw-{group.id}">{group.title}</h3>
      <ul>
        {#each group.roles as role (role.name)}
          <li>
            <span class="chip" style:background="var(--cc-{role.name})" aria-hidden="true"></span>
            <code>--cc-{role.name}</code>
            <span class="use">{role.use}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  .groups {
    display: grid;
    gap: var(--cc-space-8);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  }
  .group {
    display: grid;
    gap: var(--cc-space-3);
    align-content: start;
  }
  h3 {
    font-size: var(--cc-font-size-sm);
    color: var(--cc-text-muted);
    font-family: var(--cc-font-sans);
    font-weight: 600;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--cc-space-2);
  }
  li {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    column-gap: var(--cc-space-3);
    align-items: center;
  }
  .chip {
    grid-row: span 2;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--cc-radius-md);
    border: 1px solid var(--cc-border);
  }
  code {
    font-size: var(--cc-font-size-sm);
  }
  .use {
    font-size: var(--cc-font-size-xs);
    color: var(--cc-text-muted);
  }
</style>
