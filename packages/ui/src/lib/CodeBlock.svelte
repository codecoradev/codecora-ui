<!--
  Preformatted code with a copy button; the page announces the copy politely.
  When the clipboard refuses (no permission, an embedding frame), the code is
  selected instead, so the platform copy shortcut works, and the failure is said.
-->
<script lang="ts">
  import Button from './Button.svelte';
  import { cn, type ClassValue } from './cn.js';

  interface Props {
    code: string;
    /** Names the block for assistive tech and shows as a caption, for example "bash". */
    language?: string;
    class?: ClassValue;
  }

  let { code, language, class: className }: Props = $props();

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

<figure class={cn('cc-code border-border bg-muted m-0 rounded-md border', className)}>
  <figcaption
    class="border-border text-muted-foreground flex items-center justify-between border-b py-1 pr-2 pl-3 font-mono text-xs leading-[inherit]"
  >
    <span>{language ?? 'code'}</span>
    <Button variant="ghost" onclick={copy}>{label[status]}</Button>
  </figcaption>
  <!-- A scrollable code block must be keyboard reachable (axe: scrollable-region-focusable). -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre
    class="ligatures-none focus-visible:outline-ring m-0 overflow-x-auto p-3 font-mono text-sm leading-[inherit] focus-visible:outline-[length:var(--cc-focus-width)] focus-visible:-outline-offset-2"
    tabindex="0"
    aria-label={language ? `${language} code` : 'Code'}><code bind:this={codeEl}>{code}</code></pre>
  <span class="sr-only m-0" role="status" aria-live="polite">{message[status]}</span>
</figure>
