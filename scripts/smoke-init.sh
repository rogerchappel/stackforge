#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

cd "$repo_root"
pnpm build >/dev/null

cd "$tmp_dir"
cat <<'EOF' > local-prd.md
# Local PRD

This is a copied PRD.
EOF
cat <<'EOF' > local-tasks.md
# Local Tasks

- [ ] Ship it
EOF

node "$repo_root/dist/index.js" init oss-cli smoke-app --dry-run --prd local-prd.md --tasks local-tasks.md > dry-run.json
if [ -e smoke-app ]; then
  echo "dry-run created files" >&2
  exit 1
fi
grep -q 'docs/PRD.md' dry-run.json
grep -q 'docs/TASKS.md' dry-run.json

taskbrief_bin="$tmp_dir/taskbrief"
cat <<'EOF' > "$taskbrief_bin"
#!/usr/bin/env bash
set -euo pipefail
input=""
output=""
workspace=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    parse)
      shift
      input="$1"
      ;;
    --format)
      shift
      format="$1"
      [ "$format" = "markdown" ] || exit 41
      ;;
    --output)
      shift
      output="$1"
      ;;
    --workspace)
      shift
      workspace="$1"
      ;;
  esac
  shift
done
[ -n "$input" ] || exit 42
[ -n "$output" ] || exit 43
mkdir -p "$(dirname "$output")"
printf '# Generated Tasks\n\n- [ ] From %s\n' "$input" > "$output"
if [ -n "$workspace" ]; then
  printf 'workspace=%s\n' "$workspace" >> "$output"
fi
EOF
chmod +x "$taskbrief_bin"

node "$repo_root/dist/index.js" init oss-cli smoke-app --var AUTHOR_NAME="Smoke Tester" --prd local-prd.md --tasks local-tasks.md > init.json
test -f smoke-app/README.md
test -f smoke-app/package.json
test -f smoke-app/docs/PRD.md
test -f smoke-app/docs/TASKS.md
grep -q "# smoke-app" smoke-app/README.md
grep -q "Smoke Tester" smoke-app/package.json
grep -q "This is a copied PRD" smoke-app/docs/PRD.md
grep -q -- "- \[ \] Ship it" smoke-app/docs/TASKS.md
node "$repo_root/dist/index.js" init oss-cli smoke-app --dry-run --prd local-prd.md --tasks local-tasks.md > dry-run-existing.json

taskbrief_workspace="$tmp_dir/taskbrief-workspace"
mkdir -p "$taskbrief_workspace"
node "$repo_root/dist/index.js" init oss-cli brief-app --dry-run --prd local-prd.md --taskbrief --taskbrief-workspace "$taskbrief_workspace" > taskbrief-dry-run.json
grep -q '"mode": "dry-run"' taskbrief-dry-run.json
grep -q 'taskbrief' taskbrief-dry-run.json
grep -q 'docs/TASKS.md' taskbrief-dry-run.json
[ ! -e brief-app ] || { echo "taskbrief dry-run created files" >&2; exit 1; }
PATH="$tmp_dir:$PATH" node "$repo_root/dist/index.js" init oss-cli brief-app --prd local-prd.md --taskbrief --taskbrief-workspace "$taskbrief_workspace" > taskbrief-init.json
test -f brief-app/docs/PRD.md
test -f brief-app/docs/TASKS.md
grep -q 'Generated Tasks' brief-app/docs/TASKS.md
grep -q 'workspace=' brief-app/docs/TASKS.md

if PATH="/opt/homebrew/bin:/usr/bin:/bin" node "$repo_root/dist/index.js" init oss-cli missing-taskbrief-app --prd local-prd.md --taskbrief > missing-taskbrief.json 2> missing-taskbrief.err; then
  echo "taskbrief unexpectedly succeeded without binary" >&2
  exit 1
fi
grep -q 'taskbrief binary was not found' missing-taskbrief.err

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
