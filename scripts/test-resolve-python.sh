#!/bin/bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

make_python() {
  name="$1"
  supported="$2"
  cat > "$tmp_dir/$name" <<EOF
#!/bin/bash
exit $supported
EOF
  chmod +x "$tmp_dir/$name"
}

# A compatible versioned interpreter wins even when the unversioned one is old.
make_python python3.12 0
make_python python3 1
resolved="$(PATH="$tmp_dir" /bin/bash "$repo_root/scripts/resolve-python.sh")"
[ "$resolved" = "$tmp_dir/python3.12" ]

# An explicit incompatible interpreter is rejected with an actionable message.
if PATH="$tmp_dir" STACKFORGE_PYTHON=python3 /bin/bash "$repo_root/scripts/resolve-python.sh" > "$tmp_dir/out" 2> "$tmp_dir/err"; then
  echo "incompatible configured Python unexpectedly succeeded" >&2
  exit 1
fi
grep -q 'STACKFORGE_PYTHON.*Python >= 3.11' "$tmp_dir/err"

# With no compatible candidate, resolution fails independently of the host Python.
rm -f "$tmp_dir/python3.12"
if PATH="$tmp_dir" /bin/bash "$repo_root/scripts/resolve-python.sh" > "$tmp_dir/out" 2> "$tmp_dir/err"; then
  echo "missing compatible Python unexpectedly succeeded" >&2
  exit 1
fi
grep -q 'Install it or set STACKFORGE_PYTHON' "$tmp_dir/err"

echo "resolve-python tests ok"
