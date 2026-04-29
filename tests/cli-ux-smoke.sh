#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

cli="$repo_root/dist/index.js"

fail() {
  echo "cli-ux-smoke: $*" >&2
  exit 1
}

assert_json_file() {
  local file="$1"
  node -e "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8'))" "$file" \
    || fail "expected valid JSON in $file"
}

assert_empty_file() {
  local file="$1"
  if [ -s "$file" ]; then
    echo "unexpected output in $file:" >&2
    cat "$file" >&2
    fail "$file should be empty"
  fi
}

assert_field() {
  local file="$1"
  local expression="$2"
  node -e "const data = JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')); if (!($expression)) process.exit(1);" "$file" \
    || fail "JSON assertion failed for $file: $expression"
}

cd "$repo_root"
pnpm build >/dev/null

cd "$tmp_dir"

node "$cli" templates > templates.json 2> templates.err
assert_empty_file templates.err
assert_json_file templates.json
assert_field templates.json "Array.isArray(data.templates) && data.templates.some((template) => template.key === 'oss-cli')"

node "$cli" init oss-cli smoke-app --dry-run > dry-run.json 2> dry-run.err
assert_empty_file dry-run.err
assert_json_file dry-run.json
assert_field dry-run.json "data.ok === true && data.mode === 'dry-run' && data.template === 'oss-cli'"
[ ! -e smoke-app ] || fail "dry-run created target directory"

node "$cli" init oss-cli smoke-app --var AUTHOR_NAME='Smoke Tester' > init.json 2> init.err
assert_empty_file init.err
assert_json_file init.json
assert_field init.json "data.ok === true && data.mode === 'write' && data.files.every((file) => typeof file.path === 'string')"
test -f smoke-app/README.md || fail "README.md was not created"
test -f smoke-app/package.json || fail "package.json was not created"
grep -q '# smoke-app' smoke-app/README.md || fail "README.md did not render project name"
grep -q 'Smoke Tester' smoke-app/package.json || fail "package.json did not render AUTHOR_NAME override"

if node "$cli" init oss-cli smoke-app > overwrite.json 2> overwrite.err; then
  fail "init overwrote existing files without --force"
fi
assert_empty_file overwrite.json
assert_json_file overwrite.err
assert_field overwrite.err "data.ok === false && /overwrite/.test(data.error) && data.files.includes('smoke-app/README.md')"

node "$cli" init oss-cli smoke-app --force > force.json 2> force.err
assert_empty_file force.err
assert_json_file force.json
assert_field force.json "data.ok === true && data.force === true && data.files.some((file) => file.existed === true)"

if node "$cli" init not-a-template bad-app > invalid-template.json 2> invalid-template.err; then
  fail "invalid template succeeded"
fi
assert_empty_file invalid-template.json
grep -Fq 'not-a-template' invalid-template.err || fail "invalid template error did not explain the bad input"
[ ! -e bad-app ] || fail "invalid template created a target directory"

if node "$cli" init oss-cli bad-var-app --var NOT_KEY_VALUE > invalid-var.json 2> invalid-var.err; then
  fail "invalid --var succeeded"
fi
assert_empty_file invalid-var.json
grep -Fq 'NOT_KEY_VALUE' invalid-var.err || grep -Fq 'KEY=VALUE' invalid-var.err || fail "invalid --var error did not explain KEY=VALUE format"
[ ! -e bad-var-app ] || fail "invalid --var created a target directory"

if node "$cli" init oss-cli no-prd-taskbrief --taskbrief > taskbrief-no-prd.json 2> taskbrief-no-prd.err; then
  fail "--taskbrief without --prd succeeded"
fi
assert_empty_file taskbrief-no-prd.json
assert_json_file taskbrief-no-prd.err
assert_field taskbrief-no-prd.err "data.ok === false && /requires --prd/.test(data.error)"
[ ! -e no-prd-taskbrief ] || fail "taskbrief without --prd created a target directory"

cat <<'EOF' > local-prd.md
# Taskbrief PRD
EOF
cat <<'EOF' > local-tasks.md
# Taskbrief Tasks
EOF

if node "$cli" init oss-cli conflicting-taskbrief --prd local-prd.md --tasks local-tasks.md --taskbrief > taskbrief-conflict.json 2> taskbrief-conflict.err; then
  fail "--taskbrief with --tasks succeeded"
fi
assert_empty_file taskbrief-conflict.json
assert_json_file taskbrief-conflict.err
assert_field taskbrief-conflict.err "data.ok === false && /cannot be combined with --tasks/.test(data.error)"
[ ! -e conflicting-taskbrief ] || fail "taskbrief conflict created a target directory"

node "$cli" init oss-cli dry-taskbrief --dry-run --prd local-prd.md --taskbrief > taskbrief-dry-run.json 2> taskbrief-dry-run.err
assert_empty_file taskbrief-dry-run.err
assert_json_file taskbrief-dry-run.json
assert_field taskbrief-dry-run.json "data.ok === true && data.taskbrief.requested === true && data.taskbrief.mode === 'dry-run' && data.taskbrief.command.includes('taskbrief')"
[ ! -e dry-taskbrief ] || fail "taskbrief dry-run created a target directory"

echo "cli-ux-smoke ok"
