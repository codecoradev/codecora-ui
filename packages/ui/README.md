# @codecora/ui

Svelte 5 components for CodeCora products, built on [bits-ui](https://bits-ui.com)
and styled with Tailwind 4 utilities on the theme variables of
`@codecora/tokens` (D13). See the
[repository README](../../README.md) and [docs/architecture.md](../../docs/architecture.md).

> Status: pre-release. First primitive set (M1): Button, IconButton, Field,
> Input, Textarea, Select, Dialog, ConfirmDialog, Sheet, Tabs, Table, Badge,
> Toaster (`toast`), Tooltip, EmptyState, Skeleton, Spinner, plus AppShell and
> Sidebar.

```css
/* app.css: Tailwind 4, then the theme and the component sources */
@import 'tailwindcss';
@import '@codecora/tokens/theme.css';
@import '@codecora/ui/source.css';
```

```svelte
<script>
  import { Button, Field, Input } from '@codecora/ui';
  import Plus from '@lucide/svelte/icons/plus'; // any icon component works
</script>

<Button variant="primary" icon={Plus}>Create key</Button>
```

The components are written with Tailwind utilities on the semantic theme
roles (`bg-primary`, `text-muted-foreground`, `rounded-md`, `h-control`) and
the CodeCora-only `--cc-*` tokens (focus ring, icon, badge shape, durations;
see the tokens README), so your app needs Tailwind 4 with the three imports
above (`source.css` makes Tailwind scan the shipped components). Set
`data-theme` on an ancestor. Icons are props; this package has no icon
dependency. Every control works with the keyboard alone and at 375 px.

`cn()` joins class values and resolves Tailwind conflicts with the last one
winning; every component merges its `class` prop through it, so a caller's
class overrides the component's own utilities:

```ts
import { cn } from '@codecora/ui';

cn('rounded-md px-4', active && 'bg-accent', className); // className overrides
```

Touch targets are 44 px tall in the comfortable density and 32 px in the compact
density (above the WCAG 2.2 minimum of 24 px, below the 44 px recommendation), so
use comfortable on touch-first screens.
