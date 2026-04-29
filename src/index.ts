#!/usr/bin/env node
import { Command } from 'commander';
import { isTemplateKey, listTemplates } from './templates.js';

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
    console.log(JSON.stringify({ templates: listTemplates() }, null, 2));
  });

program
  .command('init')
  .description('Create a new project from a StackForge template.')
  .argument('<template>', 'Template key, e.g. oss-cli, next-app, python-api')
  .argument('[name]', 'Project directory/name')
  .option('--dry-run', 'Print planned actions without writing files')
  .action((template: string, name: string | undefined, options: { dryRun?: boolean }) => {
    if (!isTemplateKey(template)) {
      throw new Error(`Unknown template: ${template}. Run \`stackforge templates\` to list available templates.`);
    }

    const projectName = name ?? template;
    const mode = options.dryRun ? 'dry-run' : 'write';
    console.log(JSON.stringify({ ok: true, command: 'init', template, projectName, mode }, null, 2));
  });

await program.parseAsync(process.argv);
