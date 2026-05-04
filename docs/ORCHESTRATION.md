# ORCHESTRATION

StackForge is released through a reviewed, tag-gated flow:

1. CI validates template integrity, documentation hygiene, and the CLI smoke path on every push and pull request.
2. The Release dry run workflow runs ReleaseBox readiness checks, package verification, and release note generation before a tag is cut.
3. A maintainer creates a `v*.*.*` tag only after the dry run is green.
4. The Release workflow rebuilds, reruns checks, packages the CLI, and creates the GitHub release from the tag.

NPM publishing is intentionally disabled for the initial release wave; the release artifact is attached to GitHub Releases first.
