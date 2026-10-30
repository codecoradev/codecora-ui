<!--
  Small inline SVG glyphs for the library's own controls (close, chevron,
  check). Inline so @codecora/ui has no icon dependency (D9); stroke and size
  follow the theme through --cc-icon-*.
-->
<script lang="ts">
  interface Props {
    name: 'close' | 'chevron-down' | 'check' | 'chevron-left' | 'chevron-right' | 'menu';
  }

  let { name }: Props = $props();

  const paths = {
    close: 'M6 6l12 12M18 6L6 18',
    'chevron-down': 'M6 9l6 6 6-6',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    'chevron-left': 'M15 6l-6 6 6 6',
    'chevron-right': 'M9 6l6 6-6 6',
    menu: 'M4 7h16M4 12h16M4 17h16',
  } as const;
</script>

<svg
  class="cc-glyph"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  <path d={paths[name]} />
</svg>

<style>
  .cc-glyph {
    flex: none;
    width: var(--cc-icon-size);
    height: var(--cc-icon-size);
    stroke-width: var(--cc-icon-stroke);
  }
</style>
