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

<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*64)),1fr))] gap-8">
  {#each groups as group (group.id)}
    <section class="grid content-start gap-3" aria-labelledby="sw-{group.id}">
      <h3
        id="sw-{group.id}"
        class="text-muted-foreground font-sans text-[length:var(--cc-font-size-sm)] font-semibold"
      >
        {group.title}
      </h3>
      <ul class="grid gap-2">
        {#each group.roles as role (role.name)}
          <li class="grid grid-cols-[calc(var(--spacing)*10)_1fr] items-center gap-x-3">
            <span
              class="border-border row-span-2 size-10 rounded-md border"
              style:background="var(--cc-{role.name})"
              aria-hidden="true"
            ></span>
            <code class="text-[length:var(--cc-font-size-sm)]">--cc-{role.name}</code>
            <span class="text-muted-foreground text-[length:var(--cc-font-size-xs)]"
              >{role.use}</span
            >
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>
