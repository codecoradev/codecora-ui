<!--
  SvelteKit's own error page, with the heading the browser used to give it
  (twice the body size, bold) now that Tailwind's preflight resets headings.
-->
<script lang="ts">
  import { page } from '$app/state';
</script>

<h1 class="text-[length:calc(2*var(--cc-font-size-md))] font-bold">{page.status}</h1>
<p>{page.error?.message}</p>
