# AGENTS.md — codecora-ui

Working conventions for everyone working in this repo: shared design tokens,
themes and Svelte 5 components for CodeCora products.

Read before changing anything:
[docs/decisions.md](docs/decisions.md) (locked decisions D1–D12),
[docs/architecture.md](docs/architecture.md) and
[docs/roadmap.md](docs/roadmap.md) (milestones M0–M4, issue map).

## Repo layout

Planned (M0, issue #1); only `docs/`, `scripts/` and `.github/` exist today.

- `packages/tokens` — `@codecora/tokens`: primitive, semantic and theme tokens; CSS, TS, Tailwind 4 preset, shadcn bridge
- `packages/ui` — `@codecora/ui`: Svelte 5 components on bits-ui, plain CSS on semantic tokens
- `packages/icons` — `@codecora/icons`: icon contract, Lucide default, Phosphor adapter
- `packages/brand` — `@codecora/brand`: product marks and favicon sets
- `packages/memory` — `@codecora/memory`: Uteke domain layer (client, transports, capabilities, memory components)
- `registry/` — shadcn-svelte registry items (blocks, templates)
- `apps/playground` — SvelteKit catalogue of every component in every theme
- `scripts/` — `hooks/` (pre-commit, commit-msg), `setup-hooks.sh`, `message-standard.sh`
- `.github/` — PR template, issue forms, workflows (`pr-checks.yml`: branch naming, PR description, Conventional Commits title, message standard; `cora-review.yml`: automated review)

Boundaries that reviews enforce:

- Dependencies point down only: `memory -> ui -> tokens`. `@codecora/ui` never imports an icon set or anything product-specific.
- Product-only UI (billing, admin, quotas of any one product) never enters this repo.
- Components read semantic `--cc-*` tokens only; raw colour literals live in `packages/tokens` and nowhere else.
- Svelte 5 runes, `svelte ^5.25` peer, no `$app/*` imports: packages must work in SvelteKit 2, SvelteKit 3 and plain Vite apps.
- Every theme passes WCAG AA; every component works with the keyboard alone and at 375 px.

## Session start (continuity ritual)

- New session, before any work (code, review, PR, docs): read and understand the team knowledge rooms; they override tool defaults. Then recall this project's room.
- Save every decision or important outcome back to the responsible room during or at the end of the session (one fact per entry, no tokens or credentials).
- Handing over mid-task: leave a `[HANDOFF]` entry (state, next step, blockers).
- Repo files are canonical over mirrors in the rooms: if they disagree, fix the file, then update the mirror.

## Workflow summary

Issue → branch from `develop` → code + pre-commit checks → push → PR to `develop`
(`## What` / `## Why` / `## Testing`, English) → CI green + review verdict →
merge → cleanup → release (bump + CHANGELOG + tag). 1 issue = 1 branch = 1 PR.

## Branch and merge discipline

- `develop` is the default and integration branch; `main` holds releases only and is filled by a release PR `develop` → `main` (merge commit, not squash). Both are protected: no direct or force pushes.
- Branch names `<type>/<issue>-<slug>` (for example `fix/42-dialog-focus`); the PR check enforces the prefix: `feat`, `fix`, `docs`, `chore`, `perf`, `security`, `refactor`, `test`, `build`, `ci`, `release`.
- Commits and PR titles follow Conventional Commits (`feat(ui): add Dialog`); the PR title becomes the squash commit. Commit messages and PR title/body must pass the message standard: `scripts/hooks/commit-msg` runs locally and CI re-checks the PR.
- PR body uses exactly `## What` / `## Why` / `## Testing`; one logical change per PR, issue first for anything larger.
- **The review verdict is the result, not a green check.** Before merging: all checks green, the review comment for the same head commit reports no blocking findings (a review that did not complete is not a pass), PR comments read, branch up to date.
- Squash merge to `develop` (message = PR title + body), delete the branch, close the issue, sync `develop`.
- External contributions: bug fixes are welcome; changes to direction (new packages, decisions D1–D12) need maintainer agreement in an issue first.

## Before committing — mandatory checks

1. **Activate the hooks once per clone:** `bash scripts/setup-hooks.sh` (sets `core.hooksPath=scripts/hooks`; from M0 on `bun install` does it through `prepare`).
2. **Review every commit** before it is made: run the agent review flow on `git diff --staged` (prepare, answer, finalize at severity `major`), or `cora review --staged --ci --severity major` by hand. Major or critical findings block the commit. A tool error or a missing verdict is not a pass: retry, or review file by file. Quote the verdict in the PR `## Testing`.
3. Never `git commit --no-verify` past a finding (emergency only, and say why in the PR). False positives get fixed by rewording or restructuring, not by bypassing.
4. **Local gates** (mirror of CI, from M0 on): `bun install --frozen-lockfile`, `bun run check`, `bun run test`, `bun run build`, contrast check for every theme.

## Tooling

- `cora` (CLI or MCP): code index and review; prefer `cora brain search` over blind grep for symbol and caller queries. Its local state lives in `.cora/` (gitignored).
- Design work uses the impeccable workflow (D12): `init`, `extract`, `document`, `critique`, `audit`, `polish`; its detector runs in CI from M0.
- Never print credentials (headers, env files); compare keys by fingerprint, not value.

## Releases

- Per-package SemVer through changesets, published to npmjs.com under `@codecora/*` from GitHub Actions with provenance (#2). 0.x until the API settles: minor = features, patch = fixes. `CHANGELOG.md` at the root summarises each release.
- Never pick a version yourself: propose minor or patch with the reason and wait for a maintainer before publishing or tagging.
- After each batch of merged work: remove leftover worktrees and branches, then propose the version increment.
