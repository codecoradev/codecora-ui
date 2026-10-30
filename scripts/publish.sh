#!/usr/bin/env bash
# Publishes every public @codecora/* package whose version is not on npm yet.
#
#   bash scripts/publish.sh --dry-run   pack and run `npm publish --dry-run`
#   bash scripts/publish.sh             publish with provenance and tag
#
# Packages are packed with `bun pm pack`, which rewrites `workspace:*`
# dependencies to real versions; npm then publishes the tarball, so trusted
# publishing (OIDC) and provenance work. Versions come from changesets
# (`bun run version-packages`); 0.0.0 means "never versioned" and is skipped.
set -euo pipefail

dry_run=false
case "${1:-}" in
  --dry-run) dry_run=true ;;
  "") ;;
  *) echo "usage: $0 [--dry-run]" >&2; exit 2 ;;
esac

root=$(cd "$(dirname "$0")/.." && pwd)
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
published=0

# Tag <name>@<version> and push it at once, so a later failure cannot lose
# it; a rerun also backfills tags for versions that reached npm before.
tag_release() {
  local tag="$1"
  if [ -n "$(git -C "$root" ls-remote --tags origin "refs/tags/$tag")" ]; then return; fi
  git -C "$root" rev-parse -q --verify "refs/tags/$tag" >/dev/null || git -C "$root" tag "$tag"
  git -C "$root" push origin "refs/tags/$tag"
}

for manifest in "$root"/packages/*/package.json; do
  dir=$(dirname "$manifest")
  read -r name version private < <(node -e '
    const p = require(process.argv[1]);
    console.log(p.name, p.version, p.private === true);
  ' "$manifest")

  if [ "$private" = "true" ]; then continue; fi
  if [ "$version" = "0.0.0" ]; then
    echo "skip $name: not versioned yet (0.0.0)"
    continue
  fi
  # Compare the output, not only the exit code: some npm versions exit 0 with
  # empty output for a version that does not exist.
  if [ "$(npm view "$name@$version" version 2>/dev/null)" = "$version" ]; then
    echo "skip $name@$version: already on npm"
    if [ "$dry_run" = false ]; then tag_release "$name@$version"; fi
    continue
  fi

  # bun's own pack flags (`bun pm pack --help`): --destination, --quiet.
  tarball=$(cd "$dir" && bun pm pack --quiet --destination "$out")
  tarball="$out/$(basename "$tarball")"
  if [ ! -f "$tarball" ]; then
    echo "pack failed for $name@$version: no tarball at $tarball" >&2
    exit 1
  fi

  if [ "$dry_run" = true ]; then
    echo "dry run $name@$version"
    npm publish "$tarball" --dry-run --access public
  else
    echo "publish $name@$version"
    npm publish "$tarball" --access public --provenance
    tag_release "$name@$version"
    published=$((published + 1))
  fi
done

echo "done: $published published"
