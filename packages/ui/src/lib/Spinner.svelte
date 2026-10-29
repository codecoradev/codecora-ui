<!-- Indeterminate progress. Announces its label politely; spins unless the user prefers reduced motion. -->
<script lang="ts">
  import VisuallyHidden from './VisuallyHidden.svelte';

  interface Props {
    label?: string;
  }

  let { label = 'Loading' }: Props = $props();
</script>

<span class="cc-spinner" role="status">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke-linecap="round" />
  </svg>
  <VisuallyHidden>{label}</VisuallyHidden>
</span>

<style>
  .cc-spinner {
    display: inline-flex;
  }
  svg {
    width: var(--cc-icon-size);
    height: var(--cc-icon-size);
    stroke-width: var(--cc-icon-stroke);
    animation: cc-spin 0.8s linear infinite;
  }
  @keyframes cc-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    svg {
      animation-duration: 2.4s;
    }
  }
</style>
