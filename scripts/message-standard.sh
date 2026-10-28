#!/usr/bin/env bash
# Message standard check for commit messages and PR title/body (team standard).
# Usage: message-standard.sh <file>   or   message-standard.sh -   (stdin)
# Used by scripts/hooks/commit-msg and by the PR checks workflow.
# Shape-based: it looks for trailers and footers that must not appear.
# Exit 0 = fine, 1 = rejected.
set -uo pipefail

src="${1:--}"
if [ "$src" = "-" ]; then text=$(cat); else text=$(cat "$src" 2>/dev/null || true); fi

# git comment lines are not part of the message
body=$(printf '%s\n' "$text" | grep -v '^#' || true)

if printf '%s\n' "$body" | grep -Eiq '^[[:space:]]*co-authored-by:|generated with[[:space:]]+\[|🤖'; then
  echo "message-standard: trailer or footer not allowed (see team message standard)" >&2
  exit 1
fi
exit 0
