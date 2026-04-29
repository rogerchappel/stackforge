# StackForge

Agent-friendly software project scaffolding CLI for apps, APIs, CLIs, and OSS packages.

## Status

Early build. StackForge starts as a CLI-first tool and later gets wrapped by a CrewCmd-installable skill for orchestrator and sub-agent use.

## CLI

```bash
pnpm install
pnpm build
pnpm dev templates
pnpm dev init oss-cli my-tool --dry-run
pnpm dev init oss-cli my-tool --prd ./docs/PRD.md --tasks ./docs/TASKS.md
```


### GitHub repository creation

StackForge never creates a GitHub repository by default. To request GitHub creation, add `--github-create`; the first run is still a dry run for the `gh repo create` command so you can review it safely:

```bash
pnpm dev init oss-cli my-tool --github-create
pnpm dev init oss-cli my-tool --github-create --github-visibility public
```

After reviewing the printed `github.command`, rerun with `--github-execute` to create the repository through the GitHub CLI:

```bash
pnpm dev init oss-cli my-tool --github-create --github-execute
```

`--github-execute` requires `--github-create` and cannot be combined with `--dry-run`. The default visibility is `private`; use `--github-visibility public` only when you intentionally want a public repository.

## Architecture

- `stackforge` CLI owns deterministic project generation.
- CrewCmd skill owns orchestration instructions, health checks, and node capability requirements.
- Agents should only run StackForge tasks on machines where the CLI is installed.

## Initial templates

- `oss-cli`: TypeScript CLI package
- `next-app`: Next.js application
- `python-api`: Python API service

## Local planning docs

Use `--prd <path>` and `--tasks <path>` with `stackforge init` to copy local planning inputs into the generated repo as `docs/PRD.md` and `docs/TASKS.md`.

## PRD

See [docs/PRD.md](docs/PRD.md).
