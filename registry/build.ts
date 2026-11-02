// Writes dist/registry.json (registry.json plus the generated cc-theme fields)
// for `shadcn-svelte registry build`, which runs next (see package.json).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { withTheme } from './theme.js';

const read = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const { version } = read('../packages/tokens/package.json') as { version: string };

mkdirSync(new URL('dist', import.meta.url), { recursive: true });
writeFileSync(
  new URL('dist/registry.json', import.meta.url),
  `${JSON.stringify(withTheme(read('registry.json'), version), null, 2)}\n`,
);
