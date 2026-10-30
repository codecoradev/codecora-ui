<script lang="ts">
  import Popover from '../Popover.svelte';
</script>

<Popover label="Filters">
  {#snippet trigger({ props })}<button {...props}>Filters</button>{/snippet}
  <p>Narrow the list</p>
</Popover>
