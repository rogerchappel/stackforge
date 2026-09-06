#!/usr/bin/env bash
set -euo pipefail

minimum="3.11"

is_supported() {
  "$1" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' >/dev/null 2>&1
}

if [ -n "${STACKFORGE_PYTHON:-}" ]; then
  if ! command -v "$STACKFORGE_PYTHON" >/dev/null 2>&1; then
    echo "StackForge: STACKFORGE_PYTHON '$STACKFORGE_PYTHON' was not found; set it to a Python >= $minimum interpreter." >&2
    exit 1
  fi
  candidate="$(command -v "$STACKFORGE_PYTHON")"
  if ! is_supported "$candidate"; then
    echo "StackForge: STACKFORGE_PYTHON '$STACKFORGE_PYTHON' must be Python >= $minimum." >&2
    exit 1
  fi
  printf '%s\n' "$candidate"
  exit 0
fi

for name in python3.13 python3.12 python3.11 python3; do
  if command -v "$name" >/dev/null 2>&1; then
    candidate="$(command -v "$name")"
    if is_supported "$candidate"; then
      printf '%s\n' "$candidate"
      exit 0
    fi
  fi
done

echo "StackForge: Python >= $minimum is required for the python-api smoke test. Install it or set STACKFORGE_PYTHON to a compatible interpreter." >&2
exit 1
