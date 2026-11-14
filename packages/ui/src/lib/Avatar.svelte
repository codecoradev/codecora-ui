<!-- A person or workspace: the image when it loads, otherwise initials from `name`. -->
<script module lang="ts">
  import { tv } from './internal/variants.js';

  const avatar = tv({
    base: 'cc-avatar bg-muted text-foreground inset-ring-border inline-flex flex-none items-center justify-center overflow-hidden rounded-full font-semibold inset-ring select-none',
    variants: {
      size: {
        sm: 'size-6 text-xs leading-[inherit]',
        md: 'size-9 text-sm leading-[inherit]',
        lg: 'size-14 text-lg leading-[inherit]',
      },
    },
  });
</script>

<script lang="ts">
  import { Avatar } from 'bits-ui';
  import { cn } from './cn.js';

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

<Avatar.Root class={cn(avatar({ size }), `cc-avatar-${size}`)} role="img" aria-label={name}>
  <!-- bits-ui shows the image once it has loaded; it fades in over the initials' place. -->
  {#if src}<Avatar.Image
      {src}
      alt=""
      class="animate-fade-in size-full object-cover motion-reduce:animate-none"
    />{/if}
  <Avatar.Fallback>{initials}</Avatar.Fallback>
</Avatar.Root>
