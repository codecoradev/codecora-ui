<script lang="ts">
  import MemoryDemo from '../../lib/MemoryDemo.svelte';
  import Stage from '../../lib/Stage.svelte';
</script>

<Stage
  title="Memory"
  lead="MemoryList, MemoryDetail and MemoryEditor from @codecora/memory, over sample data or a live uteke-serve. What a backend lacks is not offered."
>
  {#snippet children({ theme })}
    <MemoryDemo {theme} />
  {/snippet}
</Stage>
