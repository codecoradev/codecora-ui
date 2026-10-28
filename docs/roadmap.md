# Roadmap

| Milestone | Scope | Done when |
|---|---|---|
| **M0 Foundation** | Repo, bun workspaces, svelte-package, CI (check, test, build, contrast), changesets, npm trusted publishing; `@codecora/tokens` with `neutral`, `uteke`, `corin`; impeccable `init` (PRODUCT.md) and `extract` from uteke-cloud/web and Corin; playground skeleton | Tokens published as `0.1.0`; playground shows the three themes |
| **M1 Primitives** | `@codecora/ui` first set (see architecture.md), `@codecora/icons` with Lucide default, AppShell + Sidebar | Each component passes impeccable critique and audit in all themes at desktop and 375 px |
| **M2 Memory** | `@codecora/memory`: client, transports (uteke-serve, Uteke Cloud), capabilities, MemoryList, MemoryDetail, MemoryEditor; Uteke Cloud adds a session-scoped data route | A memory browser runs against uteke-serve and Uteke Cloud |
| **M3 Uteke Cloud portal** | Portal moves to AppShell + Sidebar and gains the Memories page, with the portal consistency fixes | Released in Uteke Cloud |
| **M4 Adoption** | Corin moves onto the packages; shadcn bridge for titen and gaira; registry blocks; other apps adopt when they touch UI | Two or more products beyond Uteke Cloud on the packages |

## Issues

| Milestone | Issues |
|---|---|
| M0 Foundation | #1 tooling, #2 CI and npm publishing, #3 tokens, #4 impeccable, #5 playground |
| M1 Primitives | #6 primitives, #7 AppShell + Sidebar, #8 icons, #9 brand |
| M2 Memory | #10 client and transports, #11 memory browser components |
| M3 Uteke Cloud portal | #12 (implementation tracked in the Uteke Cloud project) |
| M4 Adoption | #13 Corin, #14 shadcn registry and bridge |
| Owner | #15 npm scope and internal mirror |
