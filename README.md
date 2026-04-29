# StackForge

Agent-friendly software project scaffolding CLI for apps, APIs, CLIs, and OSS
packages.

## Status

Early build. StackForge is release-scoped as a CLI-first tool first, with
CrewCmd support treated as a later wrapper for orchestrator and sub-agent use.

## CLI-first architecture

- `stackforge` CLI owns deterministic project generation.
- Humans and agents use the same local command surface.
- CrewCmd owns orchestration instructions, health checks, and capability
  routing later; it does not replace the CLI.
- OpenClaw agents should only run StackForge tasks on machines where the CLI is
  installed and verified.

## Core commands

```bash
pnpm install
pnpm build
pnpm dev templates
pnpm dev init oss-cli my-tool --dry-run
pnpm dev init oss-cli my-tool
pnpm dev init oss-cli my-tool --prd ./docs/PRD.md --tasks ./docs/TASKS.md
```

The V1 release bar is a documented, deterministic command surface:

```bash
stackforge --version
stackforge templates
stackforge init oss-cli demo --dry-run
stackforge init oss-cli demo
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

## Safety model

StackForge is local-first and review-friendly:

- no hidden network calls
- no implicit GitHub creation
- no default LLM calls
- no autonomous merging or publishing
- no destructive overwrite behavior without explicit intent

## Initial templates

- `oss-cli`: TypeScript CLI package
- `next-app`: Next.js application
- `python-api`: Python API service

## Local planning docs

Use `--prd <path>` and `--tasks <path>` with `stackforge init` to copy local planning inputs into the generated repo as `docs/PRD.md` and `docs/TASKS.md`.

## Release readiness docs

- [Release readiness guide](docs/release-readiness.md)
- [Release checklist](docs/release-checklist.md)
- [Release process](docs/release-process.md)
- [OpenClaw agent workflow](docs/agent-workflow.md)

## PRD

See [docs/PRD.md](docs/PRD.md).
