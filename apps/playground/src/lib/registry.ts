// shadcn-svelte registry items, built by `registry/` (`shadcn-svelte registry build`)
// before the playground; the playground serves them at /r/<name>.json.

const files = import.meta.glob<string>('../../../../registry/dist/r/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Raw JSON of every built item, by file name without `.json` (`index` included). */
export const registryFiles: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, raw]) => [path.replace(/^.*\/(.+)\.json$/, '$1'), raw]),
);

export interface RegistryEntry {
  name: string;
  type: string;
  title?: string;
  description?: string;
}

/** Items listed in the registry index, the theme bridge first. */
export const registryItems: RegistryEntry[] = registryFiles.index
  ? (JSON.parse(registryFiles.index) as RegistryEntry[])
  : [];
