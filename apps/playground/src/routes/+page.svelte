<script lang="ts">
  import { VisuallyHidden } from '@codecora/ui';
</script>

<svelte:head>
  <title>CodeCora UI playground</title>
</svelte:head>

<main>
  <h1>CodeCora UI playground</h1>
  <p>
    Skeleton for M0. The catalogue with theme, density and accent switchers comes with issue #5.
  </p>
  <button type="button">
    <span aria-hidden="true">×</span>
    <VisuallyHidden>Close (sample of a package component)</VisuallyHidden>
  </button>
</main>
