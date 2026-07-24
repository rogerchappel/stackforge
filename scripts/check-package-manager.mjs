import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const match = /^pnpm@(\d+\.\d+\.\d+)$/.exec(packageJson.packageManager ?? '');

if (!match) {
  throw new Error('package.json packageManager must pin an exact pnpm version');
}

if (!packageJson.pnpm?.onlyBuiltDependencies?.includes('esbuild')) {
  throw new Error('package.json must allow the required esbuild install script');
}

const expectedVersion = match[1];
const workflowDir = join(root, '.github', 'workflows');
const workflowFiles = readdirSync(workflowDir).filter((file) => file.endsWith('.yml'));
let setupCount = 0;

for (const file of workflowFiles) {
  const lines = readFileSync(join(workflowDir, file), 'utf8').split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].includes('uses: pnpm/action-setup@')) {
      continue;
    }

    setupCount += 1;
    const block = lines.slice(index + 1, index + 6).join('\n');
    const version = /^\s+version:\s*['"]?([^'"\s]+)['"]?\s*$/m.exec(block)?.[1];

    if (version !== expectedVersion) {
      throw new Error(
        `${file} pnpm/action-setup version ${version ?? '(missing)'} must match packageManager ${expectedVersion}`,
      );
    }
  }
}

if (setupCount === 0) {
  throw new Error('Expected at least one pnpm/action-setup workflow');
}

console.log(`Validated pnpm ${expectedVersion}, esbuild build policy, and ${setupCount} workflow setup(s).`);
