<!-- Indeterminate progress. Announces its label politely; spins unless the user prefers reduced motion. -->
<script lang="ts">
  import VisuallyHidden from './VisuallyHidden.svelte';

  interface Props {
    label?: string;
  }

  let { label = 'Loading' }: Props = $props();
</script>

<!-- Under reduced motion it keeps turning, three times slower. -->
<span data-slot="spinner" class="inline-flex" role="status">
  <svg
    class="size-icon animate-spinner motion-reduce:animate-spinner-reduced stroke-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="9" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke-linecap="round" />
  </svg>
  <VisuallyHidden>{label}</VisuallyHidden>
</span>
