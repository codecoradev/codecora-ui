# Contributing to CodeCora UI

Thanks for your interest. This repo holds shared design tokens, themes and
Svelte 5 components for CodeCora products. Read
[docs/decisions.md](docs/decisions.md) first: changes that go against a locked
decision need an issue and maintainer agreement before code.

## What we accept

- Bug fixes, accessibility fixes, documentation fixes: open a PR (an issue first is welcome).
- New components, packages, themes or API changes: open an issue first and describe the use case. A component enters `@codecora/ui` only when at least two products need it.

## Workflow

1. Open or pick an issue.
2. Branch from `develop`: `<type>/<issue>-<slug>` (for example `fix/42-dialog-focus`), type one of `feat`, `fix`, `docs`, `chore`, `perf`, `security`, `refactor`, `test`, `build`, `ci`, `release`.
3. Activate the hooks once: `bash scripts/setup-hooks.sh`.
4. Make one logical change. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat(ui): add Tooltip`).
5. Run the local checks (see below), push, and open a PR to `develop` using the template (`## What` / `## Why` / `## Testing`, in English).
6. CI and the automated review must pass; maintainers review and squash-merge.

## Local checks

Requires [bun](https://bun.sh) 1.4+ and Node 22.17+ (SvelteKit 3).

```bash
bun install --frozen-lockfile   # also activates the git hooks
bun run check                   # builds the packages, then svelte-check everywhere
bun run test                    # vitest
bun run build                   # packages (svelte-package + publint), then the playground
bun run lint                    # prettier --check and eslint (bun run format fixes formatting)
```

A change to a published `@codecora/*` package needs a changeset: `bun run changeset`.

Every component must work with the keyboard alone, at 375 px width, and in
every theme with WCAG AA contrast.

## Code of conduct and security

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License

Contributions are licensed under the [Apache License 2.0](LICENSE), the
license of this repository.
