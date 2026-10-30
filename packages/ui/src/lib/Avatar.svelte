<!-- A person or workspace: the image when it loads, otherwise initials from `name`. -->
<script lang="ts">
  import { Avatar } from 'bits-ui';

  interface Props {
    /** Full name; names the avatar and supplies the initials. */
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  let { name, src, size = 'md' }: Props = $props();

  const initials = $derived(
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join(''),
  );
</script>

<Avatar.Root class={['cc-avatar', `cc-avatar-${size}`]} role="img" aria-label={name}>
  {#if src}<Avatar.Image {src} alt="" class="img" />{/if}
  <Avatar.Fallback class="fallback">{initials}</Avatar.Fallback>
</Avatar.Root>

<style>
  :global(.cc-avatar) {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: var(--cc-radius-pill);
    background: var(--cc-surface-sunken);
    box-shadow: inset 0 0 0 1px var(--cc-border);
    color: var(--cc-text);
    font-weight: 600;
    user-select: none;
  }
  :global(.cc-avatar-sm) {
    width: 1.5rem;
    height: 1.5rem;
    font-size: var(--cc-font-size-xs);
  }
  :global(.cc-avatar-md) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: var(--cc-font-size-sm);
  }
  :global(.cc-avatar-lg) {
    width: 3.5rem;
    height: 3.5rem;
    font-size: var(--cc-font-size-lg);
  }
  :global(.cc-avatar .img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
