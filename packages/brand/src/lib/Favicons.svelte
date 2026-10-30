<!--
  The <link> tags of a product's favicon set, for the document head:
  SVG where the artwork is vector, ICO and PNG fallbacks, and the touch icon.
-->
<script lang="ts">
  import { marks, type ProductName } from './marks.js';

  let { product }: { product: ProductName } = $props();

  const icons = $derived(marks[product].favicons);
</script>

<svelte:head>
  {#if icons.svg}<link rel="icon" type="image/svg+xml" href={icons.svg} />{/if}
  <link rel="icon" type="image/png" sizes="32x32" href={icons.png32} />
  <link rel="icon" type="image/png" sizes="16x16" href={icons.png16} />
  <link rel="icon" href={icons.ico} sizes="any" />
  <link rel="apple-touch-icon" sizes="180x180" href={icons.appleTouch} />
</svelte:head>
