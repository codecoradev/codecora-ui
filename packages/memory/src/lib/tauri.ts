import { capabilitiesFor, type Capabilities } from './capabilities.js';
import type { DocsClient, MemoryClient } from './client.js';
import { UnsupportedError } from './errors.js';
import {
  compact,
  rows,
  toDoc,
  toHit,
  toMemory,
  toNamespaces,
  toRoom,
  toStats,
  toTags,
} from './normalize.js';
import { assertSupported } from './support.js';

/** Tauri's `invoke` (from `@tauri-apps/api/core`), passed in so this package does not depend on Tauri. */
export type Invoke = <T>(command: string, args?: Record<string, unknown>) => Promise<T>;

export interface TauriClientOptions {
  invoke: Invoke;
  capabilities?: Partial<Capabilities>;
}

/**
 * Client over the Corin desktop commands (the same names `src/lib/ts/ipc.ts`
 * calls). The core operations are covered; export and import use other desktop
 * commands and report as unsupported. The command shapes come from Corin and
 * are verified against it when Corin adopts the package (#13).
 */
export function createTauriClient({
  invoke,
  capabilities: overrides,
}: TauriClientOptions): MemoryClient {
  const kind = 'tauri' as const;
  // Export and import have no desktop command here, so no override can turn them on.
  const capabilities: Capabilities = {
    ...capabilitiesFor(kind),
    ...overrides,
    export: false,
    import: false,
  };

  const docs: DocsClient = {
    async list(params) {
      assertSupported(capabilities, 'documents', 'docs.list', kind);
      return rows(
        await invoke('doc_list', {
          namespace: params?.namespace ?? null,
          limit: params?.limit ?? null,
        }),
      ).map(toDoc);
    },
    async get(slug) {
      assertSupported(capabilities, 'documents', 'docs.get', kind);
      return toDoc(await invoke('doc_get', { slug }));
    },
    async create(input) {
      assertSupported(capabilities, 'documents', 'docs.create', kind);
      return toDoc(await invoke('doc_create', { ...input }));
    },
    async update(slug, patch) {
      assertSupported(capabilities, 'documents', 'docs.update', kind);
      return toDoc(await invoke('doc_update', { slug, ...patch }));
    },
    async delete(slug) {
      assertSupported(capabilities, 'documents', 'docs.delete', kind);
      await invoke('doc_delete', { slug });
    },
    async search(query, params) {
      assertSupported(capabilities, 'documents', 'docs.search', kind);
      return rows(
        await invoke('doc_search', {
          query,
          namespace: params?.namespace ?? null,
          limit: params?.limit ?? null,
        }),
      ).map((row) => ({
        doc: toDoc((row.document ?? {}) as Record<string, unknown>),
        snippet: typeof row.chunk_snippet === 'string' ? row.chunk_snippet : null,
        score: typeof row.score === 'number' ? row.score : 0,
      }));
    },
  };

  return {
    kind,
    capabilities,
    docs,
    async health() {
      const stats = toStats(await invoke('stats'));
      return { status: 'ok', memories: stats.totalMemories };
    },
    async list(params) {
      return rows(
        await invoke('list', {
          namespace: params?.namespace ?? null,
          tag: params?.tag ?? null,
          limit: params?.limit ?? null,
          offset: params?.offset ?? null,
        }),
      ).map(toMemory);
    },
    async get(id) {
      return toMemory(await invoke('get_memory', { id }));
    },
    async remember(input) {
      return invoke<string>('remember', {
        content: input.content,
        tags: input.tags ?? [],
        namespace: input.namespace ?? null,
        memoryType: input.type ?? null,
        metadata:
          input.metadata || input.author
            ? { ...input.metadata, ...(input.author ? { author: input.author } : {}) }
            : null,
      });
    },
    async update(id, patch) {
      assertSupported(capabilities, 'update', 'update', kind);
      await invoke('memory_update', { id, ...compact({ ...patch }) });
    },
    async forget(id) {
      await invoke('forget', { id });
    },
    async pin(id, pinned = true) {
      assertSupported(capabilities, 'pin', 'pin', kind);
      await invoke('memory_update', { id, pinned });
      return toMemory(await invoke('get_memory', { id }));
    },
    async recall(query, params) {
      assertSupported(capabilities, 'recall', 'recall', kind);
      return rows(
        await invoke('recall', {
          query,
          namespace: params?.namespace ?? null,
          limit: params?.limit ?? null,
        }),
      ).map(toHit);
    },
    async search(query, params) {
      assertSupported(capabilities, 'search', 'search', kind);
      return rows(
        await invoke('search', {
          query,
          namespace: params?.namespace ?? null,
          limit: params?.limit ?? null,
        }),
      ).map(toHit);
    },
    async namespaces() {
      if (capabilities.namespaces === 'none') return [];
      return toNamespaces(await invoke('uteke_namespaces_breakdown'));
    },
    async tags(params) {
      assertSupported(capabilities, 'tags', 'tags', kind);
      return toTags(await invoke('list_tags', { namespace: params?.namespace ?? null }));
    },
    async stats() {
      assertSupported(capabilities, 'stats', 'stats', kind);
      return toStats(await invoke('stats'));
    },
    async rooms() {
      assertSupported(capabilities, 'rooms', 'rooms', kind);
      return rows(await invoke('uteke_rooms', {})).map(toRoom);
    },
    async exportJsonl() {
      throw new UnsupportedError('export', kind);
    },
    async importJsonl() {
      throw new UnsupportedError('import', kind);
    },
  };
}
