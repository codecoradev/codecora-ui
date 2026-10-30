<script lang="ts">
  import CommandPalette from '../CommandPalette.svelte';

  let { onkeys, onbilling }: { onkeys: () => void; onbilling: () => void } = $props();
  let open = $state(false);
</script>

<CommandPalette
  bind:open
  groups={[
    {
      heading: 'Go to',
      items: [
        { value: 'keys', label: 'API keys', hint: 'G K', onselect: onkeys },
        { value: 'billing', label: 'Billing', keywords: ['invoices'], onselect: onbilling },
      ],
    },
  ]}
/>
