# Architecture

## Fleet survey (2026-10-27)

Eleven Svelte 5 apps, each with its own UI:

| App | UI today | Themes |
|---|---|---|
| titen, gaira | shadcn-svelte (bits-ui + Tailwind 4), copied per repo | 1 |
| corin | own components in `src/lib/ui` (with tests), Tailwind 4, lucide-svelte | dark + light |
| uteke-cloud | own CSS and tokens, no Tailwind | 1 |
| tagfold, plotweft, waca, metobuz, vetio, tenun, drawover | local CSS, different fonts | 1 |

## Layers

```
codecora-ui/                    bun workspaces
  packages/tokens   @codecora/tokens
  packages/ui       @codecora/ui
  packages/icons    @codecora/icons
  packages/brand    @codecora/brand
  packages/memory   @codecora/memory
  registry/         shadcn-svelte registry items (blocks, templates)
  apps/playground   SvelteKit catalogue, all themes, visual checks
```

Dependencies only point down: `memory -> ui -> tokens`; `ui` takes icons as
props and never imports an icon set.

### Tokens

Three tiers:

1. **Primitive**: colour scales, spacing scale, radius, type scale, motion.
2. **Semantic**: `--cc-surface`, `--cc-surface-raised`, `--cc-text`,
   `--cc-text-muted`, `--cc-border`, `--cc-accent`, `--cc-accent-text`,
   `--cc-danger`, `--cc-success`, `--cc-warning`, `--cc-focus`,
   `--cc-radius-*`, `--cc-font-*`, `--cc-icon-stroke`, `--cc-icon-size`, ...
3. **Theme**: a mapping of semantic tokens. First themes: `neutral`, `uteke`
   (editorial light, from uteke.app), `corin` (editor dark, from Corin's
   DESIGN.md). Modifiers: `data-density="compact|comfortable"`,
   `data-accent="<name>"`.

Outputs: CSS (`tokens.css`, one file per theme), TypeScript constants,
a Tailwind 4 `@theme` preset, and a shadcn bridge that maps `--background`,
`--foreground`, `--primary`, ... onto `--cc-*` so existing shadcn components
follow CodeCora themes.

Every theme must pass WCAG AA contrast for text and UI pairs (checked in CI).

### Components (`@codecora/ui`)

- Built on bits-ui; styled with plain CSS reading semantic tokens only.
- Svelte 5 runes, `svelte ^5.25` peer, no `$app/*` imports (works in
  SvelteKit 2, SvelteKit 3 and Vite SPAs such as Corin).
- Packaged with `svelte-package`: `.svelte` sources ship and compile in the
  consuming app.
- A component enters the package when at least two products need it;
  product-specific variants go to the registry instead.

First set (M1): AppShell + Sidebar (desktop sidebar, mobile drawer and bottom
bar), Button, IconButton, Field + Input + Textarea, Select, Dialog +
ConfirmDialog, Sheet, Tabs, Table, Badge, Toast, Tooltip, EmptyState,
Skeleton, Spinner.

### Icons (`@codecora/icons`)

- Default set Lucide (`@lucide/svelte`, ISC), optional Phosphor.
- Components accept `icon={Component}`; internal glyphs (close, chevron,
  check, spinner) are inline SVG so `@codecora/ui` has no icon dependency.
- Stroke width and size come from `--cc-icon-stroke` / `--cc-icon-size`, so a
  theme can change icon weight.

### Uteke domain (`@codecora/memory`)

- Types, `MemoryClient` (list, get, remember, update, forget, recall, search,
  documents, rooms, tags, stats, export, import) and `Capabilities`.
- Transports: Tauri (`invoke`), uteke-serve (URL + optional key), Uteke Cloud
  (portal session or API key). The pattern exists in Corin's
  `src/lib/ts/transport.ts`.
- Capabilities hide what a backend lacks (Uteke Cloud: no graph, lifecycle,
  dream; namespaces deprecated).
- Uteke Cloud note: the portal session cookie is scoped to `/api/v2/portal`,
  so the cloud transport for the browser needs a portal-scoped data route
  (proposed `/api/v2/portal/data/*` over the internal data router), a contract
  change in uteke-cloud.

## Distribution

- npmjs.com `@codecora/*`, published from GitHub Actions with provenance,
  versioned with changesets (semver per package).
- shadcn-svelte registry JSON served with the playground build.
- Gitea pull mirror for the fleet.

## Quality gates (CI)

`svelte-check`, unit tests (vitest), contrast check per theme, impeccable
detector, build of every package and the playground, visual snapshots of the
playground in every theme at desktop and 375 px.
