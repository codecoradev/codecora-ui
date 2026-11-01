<script lang="ts">
  import Overview from '../lib/Overview.svelte';
  import Stage from '../lib/Stage.svelte';
</script>

<Stage
  title="One frame, many faces"
  lead="Design tokens, eleven mixable themes and accessible Svelte 5 components. Pick a theme, accent and density; everything follows."
>
  {#snippet children({ theme, accent, density, setTheme })}
    <Overview {theme} {accent} {density} {setTheme} />
  {/snippet}
</Stage>
