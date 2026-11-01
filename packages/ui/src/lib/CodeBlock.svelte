<!--
  Preformatted code with a copy button; the page announces the copy politely.
  When the clipboard refuses (no permission, an embedding frame), the code is
  selected instead, so the platform copy shortcut works, and the failure is said.
-->
<script lang="ts">
  import Button from './Button.svelte';

  interface Props {
    code: string;
    /** Names the block for assistive tech and shows as a caption, for example "bash". */
    language?: string;
  }

  let { code, language }: Props = $props();

  let status = $state<'idle' | 'copied' | 'failed'>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;
  let codeEl = $state<HTMLElement>();

  const label = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' };
  const message = {
    idle: '',
    copied: 'Copied to the clipboard',
    failed: 'Could not copy. The code is selected; copy it with your keyboard.',
  };

  function selectCode() {
    const selection = window.getSelection();
    if (!codeEl || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(codeEl);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function copy() {
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(code);
      status = 'copied';
    } catch {
      selectCode();
      status = 'failed';
    }
    timer = setTimeout(() => (status = 'idle'), status === 'failed' ? 4000 : 2000);
  }
</script>

<figure class="cc-code">
  <figcaption>
    <span>{language ?? 'code'}</span>
    <Button variant="ghost" onclick={copy}>{label[status]}</Button>
  </figcaption>
  <!-- A scrollable code block must be keyboard reachable (axe: scrollable-region-focusable). -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" aria-label={language ? `${language} code` : 'Code'}><code bind:this={codeEl}
      >{code}</code
    ></pre>
  <span class="live" role="status" aria-live="polite">{message[status]}</span>
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
