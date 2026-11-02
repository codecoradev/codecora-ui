import { error } from '@sveltejs/kit';
import { registryFiles } from '../../../lib/registry.js';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
  const items = Object.keys(registryFiles);
  // An empty registry means `registry/` was not built first; fail the build, not the deploy.
  if (items.length === 0) throw new Error('No registry items: run `bun run build` in registry/');
  return items.map((item) => ({ item }));
};

export const GET: RequestHandler = ({ params }) => {
  const body = registryFiles[params.item];
  if (body === undefined) error(404, 'Unknown registry item');
  return new Response(body, { headers: { 'content-type': 'application/json' } });
};
