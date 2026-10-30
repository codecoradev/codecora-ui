# @codecora/ui

Svelte 5 components for CodeCora products, built on [bits-ui](https://bits-ui.com)
and styled with plain CSS on semantic `--cc-*` tokens. See the
[repository README](../../README.md) and [docs/architecture.md](../../docs/architecture.md).

> Status: pre-release. First primitive set (M1): Button, IconButton, Field,
> Input, Textarea, Select, Dialog, ConfirmDialog, Sheet, Tabs, Table, Badge,
> Toaster (`toast`), Tooltip, EmptyState, Skeleton, Spinner, plus AppShell and
> Sidebar.

```svelte
<script>
  import '@codecora/tokens/tokens.css';
  import { Button, Field, Input } from '@codecora/ui';
  import Plus from '@lucide/svelte/icons/plus'; // any icon component works
</script>

<Button variant="primary" icon={Plus}>Create key</Button>
```

Components read `--cc-*` tokens, so load `@codecora/tokens/tokens.css` and set
`data-theme` on an ancestor. Icons are props; this package has no icon
dependency. Every control works with the keyboard alone and at 375 px.

Touch targets are 44 px tall in the comfortable density and 32 px in the compact
density (above the WCAG 2.2 minimum of 24 px, below the 44 px recommendation), so
use comfortable on touch-first screens.
