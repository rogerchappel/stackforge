# StackForge Release Readiness

This guide defines what must be true before StackForge should be presented as a
reviewable V1 scaffold CLI.

## CLI-first architecture

StackForge is intentionally CLI-first.

- `stackforge` is the deterministic engine that lists templates, previews
  scaffold output, and writes repositories locally.
- Humans and agents interact with the same command surface.
- CrewCmd is a later wrapper, not the source of truth for generation logic.
- OpenClaw agents should call the CLI only on machines where StackForge is
  already installed and verified.

That boundary keeps the core product testable without depending on orchestration
state.

## V1 commands

Release readiness for V1 is anchored to a small command surface:

```bash
stackforge --version
stackforge templates
stackforge init oss-cli demo --dry-run
stackforge init oss-cli demo
```

Expected behavior:

- `--version` returns the installed CLI version.
- `templates` lists the currently supported templates.
- `init ... --dry-run` prints a deterministic plan without writing files.
- `init ...` writes the scaffold locally and avoids hidden network steps.

`launch` can remain documented as a follow-on workflow, but V1 readiness should
not depend on CrewCmd-driven orchestration being complete.

## Command examples

### Inspect available templates

```bash
pnpm dev templates
```

### Preview a scaffold without writing files

```bash
pnpm dev init oss-cli my-tool --dry-run
```

### Generate a local scaffold

```bash
pnpm dev init oss-cli my-tool
```

### Release verification commands

```bash
pnpm check
pnpm build
pnpm check:templates
pnpm smoke:init
```

## Safety model

StackForge should be safe by default.

- No hidden network calls.
- No implicit GitHub repository creation.
- No default LLM calls.
- No autonomous merging or publishing.
- File generation must stay deterministic and reviewable.
- Destructive overwrite behavior must require explicit operator intent.

The release bar is not just "it scaffolds"; it must scaffold in a way that is
predictable enough for humans and agents to trust.

## OpenClaw agent workflow

OpenClaw is an execution environment around StackForge, not a replacement for
it.

1. Verify the node or host has the StackForge CLI installed.
2. Run `stackforge templates` or a dry run first to confirm the requested path.
3. Use `stackforge init ... --dry-run` in planning or review-heavy flows.
4. Run `stackforge init ...` only after the target repo name and template are
   confirmed.
5. Hand the generated repository back to the normal branch, commit, PR, and
   review workflow.

This keeps agent usage grounded in the same deterministic CLI behavior a human
maintainer would use locally.

## CrewCmd-later boundary

CrewCmd support is valuable, but it is explicitly a later wrapper.

For V1, release-ready means:

- the CLI works on its own
- commands are documented
- safety constraints are documented
- agent usage expectations are documented
- verification scripts pass

It does **not** require:

- CrewCmd packaging to be complete
- orchestration-specific automation to be the only entry point
- StackForge to replace OpenClaw, CrewCmd, or GitHub review flows

## V1 release checklist

Use this checklist with the general release process docs before opening a V1
release PR.

- [ ] README explains the CLI-first architecture and CrewCmd-later boundary.
- [ ] README or docs include working command examples for `templates` and
      `init`.
- [ ] V1 command surface is limited to documented, supported behavior.
- [ ] Safety expectations are documented: local-first, no hidden network calls,
      no implicit GitHub creation, no autonomous merge.
- [ ] OpenClaw agent workflow is documented for dry runs and local execution.
- [ ] `pnpm check` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm check:templates` passes.
- [ ] `pnpm smoke:init` passes.
- [ ] Any deferred CrewCmd work is clearly marked as post-V1.
