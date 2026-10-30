<!-- Test icon: records the props it receives so adapters can be checked. -->
<script lang="ts">
  let { weight = 'none' }: { weight?: string } = $props();
</script>

<svg viewBox="0 0 24 24" data-weight={weight} width="24" height="24" stroke-width="2"
  ><path d="M4 12h16" /></svg
>
