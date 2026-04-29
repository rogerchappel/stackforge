# PRD: agentic-oss-template

## Product Name

**agentic-oss-template**

## Tagline

A practical starter kit for agent-friendly open-source repositories.

## One-Line Pitch

`agentic-oss-template` gives new OSS projects a reviewable foundation: agent instructions, atomic commit policy, review packs, GitHub issue and PR templates, CI, Dependabot, branchbrief support, release docs, security policy, contributor docs, optional npm package scaffolding, and optional docs-site deployment guidance.

## 1. Objective

Create a reusable public GitHub template repository that Roger Chappel can use to launch open-source projects quickly and consistently.

The template is intended for:

- CLI tools
- agentic developer utilities
- Codex/OpenClaw workflows
- GitHub Actions tooling
- npm packages
- documentation-focused projects
- OSS experiments that may become maintained projects

The repository is a **template and documentation source**, not a product implementation. It should help new projects start with clear governance, safe agent workflows, dependency hygiene, release discipline, and reviewable automation.

## 2. Core Product Principle

The template should help projects move fast without becoming chaotic.

> Fast OSS shipping requires boring infrastructure: clear instructions, safe automation, reviewable branches, dependency hygiene, release discipline, and contributor trust.

The template should support both humans and AI agents.

## 3. Target Users

### Primary User

Roger Chappel, creating OSS projects under the `rogerchappel` GitHub identity.

### Secondary Users

- developers building agent-assisted OSS tools
- maintainers using Codex, OpenClaw, Claude Code, Copilot, or similar agents
- contributors who need clear expectations before opening issues or PRs
- AI agents bootstrapping or maintaining repositories
- people who want a serious OSS starter without a large framework

## 4. Repository Type

This repository should be usable as a **public GitHub template repository**.

Suggested GitHub repository description:

```text
Practical starter kit for agent-friendly open-source projects.
```

Suggested GitHub topics:

- `agentic-development`
- `oss-template`
- `github-actions`
- `dependabot`
- `branchbrief`
- `codex`
- `openclaw`
- `developer-tools`
- `templates`
- `open-source`

## 5. Current V1 Surface Area

V1 is the current template foundation. It includes the following files and directories in this repository.

### Core Repository Files

- `README.md`
- `LICENSE`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `scripts/validate-template.sh`

### Examples

- `examples/cli-tooling/README.md`
- `examples/docs-only/README.md`
- `examples/minimal-library/README.md`

### GitHub Configuration

- `.github/dependabot.yml`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/agent_task.md`
- `.github/workflows/ci.yml`
- `.github/workflows/branchbrief.yml`
- `.github/workflows/docs.yml`

### Documentation

- `docs/PRD.md`
- `docs/agent-prompts.md`
- `docs/agent-workflow.md`
- `docs/branchbrief.md`
- `docs/cloudflare-pages.md`
- `docs/copilot.md`
- `docs/dependency-policy.md`
- `docs/github-actions.md`
- `docs/llm-policy.md`
- `docs/npm-publishing.md`
- `docs/release-checklist.md`
- `docs/release-process.md`
- `docs/repo-customisation.md`
- `docs/security-policy.md`
- `docs/template-variables.md`

### Template Library

- `templates/README.md`
- `templates/agents/AGENTS.template.md`
- `templates/agents/AGENTS.snippet.md`
- `templates/branchbrief/README.md`
- `templates/cloudflare-pages/README.md`
- `templates/cloudflare-pages/deploy-docs-cloudflare-pages.yml`
- `templates/cloudflare-pages/wrangler.toml.template`
- `templates/contributors/CODE_OF_CONDUCT.template.md`
- `templates/contributors/CONTRIBUTING.template.md`
- `templates/contributors/REVIEW_PACK.template.md`
- `templates/dependabot/README.md`
- `templates/docs-site/README.md`
- `templates/docs-site/astro.config.mjs`
- `templates/docs-site/package.json`
- `templates/docs-site/src/content.config.ts`
- `templates/docs-site/src/content/docs/contributing.mdx`
- `templates/docs-site/src/content/docs/getting-started.mdx`
- `templates/docs-site/src/content/docs/index.mdx`
- `templates/docs-site/tsconfig.json`
- `templates/github/dependabot.yml`
- `templates/github/pull_request_template.md`
- `templates/github/ISSUE_TEMPLATE/agent_task.md`
- `templates/github/ISSUE_TEMPLATE/bug_report.md`
- `templates/github/ISSUE_TEMPLATE/feature_request.md`
- `templates/github/workflows/branchbrief.yml`
- `templates/github/workflows/ci.yml`
- `templates/github/workflows/docs.yml`
- `templates/license/LICENSE.MIT.template`
- `templates/npm-package/README.md`
- `templates/npm-package/package.json`
- `templates/npm-package/src/index.js`
- `templates/npm-package/test/index.test.js`
- `templates/readme/README.template.md`
- `templates/release/CHANGELOG.template.md`
- `templates/release/ROADMAP.template.md`
- `templates/release/release-checklist.template.md`
- `templates/release/release-process.template.md`
- `templates/security/SECURITY.github-private-reporting.template.md`
- `templates/security/SECURITY.template.md`

## 6. V1 Requirements

V1 should remain focused on repository hygiene and reusable templates.

V1 must:

- provide a clear README for humans and agents
- use the MIT License
- include agent operating instructions in `AGENTS.md`
- include reusable agent prompts for common OSS maintenance tasks
- support atomic commits, review packs, risk classification, and verification discipline
- provide GitHub issue and PR templates
- include safe baseline GitHub Actions workflows
- include Dependabot configuration and dependency review guidance
- document branchbrief usage for PR review support and agent handoffs
- include release process, release checklist, roadmap, and changelog guidance
- include contributor, security, and code of conduct docs
- provide optional npm package scaffold files
- provide optional docs-site scaffold files
- document Cloudflare Pages deployment as optional
- document Copilot usage as optional
- keep LLM usage optional, explicit, and credential-safe

V1 must not:

- create a full app
- create fake product logic
- require API keys
- require Cloudflare
- require npm publishing
- require LLMs
- assume every generated repository is Node-only
- include private company or client details
- include secrets
- add a generator CLI
- require generated repositories to keep this template repository's validation
  script

## 7. Implemented Optional Areas

Some optional capabilities are already represented in V1 as documentation or template files. They are available for future generated repositories to copy or adapt, but they are not mandatory for every repository generated from this template.

### Docs Site

Implemented as `templates/docs-site/`.

The current scaffold is intentionally small and includes Astro-oriented docs-site starter files. It is a template surface, not a built or deployed documentation site for this repository.

### Cloudflare Pages

Implemented as guidance and templates:

- `docs/cloudflare-pages.md`
- `templates/cloudflare-pages/README.md`
- `templates/cloudflare-pages/deploy-docs-cloudflare-pages.yml`
- `templates/cloudflare-pages/wrangler.toml.template`

Cloudflare Pages remains optional. The repository should not require Cloudflare credentials or automatic deployment.

### Copilot

Implemented as guidance in `docs/copilot.md`.

Copilot remains optional. The current repository does not include a dedicated `.github/copilot-instructions.md` template.

### npm Package Scaffold

Implemented as `templates/npm-package/`.

The current scaffold is a small JavaScript package starter. It is not a full TypeScript CLI generator and does not imply that all future generated repositories must publish to npm.

### Template Validation

Implemented as `scripts/validate-template.sh`.

The current script checks required root files, documentation files, template directories, and unresolved placeholders outside allowed template paths. It validates this template repository; generated repositories may keep, adapt, or remove it during customisation.

### Examples

Implemented as `examples/`.

The examples show documentation-first generated repository shapes for a minimal library, CLI/tooling project, and docs-only project. They are illustrative, not mandatory presets.

## 8. Future Enhancements

The following ideas are explicitly future work unless implemented in a separate PR.

### Expanded Validation

Future enhancement.

Potential additions:

- `scripts/check-template`
- `scripts/list-template-files`

These scripts could extend current validation with stricter file inventory checks, YAML parsing, Markdown link checks, and accidental `.env` detection.

### Generator CLI

Future enhancement.

A future `create-agentic-oss` CLI could copy templates, replace placeholders, select repository presets, and prepare a new repository. V1 remains a template repository, not a generator.

### Copilot Instruction Template

Future enhancement.

A future template could add `templates/github/copilot-instructions.md` or `.github/copilot-instructions.md` guidance. Current V1 only documents optional Copilot usage in `docs/copilot.md`.

### Expanded Docs Site

Future enhancement.

The current docs-site template is intentionally minimal. A future PR could add more pages, navigation, examples, search configuration, and stricter build validation.

### Cloudflare Pages Automation

Future enhancement.

The current repository provides optional Cloudflare Pages guidance and template files. Future work could add more complete deployment setup notes, preview environment conventions, or project-specific deployment examples. The template should still avoid requiring Cloudflare by default.

## 9. Acceptance Criteria

V1 is acceptable when:

- the top-level README explains what the template is and how to use it
- MIT license exists
- AGENTS.md exists and defines the agent workflow
- contributor, security, and code of conduct files exist
- changelog and roadmap files exist
- Dependabot config exists
- GitHub issue templates exist
- PR template exists
- CI, docs, and branchbrief workflows exist
- release process docs exist
- dependency policy docs exist
- branchbrief docs exist
- optional Cloudflare Pages docs are clearly optional
- optional Copilot docs are clearly optional
- optional npm package scaffold exists
- optional docs-site scaffold exists
- reusable agent prompt library exists
- MIT license template exists
- template variables doc exists
- repository customisation guide exists
- no private company or client details are present
- no secrets are present
- Markdown renders cleanly
- YAML is syntactically reasonable
- future-only items are not described as already implemented

## 10. Review and Verification Expectations

Changes to this repository should follow `AGENTS.md`:

1. Work on a branch.
2. Keep each commit to one reviewable intent.
3. Use Conventional Commits.
4. Review `git status` and `git diff`.
5. Stage only related files.
6. Run the smallest relevant verification.
7. Return a review pack.

For PRD updates, verification should include:

- inspect the current file tree
- confirm the PRD only promises implemented files as V1 surface area
- run the requested keyword scan for implemented and future-only areas
- manually review rendered Markdown structure

## 11. Future Roadmap

### V1 - Template Foundation

- MIT license
- AGENTS.md
- GitHub templates
- Dependabot
- CI
- branchbrief workflow
- release-cycle docs
- optional npm scaffold
- optional docs-site scaffold
- optional Cloudflare Pages guidance
- optional Copilot guidance

### V2 - Generator and Validation

- expanded validation checks
- CLI generator
- placeholder replacement
- repository type presets
- GitHub labels sync
- expanded docs-site template
- Copilot instruction template
- docs deployment checklist

### V3 - Repo Factory

- automatic GitHub repository creation
- issue seeding
- CrewCMD integration notes
- branchbrief setup automation
- docs deployment setup automation
- npm publishing setup guidance
- Cloudflare Pages setup guidance
- project metadata index generation

## 12. Final Product Promise

`agentic-oss-template` makes serious OSS repository setup repeatable.

It helps future generated repositories start with trust, safety, reviewability, release discipline, and agent-friendly workflows already in place.
