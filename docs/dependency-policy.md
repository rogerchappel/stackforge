# Dependency Policy

This template starts with Dependabot updates for GitHub Actions only.

## Baseline policy

- Dependabot checks workflow action versions weekly.
- Dependency pull requests should be small and reviewed like any other change.
- Avoid major dependency upgrades in the same commit as feature work.
- Do not add package-manager Dependabot entries until the generated repository has a real
  package manifest.

## Adding Node/npm updates later

After a generated repository adds `package.json`, extend `.github/dependabot.yml` with npm:

```yaml
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
    commit-message:
      prefix: chore
```

Run the project's smallest relevant verification before merging dependency
updates. For Node projects, that usually means lint, tests, typecheck, and build
when those scripts exist.

## Refreshing the Next.js template lockfile

The `next-app` template keeps its generated npm lockfile in
`templates/next-app/package-lock.json`. Refresh a transitive package with
`npm update <package> --package-lock-only --ignore-scripts` inside a freshly
generated `next-app`, then copy the resulting lockfile back into the template.
Run `pnpm test` to check the repository's deterministic lockfile invariants and
`pnpm run release:check` to exercise the generated app's clean install, lint,
production build, audit, and validation gates.
