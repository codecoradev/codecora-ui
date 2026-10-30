<!-- Panel that slides in from an edge: filters, detail views, mobile menus. -->
<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Modal from './internal/Modal.svelte';

  type Props = Omit<ComponentProps<typeof Modal>, 'placement' | 'alert' | 'theme'> & {
    side?: 'right' | 'left' | 'bottom';
    /** Theme name for the panel, which renders in a portal outside the page frame. */
    theme?: string;
  };

  let { open = $bindable(false), side = 'right', theme, ...rest }: Props = $props();
</script>

<Modal bind:open placement={side} {theme} {...rest} />
