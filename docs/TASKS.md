# StackForge Task Brief

## Build slices

1. CLI foundation: commands, version, help, JSON-friendly dry-run output.
2. Template registry: define `oss-cli`, `next-app`, `python-api` metadata.
3. File writer: copy templates, replace variables, avoid overwriting unless explicit.
4. PRD ingestion: copy PRD from `oss-ideas` into generated repo.
5. Task output: generate `docs/TASKS.md` from PRD or accepted task brief input.
6. GitHub integration: explicit `--github` flow using GitHub CLI, never implicit.
7. CrewCmd skill: health check and agent usage contract.
8. Validation: smoke test generated repo and run package check/build.

## Agent rules

- Work from latest `main`.
- Create one branch per slice.
- Keep commits atomic, target 1-3 files per commit after scaffold.
- Run `pnpm check` and relevant tests before PR.
- Use real multiline PR bodies from a file, never escaped `\\n` strings.
