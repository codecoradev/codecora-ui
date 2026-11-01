<script lang="ts">
  import Catalogue from '../../lib/Catalogue.svelte';
  import Stage from '../../lib/Stage.svelte';
</script>

<Stage
  panel
  title="Tokens"
  lead="Colour roles, type, radius and spacing, and the contrast pairs of the theme and accent you pick."
>
  {#snippet children({ theme, accent })}
    <Catalogue {theme} {accent} />
  {/snippet}
</Stage>
