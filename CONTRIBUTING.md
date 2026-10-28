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

Available from milestone M0 (tooling, issue #1):

```bash
bun install --frozen-lockfile
bun run check
bun run test
bun run build
```

Every component must work with the keyboard alone, at 375 px width, and in
every theme with WCAG AA contrast.

## Code of conduct and security

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License

Contributions are licensed under the [Apache License 2.0](LICENSE), the
license of this repository.
