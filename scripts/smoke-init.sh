#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

cd "$repo_root"
pnpm build >/dev/null

cd "$tmp_dir"
node "$repo_root/dist/index.js" init oss-cli smoke-app --dry-run > dry-run.json
if [ -e smoke-app ]; then
  echo "dry-run created files" >&2
  exit 1
fi

node "$repo_root/dist/index.js" init oss-cli smoke-app --var AUTHOR_NAME="Smoke Tester" > init.json
test -f smoke-app/README.md
test -f smoke-app/package.json
grep -q "# smoke-app" smoke-app/README.md
grep -q "Smoke Tester" smoke-app/package.json
node "$repo_root/dist/index.js" init oss-cli smoke-app --dry-run > dry-run-existing.json

if node "$repo_root/dist/index.js" init oss-cli smoke-app > overwrite.json 2> overwrite.err; then
  echo "init overwrote without --force" >&2
  exit 1
fi
grep -q "Refusing to overwrite" overwrite.err

node "$repo_root/dist/index.js" init oss-cli smoke-app --force > force.json
node "$repo_root/dist/index.js" init python-api py-api > py.json
test -f py-api/src/py_api/main.py
node "$repo_root/dist/index.js" init next-app web-app > next.json
test -f web-app/src/app/page.tsx

echo "smoke-init ok"
