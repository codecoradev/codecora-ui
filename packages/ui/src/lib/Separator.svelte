<!-- A rule between groups. Decorative by default; pass `decorative={false}` to expose it to assistive tech. -->
<script lang="ts">
  import { Separator } from 'bits-ui';

  interface Props {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }

  let { orientation = 'horizontal', decorative = true }: Props = $props();
</script>

<Separator.Root
  {orientation}
  {decorative}
  class={['cc-separator', `cc-separator-${orientation}`]}
/>

<style>
  :global(.cc-separator) {
    flex: none;
    background: var(--cc-border);
  }
  :global(.cc-separator-horizontal) {
    width: 100%;
    height: 1px;
  }
  :global(.cc-separator-vertical) {
    width: 1px;
    align-self: stretch;
  }
</style>
