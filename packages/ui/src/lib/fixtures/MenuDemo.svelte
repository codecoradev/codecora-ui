<script lang="ts">
  import DropdownMenu from '../DropdownMenu.svelte';

  let { onrename, ondelete }: { onrename: () => void; ondelete: () => void } = $props();
</script>

<DropdownMenu
  label="Key actions"
  items={[
    { label: 'Rename', onselect: onrename },
    { label: 'Revoke', onselect: ondelete, danger: true, separatorBefore: true },
    { label: 'Archive', onselect: () => {}, disabled: true },
  ]}
>
  {#snippet trigger({ props })}<button {...props}>Actions</button>{/snippet}
</DropdownMenu>
