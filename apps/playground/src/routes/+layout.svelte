<script lang="ts">
  import '@codecora/tokens/tokens.css';
  import '../lib/playground.css';
  import { fontFaces } from '../lib/fonts';

  let { children } = $props();
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static @font-face rules built from bundled font URLs -->
  {@html `<style>${fontFaces}</style>`}
</svelte:head>

{@render children()}
