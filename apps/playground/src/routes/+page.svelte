<script lang="ts">
  import Catalogue from '../lib/Catalogue.svelte';
  import Stage from '../lib/Stage.svelte';
</script>

<Stage
  title="CodeCora UI"
  lead="Tokens, themes and components for CodeCora products. Pick a theme, accent and density; everything below follows."
>
  {#snippet children({ theme, accent })}
    <Catalogue {theme} {accent} />
  {/snippet}
</Stage>
