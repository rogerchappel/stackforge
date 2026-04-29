#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { listTemplates, TEMPLATE_KEYS, TEMPLATE_REGISTRY } from '../dist/templates.js';

const expectedKeys = ['next-app', 'oss-cli', 'python-api'];
const keys = [...TEMPLATE_KEYS];

if (JSON.stringify(keys) !== JSON.stringify(expectedKeys)) {
  throw new Error(`Template keys are not deterministic. Expected ${expectedKeys.join(', ')}, got ${keys.join(', ')}`);
}

const registryKeys = Object.keys(TEMPLATE_REGISTRY).sort();
if (JSON.stringify(registryKeys) !== JSON.stringify(expectedKeys)) {
  throw new Error(`Registry keys mismatch. Expected ${expectedKeys.join(', ')}, got ${registryKeys.join(', ')}`);
}

const templates = listTemplates();
if (templates.length !== expectedKeys.length) {
  throw new Error(`Expected ${expectedKeys.length} templates, got ${templates.length}`);
}

for (const [index, template] of templates.entries()) {
  const expectedKey = expectedKeys[index];
  if (template.key !== expectedKey) {
    throw new Error(`Template at index ${index} should be ${expectedKey}, got ${template.key}`);
  }

  if (!template.name || !template.description || !template.category) {
    throw new Error(`Template ${template.key} is missing required metadata`);
  }
}

const cliOutput = execFileSync(process.execPath, ['dist/index.js', 'templates'], { encoding: 'utf8' });
const parsed = JSON.parse(cliOutput);
if (JSON.stringify(parsed.templates) !== JSON.stringify(templates)) {
  throw new Error('CLI templates output does not match typed registry');
}

console.log('template registry check passed');
