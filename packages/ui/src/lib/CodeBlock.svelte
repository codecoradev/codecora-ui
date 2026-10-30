<!-- Preformatted code with a copy button; the page announces the copy politely. -->
<script lang="ts">
  import Button from './Button.svelte';

  interface Props {
    code: string;
    /** Names the block for assistive tech and shows as a caption, for example "bash". */
    language?: string;
  }

  let { code, language }: Props = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      clearTimeout(timer);
      timer = setTimeout(() => (copied = false), 2000);
    } catch {
      copied = false;
    }
  }
</script>

<figure class="cc-code">
  <figcaption>
    <span>{language ?? 'code'}</span>
    <Button variant="ghost" onclick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
  </figcaption>
  <!-- A scrollable code block must be keyboard reachable (axe: scrollable-region-focusable). -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" aria-label={language ? `${language} code` : 'Code'}><code>{code}</code></pre>
  <span class="live" role="status" aria-live="polite"
    >{copied ? 'Copied to the clipboard' : ''}</span
  >
</figure>

<style>
  .cc-code {
    margin: 0;
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    background: var(--cc-surface-sunken);
  }
  figcaption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--cc-space-1) var(--cc-space-2) var(--cc-space-1) var(--cc-space-3);
    border-bottom: 1px solid var(--cc-border);
    color: var(--cc-text-muted);
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-xs);
  }
  pre {
    margin: 0;
    overflow-x: auto;
    padding: var(--cc-space-3);
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-sm);
  }
  pre:focus-visible {
    outline: var(--cc-focus-width) solid var(--cc-focus);
    outline-offset: -2px;
  }
  .live {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
