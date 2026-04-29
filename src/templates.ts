export const TEMPLATE_KEYS = ['next-app', 'oss-cli', 'python-api'] as const;

export type TemplateKey = typeof TEMPLATE_KEYS[number];

export type TemplateCategory = 'app' | 'api' | 'cli';

export interface TemplateDefinition {
  key: TemplateKey;
  name: string;
  description: string;
  category: TemplateCategory;
}

export const TEMPLATE_REGISTRY: Record<TemplateKey, TemplateDefinition> = {
  'next-app': {
    key: 'next-app',
    name: 'Next.js App',
    description: 'Next.js app scaffold',
    category: 'app'
  },
  'oss-cli': {
    key: 'oss-cli',
    name: 'OSS CLI',
    description: 'Open-source TypeScript CLI package',
    category: 'cli'
  },
  'python-api': {
    key: 'python-api',
    name: 'Python API',
    description: 'Python API scaffold',
    category: 'api'
  }
};

export function listTemplates(): TemplateDefinition[] {
  return TEMPLATE_KEYS.map((key) => TEMPLATE_REGISTRY[key]);
}

export function isTemplateKey(value: string): value is TemplateKey {
  return (TEMPLATE_KEYS as readonly string[]).includes(value);
}
