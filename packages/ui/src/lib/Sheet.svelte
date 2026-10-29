<!-- Panel that slides in from an edge: filters, detail views, mobile menus. -->
<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Modal from './internal/Modal.svelte';

  type Props = Omit<ComponentProps<typeof Modal>, 'placement' | 'alert'> & {
    side?: 'right' | 'left' | 'bottom';
  };

  let { open = $bindable(false), side = 'right', ...rest }: Props = $props();
</script>

<Modal bind:open placement={side} {...rest} />
