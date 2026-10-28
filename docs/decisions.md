# Decisions

Locked by the maintainers on 2026-10-27 unless noted. Changing one needs
an explicit maintainer decision recorded here.

| # | Decision | Why |
|---|---|---|
| D1 | One general library, `codecora-ui`, not a Uteke-only core | 11 Svelte 5 apps in the fleet each rebuild Button, Input, Dialog, Badge, Toast, EmptyState; one fix should reach all of them |
| D2 | License **Apache-2.0**, public repo | Usable by private products (Uteke Cloud) and open-source ones (Corin, Uteke) alike; patent grant |
| D3 | **GitHub is the primary forge** (`codecoradev/codecora-ui`), read-only mirror on the team's internal forge | Free Actions for public repos, npm trusted publishing with provenance (GitHub Actions or GitLab only), community visibility |
| D4 | Publish to **npmjs.com** under `@codecora/*` | Installs without tokens in every app and CI, including Tauri builds; the scope must be claimed first |
| D5 | Headless foundation = **bits-ui** | Accessible primitives, already used by gaira and titen through shadcn-svelte |
| D6 | **Two distribution channels**: npm packages for primitives that must behave the same everywhere; a **shadcn-svelte registry** for blocks and templates that apps customise | Central fixes where consistency matters, ownership where products differ |
| D7 | Components are **plain CSS on semantic tokens**; Tailwind 4 is optional (preset + shadcn variable bridge) | Uteke Cloud has no Tailwind; Tailwind apps still integrate |
| D8 | **One system, many themes**, mixable per element (`data-theme`, `data-density`, `data-accent`) | Each product keeps its identity (accent, fonts, radius) on shared structure and accessibility |
| D9 | Icons: **Lucide default** (`@lucide/svelte`), **Phosphor optional**; components take any Svelte icon component; internal icons are small inline SVGs; stroke and size come from `--cc-icon-*` | No hard icon dependency in `@codecora/ui`; Lucide matches shadcn and four fleet apps |
| D10 | Corin is a **reference only**; the library sets a new standard | Corin's UI predates current Uteke; extract ideas, not code wholesale |
| D11 | `@codecora/ui` knows nothing about Uteke; Uteke lives in `@codecora/memory`; Uteke Cloud-only UI (billing, admin, quotas) never enters this repo | Keeps the general library general and the private product private |
| D12 | Design process uses **impeccable** (`init`, `extract`, `document`, `critique`, `audit`, `polish`) with its detector hook in CI | Same design quality gate across products |

## Open

- Internal mirror: read-only pull mirror of this repo (maintainer action).
- npm: claim the `@codecora` organisation on npmjs.com and enable trusted publishing for the repo.
- Registry host for shadcn blocks (for example `ui.codecora.dev/r/*.json`, served from the playground build).
