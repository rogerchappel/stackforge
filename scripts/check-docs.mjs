import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const requiredDocs = [
  'README.md',
  'docs/PRD.md',
  'docs/TASKS.md',
  'docs/release-readiness.md',
  'docs/release-checklist.md',
  'docs/release-process.md',
  'docs/github-actions.md',
  'docs/template-variables.md',
];

const markdownFiles = [];

function collectMarkdown(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules' || entry === 'dist') {
      continue;
    }

    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      collectMarkdown(path);
    } else if (entry.endsWith('.md')) {
      markdownFiles.push(relative(root, path));
    }
  }
}

for (const doc of requiredDocs) {
  const content = readFileSync(join(root, doc), 'utf8').trim();

  if (content.length === 0) {
    throw new Error(`${doc} must not be empty`);
  }
}

collectMarkdown(root);

if (markdownFiles.length === 0) {
  throw new Error('Expected at least one markdown file');
}

for (const file of markdownFiles) {
  const content = readFileSync(join(root, file), 'utf8');

  if (content.trim().length === 0) {
    throw new Error(`${file} must not be empty`);
  }
}

const docsWorkflow = readFileSync(join(root, '.github/workflows/docs.yml'), 'utf8');

if (/customization TODO|Add docs build verification here/.test(docsWorkflow)) {
  throw new Error('docs workflow still contains placeholder verification text');
}

const readme = readFileSync(join(root, 'README.md'), 'utf8');

for (const doc of ['docs/release-readiness.md', 'docs/release-checklist.md', 'docs/release-process.md']) {
  if (!readme.includes(doc)) {
    throw new Error(`README.md must link ${doc}`);
  }
}

console.log(`Validated ${markdownFiles.length} markdown files and ${requiredDocs.length} required docs.`);
