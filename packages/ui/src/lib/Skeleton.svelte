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
    background: linear-gradient(
      90deg,
      var(--cc-surface-sunken),
      var(--cc-surface-hover),
      var(--cc-surface-sunken)
    );
    background-size: 200% 100%;
    animation: cc-shimmer 1.4s ease-in-out infinite;
  }
  .circle {
    border-radius: var(--cc-radius-pill);
  }
  @keyframes cc-shimmer {
    to {
      background-position: -200% 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .cc-skeleton {
      animation: none;
    }
  }
</style>
