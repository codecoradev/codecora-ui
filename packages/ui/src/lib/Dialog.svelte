<!-- Centered modal dialog. Pass `open` to control it, or a `trigger` snippet that spreads `props` onto its button. -->
<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Modal from './internal/Modal.svelte';

  type Props = Omit<ComponentProps<typeof Modal>, 'placement' | 'alert' | 'theme'> & {
    /** Theme name for the panel, which renders in a portal outside the page frame. */
    theme?: string;
  };

  let { open = $bindable(false), theme, ...rest }: Props = $props();
</script>

<Modal bind:open placement="center" {theme} {...rest} />
