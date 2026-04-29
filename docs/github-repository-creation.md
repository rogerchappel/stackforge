# GitHub repository creation

StackForge does not create GitHub repositories by default. The `init` command only plans GitHub repository creation when `--github-create` is present.

## Dry-run-first flow

Run with `--github-create` to print the planned `gh repo create` command in the JSON output without executing it:

```bash
pnpm dev init oss-cli my-tool --github-create
```

The default GitHub repository visibility is `private`. Use `--github-visibility public` only when you intentionally want a public repository:

```bash
pnpm dev init oss-cli my-tool --github-create --github-visibility public
```

After reviewing the printed `github.command`, rerun with `--github-execute` to create the repository through the GitHub CLI:

```bash
pnpm dev init oss-cli my-tool --github-create --github-execute
```

## Safety rules

- Without `--github-create`, StackForge reports `github.mode` as `noop` and never calls `gh`.
- `--github-create` defaults to `github.mode: "dry-run"` for the GitHub command.
- `--github-execute` requires `--github-create` so repository creation is always explicit.
- `--github-execute` cannot be combined with `--dry-run`.
- GitHub creation uses the installed `gh` CLI and any authentication already configured for it.
