# Changesets

Every PR that changes a published `@codecora/*` package adds a changeset:

```bash
bun run changeset
```

Pick the packages, the bump (0.x: minor = features, patch = fixes) and a one-line
summary for the package changelog. Maintainers decide the release; see AGENTS.md.
