#!/usr/bin/env bash
# Activate the repo-committed git hooks (scripts/hooks). Safe to run again.
set -euo pipefail
# Runs from `bun install` (prepare): outside a git checkout (source tarball,
# Docker context without .git) there are no hooks to activate.
if ! root=$(git rev-parse --show-toplevel 2>/dev/null); then
  echo "hooks skipped: not a git checkout"
  exit 0
fi
chmod +x "$root"/scripts/hooks/* "$root"/scripts/*.sh
git -C "$root" config core.hooksPath scripts/hooks
echo "hooks active: $(git -C "$root" config core.hooksPath)"
