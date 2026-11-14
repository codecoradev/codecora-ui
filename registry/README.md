# CodeCora shadcn-svelte registry

Blocks and a theme bridge for apps that use [shadcn-svelte](https://shadcn-svelte.com)
(titen, gaira and any app with a `components.json`). Decision D6: primitives
ship as npm packages, blocks ship here and are copied into the app, which owns
and changes them.

| Item | Type | What it adds |
|---|---|---|
| `cc-theme` | theme | `@codecora/tokens` and `@codecora/ui`, their Tailwind 4 imports, and shadcn's own colour variables in `:root` and `.dark` handed back to the theme |
| `cc-login` | block | `login-form.svelte`: sign-in card with validation, progress and an error alert |
| `cc-settings` | block | `settings-page.svelte`: profile, notifications and danger-zone tabs, save and delete confirm |
| `cc-dashboard-shell` | block | `dashboard-shell.svelte`: AppShell sidebar (drawer and bottom bar on phones) and a page header |
| `cc-console-overview` | block | `console-overview.svelte`: console frame with a user menu, a breadcrumb and search header, a title row, tabs and a page body |
| `cc-resource-detail` | block | `resource-detail.svelte`: back link, header with a split primary button, grouped list with row menus, segmented tool list with search and a callout |
| `cc-status-panel` | block | `status-panel.svelte`: status card with a tinted icon, an action, a stat strip and a why / what-to-do panel |
| `cc-data-table` | block | `data-table.svelte`: search, status filter, sorting, selection with a bulk action, paging |

Every block depends on `@codecora/ui` and installs `cc-theme` first. Blocks are
written with Tailwind 4 utilities on the theme roles (`bg-card`,
`text-muted-foreground`, `border-border`, `rounded-md`, ...) and merge classes
with `cn` from `@codecora/ui`, so your app needs Tailwind 4 and the `cc-theme`
setup below (D13). Most blocks also import `@lucide/svelte` icons.

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

## The theme

`cc-theme` changes your global CSS (the `tailwind.css` path in
`components.json`). It adds two imports after `tailwindcss`:

```css
@import 'tailwindcss';
@import '@codecora/tokens/theme.css'; /* every theme, the shadcn variables, Tailwind keys */
@import '@codecora/ui/source.css'; /* Tailwind scans the components the blocks use */
```

`theme.css` declares every shadcn variable (`--background`, `--primary`,
`--ring`, the chart and sidebar variables, plus `--primary-hover`,
`--success`, `--warning` and the other roles the blocks use) on each theme, in
Tailwind's base layer. The values shadcn wrote into your `:root` and `.dark` blocks have
no layer, so they would win; the shadcn CLI can set those variables but not
delete them, so the item sets each one to `revert-layer`, which hands it back
to `theme.css`:

```css
:root {
  --background: revert-layer;
  --primary: revert-layer;
  /* ... every variable theme.css declares, in .dark too */
}
```

It also writes the theme's radius and font keys (`--radius-sm|md|lg`,
`--font-sans|display|mono`) into your `@theme inline` block, which comes after
the imports and would otherwise keep shadcn's values: each key reads the
variable of the same name the themes declare (`--radius-md: var(--radius-md)`). The CLI adds a
`--name: var(--name)` line there for each variable as well; those lines do
nothing and can go. You can also delete the `:root` and `.dark` blocks
altogether.

Those `--radius-md: var(--radius-md)` lines resolve in the page, where
`theme.css` declares the variable on `:root` and every `[data-theme]`. Inside a
shadow root (a web component that loads the app's CSS itself), nothing
declares them on `:host`, so `rounded-md` and `font-mono` fall back to
nothing there: delete those lines from `@theme inline` if you render
components in a shadow root.

After that, shadcn components and the blocks follow `data-theme`,
`data-accent` and `data-density` on any element, nested regions (a dark
sidebar, a preview card) included. shadcn's
`@custom-variant dark (&:is(.dark *));` line keeps `dark:` on the `.dark`
class; delete it and `dark:` follows the dark themes (`corin`,
`neutral-dark`, ...) as well, since `theme.css` declares that variant.

Coming from the earlier plain-CSS bridge? `@codecora/tokens/tokens.css` and
`@codecora/tokens/shadcn.css` no longer exist: remove their imports, since
`theme.css` replaces both, and rename any `--cc-*` overrides in your CSS with
the migration table in the [tokens README](../packages/tokens/README.md).

## Develop

```bash
bun run build   # build.ts, then shadcn-svelte registry build -> dist/r/*.json
bun run check   # svelte-check on the blocks
bun run test    # registry.json shape and the generated cc-theme item
```

`registry.json` lists the items. The build reads each block's imports to fill
in `dependencies` (workspace versions become `^x.y.z` ranges). The theme item
has no files to read, so `build.ts` fills it in first (`theme.ts`): the light
and dark variables from `themeVariables` (every colour name and `--radius`),
the radius and font keys from `tailwindKeys`
and the `@codecora/tokens` and `@codecora/ui` ranges from the package
versions. A release therefore needs no edit here. The
playground serves `dist/r` through a prerendered `/r/[item].json` route, so the
root `bun run build` builds this workspace before the apps.
