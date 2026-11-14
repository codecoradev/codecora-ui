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

<!-- Opacity pulses on the compositor; reduced motion holds it still. -->
<span
  class={[
    'cc-skeleton animate-skeleton bg-accent block motion-reduce:animate-none',
    circle ? 'rounded-full' : 'rounded-sm',
  ]}
  style:width
  style:height
  aria-hidden="true"
></span>
