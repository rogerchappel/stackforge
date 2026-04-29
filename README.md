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
```

## Architecture

- `stackforge` CLI owns deterministic project generation.
- CrewCmd skill owns orchestration instructions, health checks, and node capability requirements.
- Agents should only run StackForge tasks on machines where the CLI is installed.

## Initial templates

- `oss-cli`: TypeScript CLI package
- `next-app`: Next.js application
- `python-api`: Python API service

## PRD

See [docs/PRD.md](docs/PRD.md).
