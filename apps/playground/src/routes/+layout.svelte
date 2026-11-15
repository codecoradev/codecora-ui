<script lang="ts">
  import { Favicons } from '@codecora/brand';
  import '../app.css';
  import { fontFaces } from '../lib/fonts';

  let { children } = $props();
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static @font-face rules built from bundled font URLs -->
  {@html `<style>${fontFaces}</style>`}
</svelte:head>

<!-- the playground shows the CodeCora mascot, the same artwork as Corin -->
<Favicons product="corin" />

{@render children()}
