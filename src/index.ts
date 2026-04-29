#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('stackforge')
  .alias('sf')
  .description('Agent-friendly software project scaffolding CLI.')
  .version('0.1.0');

program
  .command('templates')
  .description('List available templates.')
  .action(() => {
    console.log(JSON.stringify({
      templates: [
        { key: 'oss-cli', description: 'Open-source TypeScript CLI package' },
        { key: 'next-app', description: 'Next.js app scaffold' },
        { key: 'python-api', description: 'Python API scaffold' }
      ]
    }, null, 2));
  });

program
  .command('init')
  .description('Create a new project from a StackForge template.')
  .argument('<template>', 'Template key, e.g. oss-cli, next-app, python-api')
  .argument('[name]', 'Project directory/name')
  .option('--dry-run', 'Print planned actions without writing files')
  .action((template: string, name: string | undefined, options: { dryRun?: boolean }) => {
    const projectName = name ?? template;
    const mode = options.dryRun ? 'dry-run' : 'write';
    console.log(JSON.stringify({ ok: true, command: 'init', template, projectName, mode }, null, 2));
  });

await program.parseAsync(process.argv);
