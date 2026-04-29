# PRD: StackForge

## Status

In progress. GitHub repo setup and first task batch are being created.

## Summary

StackForge is a CLI-first software project factory for developer/operators and agent orchestrators. It creates agent-friendly repositories from templates for OSS CLIs, Next.js apps, Python APIs, and future project types.

## Scorecard

| Criterion | Score | Notes |
|---|---:|---|
| Problem pain | 18/20 | Roger is manually repeating repo setup, PRD copying, task splitting, and agent dispatch during the OSS sprint. |
| Demand signal | 17/20 | Strong internal daily demand, plus broad external developer pain around repeatable project scaffolding and agent-ready repos. |
| Agent-buildability | 18/20 | V1 can be built as a deterministic local CLI with small template/copy/validation tasks. |
| Uniqueness | 14/20 | Scaffolding is crowded, but the agent-orchestrator + CrewCmd skill angle is differentiated. |
| Portfolio leverage | 15/15 | Speeds every future OSS repo and portfolio product scaffold. |
| Distribution potential | 11/15 | Strong build-in-public angle if it visibly increases Roger's repo/PR throughput. |
| **Total** | **93/100** | Build now. |

## User

Primary user: developer/operator using a CLI locally.

Secondary user: agent/orchestrator using a CrewCmd skill wrapper to call the CLI safely on capable machines.

## Problem

Roger's OSS factory workflow needs one deterministic tool that turns a selected idea into a real working repository with the right docs, agent instructions, templates, task briefs, and review cadence. Today the pieces exist separately: `oss-ideas`, `agentic-oss-template`, `repoctx`, `taskbrief`, `branchbrief`, GitHub CLI, CrewCmd, and OpenClaw agents.

## Goals

- Provide a local-first CLI named `stackforge` with short alias `sf`.
- Scaffold repos from templates: `oss-cli`, `next-app`, `python-api`.
- Copy the selected idea PRD into the generated repo as `docs/PRD.md`.
- Generate or accept task briefs that split the build into small agent-ready tasks.
- Support explicit GitHub repo creation only when requested.
- Expose a CrewCmd-installable skill contract so orchestrators and sub-agents can use the CLI.

## Non-goals

- No autonomous merging.
- No hidden network calls.
- No default LLM calls.
- No broad template marketplace in V1.
- No replacing CrewCmd or OpenClaw. StackForge is the deterministic glue.

## V1 CLI shape

```bash
stackforge templates
stackforge init oss-cli my-tool --dry-run
stackforge init oss-cli my-tool
stackforge launch --idea stackforge --repo stackforge --human-merge
```

V1 can start with `templates` and `init`; `launch` becomes the orchestrated workflow after the first repo scaffold is stable.

## CrewCmd skill contract

- Skill stores usage instructions, task patterns, and health checks.
- Underlying host/node must have the `stackforge` CLI installed.
- CrewCmd records node capability: `stackforge=true` and CLI version.
- Orchestrator only dispatches StackForge tasks to capable agents.

## Acceptance criteria

- `stackforge --version` works.
- `stackforge templates` lists available templates.
- `stackforge init oss-cli demo --dry-run` prints a deterministic plan.
- `stackforge init oss-cli demo` writes a repo scaffold locally.
- Generated repo includes `README.md`, `AGENTS.md`, `docs/PRD.md`, `.github/pull_request_template.md`, and validation script.
- Task brief exists at `docs/TASKS.md` or equivalent.
- Package builds and typechecks.
- README explains CLI-first + CrewCmd skill wrapper architecture.

## Initial task brief seed

Build StackForge in small slices:

1. CLI foundation: commands, version, help, JSON-friendly dry-run output.
2. Template registry: define `oss-cli`, `next-app`, `python-api` metadata.
3. File writer: copy templates, replace variables, avoid overwriting unless explicit.
4. PRD ingestion: copy PRD from `oss-ideas` into generated repo.
5. Task output: generate `docs/TASKS.md` from PRD or accepted task brief input.
6. GitHub integration: explicit `--github` flow using GitHub CLI, never implicit.
7. CrewCmd skill: health check and agent usage contract.
8. Validation: smoke test generated repo and run package check/build.
