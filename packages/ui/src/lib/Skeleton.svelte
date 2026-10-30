<!-- Loading placeholder. Decorative: pair it with a Spinner or a live region that says what is loading. -->
<script lang="ts">
  interface Props {
    width?: string;
    height?: string;
    /** Fully round, for avatars. */
    circle?: boolean;
  }

  let { width = '100%', height = '1em', circle = false }: Props = $props();
</script>

<span class="cc-skeleton" class:circle style:width style:height aria-hidden="true"></span>

<style>
  .cc-skeleton {
    display: block;
    border-radius: var(--cc-radius-sm);
    background: var(--cc-surface-hover);
    /* Opacity runs on the compositor; the old background-position shimmer repainted every frame. */
    animation: cc-pulse 1.4s ease-in-out infinite;
  }
  .circle {
    border-radius: var(--cc-radius-pill);
  }
  @keyframes cc-pulse {
    50% {
      opacity: 0.45;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .cc-skeleton {
      animation: none;
    }
  }
</style>
