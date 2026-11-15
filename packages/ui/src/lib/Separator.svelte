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
  data-slot="separator"
  class={[
    'bg-border flex-none',
    orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
  ]}
/>
