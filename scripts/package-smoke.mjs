import { spawnSync } from 'node:child_process';

const requiredFiles = [
  'dist/index.js',
  'src/index.ts',
  'templates/npm-package/package.json',
  'docs/release-readiness.md',
  'README.md',
  'LICENSE',
];

const result = spawnSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

const [pack] = JSON.parse(result.stdout);
const packedFiles = new Set(pack.files.map((file) => file.path));
const missingFiles = requiredFiles.filter((file) => !packedFiles.has(file));

if (missingFiles.length > 0) {
  console.error(`Package smoke failed; missing files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log(`Package smoke passed for ${pack.filename} (${pack.files.length} files).`);
