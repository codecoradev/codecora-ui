<!--
  A product mark as an image. Decorative by default (empty alt); pass `label`
  when the mark stands alone, for example as the only content of a link.
-->
<script lang="ts">
  import { marks, type ProductName } from './marks.js';

  interface Props {
    product: ProductName;
    /** Width and height in px. */
    size?: number;
    /** Accessible name; without it the image is decorative. */
    label?: string;
    class?: string;
  }

  let { product, size = 32, label, class: className }: Props = $props();

  const mark = $derived(marks[product]);
</script>

<img
  class={['cc-mark', className]}
  src={mark.mark}
  alt={label ?? ''}
  width={size}
  height={size}
  decoding="async"
/>

<style>
  .cc-mark {
    display: inline-block;
    flex: none;
    object-fit: contain;
  }
</style>
