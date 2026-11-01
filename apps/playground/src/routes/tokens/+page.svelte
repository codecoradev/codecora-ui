<script lang="ts">
  import Catalogue from '../../lib/Catalogue.svelte';
  import Stage from '../../lib/Stage.svelte';
  import ThemeIndex from '../../lib/ThemeIndex.svelte';
</script>

<Stage
  title="Tokens"
  lead="A page per theme, then the colour roles, type, radius, spacing and contrast pairs of the theme and accent you pick."
>
  {#snippet children({ theme, accent })}
    <ThemeIndex current={theme} />
    <Catalogue {theme} {accent} />
  {/snippet}
</Stage>
