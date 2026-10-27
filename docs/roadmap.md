# Roadmap

| Milestone | Scope | Done when |
|---|---|---|
| **M0 Foundation** | Repo, bun workspaces, svelte-package, CI (check, test, build, contrast), changesets, npm trusted publishing; `@codecora/tokens` with `neutral`, `uteke`, `corin`; impeccable `init` (PRODUCT.md) and `extract` from uteke-cloud/web and Corin; playground skeleton | Tokens published as `0.1.0`; playground shows the three themes |
| **M1 Primitives** | `@codecora/ui` first set (see architecture.md), `@codecora/icons` with Lucide default, AppShell + Sidebar | Each component passes impeccable critique and audit in all themes at desktop and 375 px |
| **M2 Memory** | `@codecora/memory`: client, transports (uteke-serve, Uteke Cloud), capabilities, MemoryList, MemoryDetail, MemoryEditor; uteke-cloud adds the portal data route (contract change there) | A memory browser runs against uteke-serve and Uteke Cloud |
| **M3 Uteke Cloud portal** | Portal moves to AppShell + Sidebar and gains the Memories page; folds in uteke-cloud #289 | Released in uteke-cloud |
| **M4 Adoption** | Corin moves onto the packages; shadcn bridge for titen and gaira; registry blocks; other apps adopt when they touch UI | Two or more products beyond Uteke Cloud on the packages |
