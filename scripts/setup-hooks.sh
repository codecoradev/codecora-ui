#!/usr/bin/env bash
# Activate the repo-committed git hooks (scripts/hooks). Safe to run again.
set -euo pipefail
root=$(git rev-parse --show-toplevel)
chmod +x "$root"/scripts/hooks/* "$root"/scripts/*.sh
git -C "$root" config core.hooksPath scripts/hooks
echo "hooks active: $(git -C "$root" config core.hooksPath)"
