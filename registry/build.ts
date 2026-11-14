// Writes dist/registry.json (registry.json plus the generated cc-theme fields)
// for `shadcn-svelte registry build`, which runs next (see package.json).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { withTheme } from './theme.js';

const read = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const version = (pkg: string) =>
  (read(`../packages/${pkg}/package.json`) as { version: string }).version;

mkdirSync(new URL('dist', import.meta.url), { recursive: true });
writeFileSync(
  new URL('dist/registry.json', import.meta.url),
  `${JSON.stringify(withTheme(read('registry.json'), { tokens: version('tokens'), ui: version('ui') }), null, 2)}\n`,
);
