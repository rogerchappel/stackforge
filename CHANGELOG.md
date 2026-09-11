# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Added

- Initial release planning, roadmap, and release-process documentation.
- Template validation script and documentation for local repository hygiene
  checks.
- Example generated repository shapes for minimal libraries, CLI tooling, and
  docs-only projects.
- Optional generated repository README template.
- Reusable agent prompt library for common OSS maintenance tasks.

### Changed

- Upgraded Commander to 14.0.3, the newest release compatible with the Node.js
  20 runtime floor, and added Node.js 20 and 22 CLI compatibility coverage.
- Aligned template terminology, placeholder documentation, and current V1
  surface area across docs, templates, and workflows.
- Expanded the optional docs-site template with clearer setup guidance and a
  contributing starter page.
- Expanded template inventory checks and directory documentation to include the
  generated repository README template.
- Tightened template file validation and aligned generated workflow action
  versions.
- Updated the `next-app` template to Next.js 16.3.4 and sharp 0.35.4 to clear
  the current high-severity advisory set, and aligned the generated
  `next-env.d.ts` with Next.js 16.3.4 build output.

## Release Links

- Unreleased:
  `https://github.com/OWNER/REPOSITORY/compare/vLAST...HEAD`
- Latest release:
  `https://github.com/OWNER/REPOSITORY/releases/latest`

Replace `OWNER`, `REPOSITORY`, and `vLAST` after generating a project from this
template.
