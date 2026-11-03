# CodeCora shadcn-svelte registry

Blocks and a theme bridge for apps that use [shadcn-svelte](https://shadcn-svelte.com)
(titen, gaira and any app with a `components.json`). Decision D6: primitives
ship as npm packages, blocks ship here and are copied into the app, which owns
and changes them.

| Item | Type | What it adds |
|---|---|---|
| `cc-theme` | theme | `@codecora/tokens`, its CSS imports, and every shadcn variable in `:root` and `.dark` rewritten to read a `--cc-*` token |
| `cc-login` | block | `login-form.svelte`: sign-in card with validation, progress and an error alert |
| `cc-settings` | block | `settings-page.svelte`: profile, notifications and danger-zone tabs, save and delete confirm |
| `cc-dashboard-shell` | block | `dashboard-shell.svelte`: AppShell sidebar (drawer and bottom bar on phones) and a page header |
| `cc-console-overview` | block | `console-overview.svelte`: console frame with a user menu, a breadcrumb and search header, a title row, tabs and a page body |
| `cc-resource-detail` | block | `resource-detail.svelte`: back link, header with a split primary button, grouped list with row menus, segmented tool list with search and a callout |
| `cc-data-table` | block | `data-table.svelte`: search, status filter, sorting, selection with a bulk action, paging |

Every block depends on `@codecora/ui` and installs `cc-theme` first. Blocks use
plain CSS on `--cc-*` tokens, so they need no Tailwind classes; the dashboard
shell and data table also import `@lucide/svelte` icons.

## Install

The playground build serves the registry at `/r/<item>.json`:

```bash
npx shadcn-svelte@latest add https://<playground-host>/r/cc-theme.json
npx shadcn-svelte@latest add https://<playground-host>/r/cc-login.json
```

Files land in your `components` alias (`$lib/components/login-form.svelte`).
Import them like any other component:

```svelte
<script lang="ts">
  import LoginForm from '$lib/components/login-form.svelte';
</script>

<main data-theme="uteke">
  <LoginForm onsubmit={signIn} />
</main>
```

Until `@codecora/*` is on npm (#15), the CLI cannot install the packages
itself. Install the release tarballs first (see the root README), then add
items with `--no-deps-install`; ranges in the items (`^0.4.0`) leave the
tarball entries in `package.json` alone.

## The theme bridge

`cc-theme` changes your global CSS (the `tailwind.css` path in
`components.json`):

```css
@import '@codecora/tokens/tokens.css';
@import '@codecora/tokens/shadcn.css';

:root,
.dark {
  --background: var(--cc-surface);
  --primary: var(--cc-accent);
  --ring: var(--cc-focus);
  /* ... the full map is `shadcnBridge` in @codecora/tokens */
}
```

After that, shadcn components follow `data-theme`, `data-accent` and
`data-density` on any element. `shadcn.css` re-declares the variables on every
`[data-theme]` and `[data-accent]` element, so a nested region (a dark sidebar,
a preview card) repaints too. Dark themes such as `corin` and `neutral-dark`
bring their own colours; shadcn's `dark:` utilities still follow the `.dark`
class, so add it next to a dark `data-theme`.

## Develop

```bash
bun run build   # build.ts, then shadcn-svelte registry build -> dist/r/*.json
bun run check   # svelte-check on the blocks
bun run test    # registry.json shape and the generated cc-theme item
```

`registry.json` lists the items. The build reads each block's imports to fill
in `dependencies` (workspace versions become `^x.y.z` ranges). The theme item
has no files to read, so `build.ts` fills it in first (`theme.ts`): the light
and dark variables from `shadcnBridge` and the `@codecora/tokens` range from
the tokens package version. A tokens release therefore needs no edit here. The
playground serves `dist/r` through a prerendered `/r/[item].json` route, so the
root `bun run build` builds this workspace before the apps.
