# @codecora/icons

The icon contract for CodeCora products, built on semantic tokens from
[`@codecora/tokens`](../tokens). `@codecora/ui` never imports an icon set; apps
pass icon components to it, and this package makes them follow the theme.

- **`Icon`**: wraps any Svelte icon component and sets its size and stroke from
  `--cc-icon-size` and `--cc-icon-stroke`, so a theme can change icon weight.
  Decorative by default (`aria-hidden`); pass `label` for a meaningful icon.
- **`@codecora/icons/lucide`**: a curated set of [Lucide](https://lucide.dev)
  icons (`@lucide/svelte`, the recommended default). Any other Lucide icon works
  with `Icon` through `@lucide/svelte/icons/<name>`.
- **`@codecora/icons/phosphor`**: an adapter for [Phosphor](https://phosphoricons.com)
  (`phosphor-svelte`): `PhosphorIcon` and `weightForStroke`, which maps the theme
  stroke to a Phosphor weight.

```svelte
<script>
  import { Icon } from '@codecora/icons';
  import { Plus, Trash } from '@codecora/icons/lucide';
  import { Button } from '@codecora/ui';
</script>

<Button icon={Plus}>Create key</Button>
<Icon icon={Trash} label="Delete" />
```

`@lucide/svelte` and `phosphor-svelte` are optional peers: install the one you
use.
