#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import { spawn } from 'node:child_process';
import { constants as fsConstants } from 'node:fs';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isTemplateKey, listTemplates, type TemplateKey } from './templates.js';

const program = new Command();
const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

type TemplateFile = {
  source?: string;
  destination: string;
  content?: string;
};

type TemplateScaffold = {
  key: TemplateKey;
  files: TemplateFile[];
};

type InitOptions = {
  dryRun?: boolean;
  force?: boolean;
  var?: string[];
  githubCreate?: boolean;
  githubExecute?: boolean;
  githubVisibility?: GithubVisibility;
};

type GithubVisibility = 'public' | 'private';

type GithubPlan = {
  requested: boolean;
  mode: 'noop' | 'dry-run' | 'execute';
  visibility: GithubVisibility;
  repository: string;
  command: string[];
};

type WritePlanItem = {
  source: string;
  destination: string;
  existed: boolean;
  bytes: number;
};

const templateScaffolds: Record<TemplateKey, TemplateScaffold> = {
  'next-app': {
    key: 'next-app',
    files: [
      { source: 'templates/readme/README.template.md', destination: 'README.md' },
      { source: 'templates/contributors/CONTRIBUTING.template.md', destination: 'CONTRIBUTING.md' },
      { source: 'templates/security/SECURITY.template.md', destination: 'SECURITY.md' },
      { source: 'templates/github/pull_request_template.md', destination: '.github/pull_request_template.md' },
      { source: 'templates/agents/AGENTS.template.md', destination: 'AGENTS.md' },
      { source: 'templates/repo-docs/README.md', destination: 'docs/README.md' },
      { source: 'templates/repo-validate/validate.sh', destination: 'scripts/validate.sh' },
      { destination: 'package.json', content: nextPackageJsonTemplate() },
      { destination: 'src/app/page.tsx', content: "export default function Home() {\n  return <main>{{PROJECT_NAME}}</main>;\n}\n" },
      { destination: 'src/app/layout.tsx', content: "export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}\n" }
    ]
  },
  'oss-cli': {
    key: 'oss-cli',
    files: [
      { source: 'templates/readme/README.template.md', destination: 'README.md' },
      { source: 'templates/npm-package/package.json', destination: 'package.json' },
      { source: 'templates/contributors/CONTRIBUTING.template.md', destination: 'CONTRIBUTING.md' },
      { source: 'templates/contributors/CODE_OF_CONDUCT.template.md', destination: 'CODE_OF_CONDUCT.md' },
      { source: 'templates/license/LICENSE.MIT.template', destination: 'LICENSE' },
      { source: 'templates/security/SECURITY.template.md', destination: 'SECURITY.md' },
      { source: 'templates/release/CHANGELOG.template.md', destination: 'CHANGELOG.md' },
      { source: 'templates/release/ROADMAP.template.md', destination: 'ROADMAP.md' },
      { source: 'templates/github/pull_request_template.md', destination: '.github/pull_request_template.md' },
      { source: 'templates/github/dependabot.yml', destination: '.github/dependabot.yml' },
      { source: 'templates/agents/AGENTS.template.md', destination: 'AGENTS.md' },
      { source: 'templates/repo-docs/README.md', destination: 'docs/README.md' },
      { source: 'templates/repo-validate/validate.sh', destination: 'scripts/validate.sh' }
    ]
  },
  'python-api': {
    key: 'python-api',
    files: [
      { source: 'templates/readme/README.template.md', destination: 'README.md' },
      { source: 'templates/contributors/CONTRIBUTING.template.md', destination: 'CONTRIBUTING.md' },
      { source: 'templates/security/SECURITY.template.md', destination: 'SECURITY.md' },
      { source: 'templates/github/pull_request_template.md', destination: '.github/pull_request_template.md' },
      { source: 'templates/agents/AGENTS.template.md', destination: 'AGENTS.md' },
      { source: 'templates/repo-docs/README.md', destination: 'docs/README.md' },
      { source: 'templates/repo-validate/validate.sh', destination: 'scripts/validate.sh' },
      { destination: 'pyproject.toml', content: pythonProjectTemplate() },
      { destination: 'src/{{PACKAGE_MODULE}}/__init__.py', content: "__all__ = ['__version__']\n__version__ = '0.1.0'\n" },
      { destination: 'src/{{PACKAGE_MODULE}}/main.py', content: "from fastapi import FastAPI\n\napp = FastAPI(title=\"{{PROJECT_NAME}}\")\n\n\n@app.get('/health')\ndef health() -> dict[str, str]:\n    return {'status': 'ok'}\n" }
    ]
  }
};

program
  .name('stackforge')
  .alias('sf')
  .description('Agent-friendly software project scaffolding CLI.')
  .version('0.1.0');

program
  .command('templates')
  .description('List available templates.')
  .action(() => {
    console.log(JSON.stringify({ templates: listTemplates() }, null, 2));
  });

program
  .command('init')
  .description('Create a new project from a StackForge template.')
  .argument('<template>', 'Template key, e.g. oss-cli, next-app, python-api', parseTemplateKey)
  .argument('[name]', 'Project directory/name')
  .option('--dry-run', 'Print planned actions without writing files')
  .option('-f, --force', 'Overwrite existing files')
  .option('--var <KEY=VALUE>', 'Template variable override. Can be repeated.', collectVars, [])
  .option('--github-create', 'Plan a GitHub repository creation with gh. Defaults to dry-run; add --github-execute to run it')
  .option('--github-execute', 'Execute the planned gh repo create command. Requires --github-create and cannot be combined with --dry-run')
  .option('--github-visibility <public|private>', 'GitHub repository visibility for --github-create', parseGithubVisibility, 'private')
  .action(async (template: TemplateKey, name: string | undefined, options: InitOptions) => {
    const projectName = name ?? template;
    const projectRoot = path.resolve(process.cwd(), projectName);
    const variables = buildVariables(projectName, options.var ?? []);
    const plan = await buildWritePlan(templateScaffolds[template], projectRoot, variables);
    const existing = plan.filter((item) => item.existed);
    const githubPlan = buildGithubPlan(projectRoot, variables, options);

    if (options.githubExecute && !options.githubCreate) {
      console.error(JSON.stringify({
        ok: false,
        error: '--github-execute requires --github-create so repository creation is always explicit.'
      }, null, 2));
      process.exitCode = 1;
      return;
    }

    if (options.githubExecute && options.dryRun) {
      console.error(JSON.stringify({
        ok: false,
        error: '--github-execute cannot be combined with --dry-run. Run once without --github-execute to review the gh command first.'
      }, null, 2));
      process.exitCode = 1;
      return;
    }

    if (existing.length > 0 && !options.force && !options.dryRun) {
      console.error(JSON.stringify({
        ok: false,
        error: 'Refusing to overwrite existing files. Re-run with --force to overwrite.',
        files: existing.map((item) => path.relative(process.cwd(), item.destination))
      }, null, 2));
      process.exitCode = 1;
      return;
    }

    if (!options.dryRun) {
      for (const item of plan) {
        await mkdir(path.dirname(item.destination), { recursive: true });
        await writeFile(item.destination, item.source, 'utf8');
      }

      if (githubPlan.mode === 'execute') {
        await runGithubCreate(githubPlan.command);
      }
    }

    console.log(JSON.stringify({
      ok: true,
      command: 'init',
      template,
      projectName,
      projectRoot,
      mode: options.dryRun ? 'dry-run' : 'write',
      force: Boolean(options.force),
      github: githubPlan,
      files: plan.map((item) => ({
        path: path.relative(process.cwd(), item.destination),
        existed: item.existed,
        bytes: item.bytes
      }))
    }, null, 2));
  });

await program.parseAsync(process.argv);

function parseTemplateKey(value: string): TemplateKey {
  if (isTemplateKey(value)) {
    return value;
  }

  throw new InvalidArgumentError(`Unknown template "${value}". Run stackforge templates to list available templates.`);
}

function collectVars(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function parseGithubVisibility(value: string): GithubVisibility {
  if (value === 'public' || value === 'private') {
    return value;
  }

  throw new InvalidArgumentError(`Invalid GitHub visibility "${value}". Use "public" or "private".`);
}

function buildVariables(projectName: string, overrides: string[]): Record<string, string> {
  const packageSlug = slugify(projectName);
  const values: Record<string, string> = {
    PROJECT_NAME: projectName,
    PACKAGE_NAME: packageSlug,
    PACKAGE_MODULE: packageSlug.replaceAll('-', '_'),
    PACKAGE_DESCRIPTION: `${projectName} generated by StackForge.`,
    PROJECT_DESCRIPTION: `${projectName} generated by StackForge.`,
    AUTHOR_NAME: 'StackForge User',
    GITHUB_OWNER: 'rogerchappel',
    GITHUB_REPO: packageSlug,
    INSTALL_COMMAND: 'pnpm install',
    USAGE_COMMAND: 'pnpm dev',
    PRIMARY_VERIFICATION_COMMAND: 'pnpm test',
    YEAR: String(new Date().getFullYear()),
    LICENSE: 'MIT',
    VULNERABILITY_REPORTING_INSTRUCTIONS: 'Ask maintainers for the private security reporting path before sharing details.',
    RESPONSE_EXPECTATIONS: 'Maintainers review good-faith reports as capacity allows.',
    IN_SCOPE_SECURITY_ITEM_1: `Vulnerabilities in ${projectName}.`,
    IN_SCOPE_SECURITY_ITEM_2: 'Insecure default configuration shipped by this project.',
    IN_SCOPE_SECURITY_ITEM_3: 'CI, release, or dependency guidance maintained by this project.',
    DISCLOSURE_POLICY: 'Coordinate disclosure with maintainers before publishing vulnerability details.'
  };

  for (const override of overrides) {
    const index = override.indexOf('=');
    if (index <= 0) {
      throw new InvalidArgumentError(`Invalid --var "${override}". Use KEY=VALUE.`);
    }
    values[override.slice(0, index)] = override.slice(index + 1);
  }

  return values;
}

async function buildWritePlan(
  template: TemplateScaffold,
  projectRoot: string,
  variables: Record<string, string>
): Promise<WritePlanItem[]> {
  const items: WritePlanItem[] = [];

  for (const file of template.files) {
    const rawContent = file.content ?? await readFile(path.join(sourceRoot, file.source ?? ''), 'utf8');
    const renderedContent = render(rawContent, variables);
    const renderedDestination = render(file.destination, variables);
    const destination = path.join(projectRoot, renderedDestination);

    items.push({
      source: renderedContent,
      destination,
      existed: await pathExists(destination),
      bytes: Buffer.byteLength(renderedContent, 'utf8')
    });
  }

  return items;
}

function render(content: string, variables: Record<string, string>): string {
  return content.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_match, key: string) => variables[key] ?? '');
}

function buildGithubPlan(_projectRoot: string, variables: Record<string, string>, options: InitOptions): GithubPlan {
  const visibility = options.githubVisibility ?? 'private';
  const repository = `${variables.GITHUB_OWNER}/${variables.GITHUB_REPO}`;
  const command = [
    'gh',
    'repo',
    'create',
    repository,
    `--${visibility}`,
    '--description',
    variables.PROJECT_DESCRIPTION
  ];

  return {
    requested: Boolean(options.githubCreate),
    mode: options.githubCreate ? (options.githubExecute ? 'execute' : 'dry-run') : 'noop',
    visibility,
    repository,
    command
  };
}

async function runGithubCreate(command: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command[0] ?? 'gh', command.slice(1), { stdio: 'inherit' });

    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`GitHub repository creation failed with exit code ${code ?? 'unknown'}.`));
    });
  });
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'stackforge-project';
}

function nextPackageJsonTemplate(): string {
  return `{
  "name": "{{PACKAGE_NAME}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "typescript": "latest"
  }
}
`;
}

function pythonProjectTemplate(): string {
  return `[project]
name = "{{PROJECT_NAME}}"
version = "0.1.0"
description = "{{PROJECT_DESCRIPTION}}"
requires-python = ">=3.11"
dependencies = ["fastapi>=0.115.0", "uvicorn>=0.34.0"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
`;
}
