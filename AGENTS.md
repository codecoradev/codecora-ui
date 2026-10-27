# AGENTS.md — CodeCora UI

Shared design tokens, themes and Svelte 5 components for CodeCora products.
Read [docs/decisions.md](docs/decisions.md) (locked decisions),
[docs/architecture.md](docs/architecture.md) and
[docs/roadmap.md](docs/roadmap.md) before changing anything.

## Rules

- Forge: GitHub `codecoradev/codecora-ui` is primary; Gitea is a mirror.
- Default branch `develop`; `main` = released. All changes through PRs; no
  direct or force pushes.
- Issues, PRs and commit messages in English. No AI attribution in commits or
  PRs (no `Co-Authored-By: Claude`, no "Generated with" lines).
- PR body: `## What` / `## Why` / `## Testing`; one logical change per PR.
- Release versions are proposed by the agent and approved by the owner before
  publishing.
- `@codecora/ui` never imports an icon set or anything Uteke-specific; Uteke
  code goes to `@codecora/memory`; Uteke Cloud-only UI never enters this repo.
- Components read semantic tokens only; no raw colour literals outside the
  token package.
- Every theme passes WCAG AA; every component works with keyboard only and at
  375 px.

## Memory (Uteke)

Room `codecora-ui` (namespace `default`, tags `project:codecora-ui`); the
decision log lives in the Uteke doc tree `codecora-ui`.
