import { capabilitiesFor, type BackendKind, type Capabilities } from './capabilities.js';
import type { DocsClient, MemoryClient } from './client.js';
import { MemoryError, UnsupportedError } from './errors.js';
import { assertSupported } from './support.js';
import type { Memory, Room, SearchHit } from './types.js';

export interface InMemoryClientOptions {
  /** Memories to start with; missing fields get the server defaults. */
  memories?: (Partial<Memory> & { content: string })[];
  /** Rooms with the ids of the memories filed in each. */
  rooms?: (Partial<Room> & { id: string; memoryIds?: string[] })[];
  /** Which backend to imitate, for its capabilities; defaults to "uteke-serve". */
  kind?: BackendKind;
  capabilities?: Partial<Capabilities>;
  /** The clock for new and changed memories; defaults to the current time. */
  now?: () => Date;
}

/**
 * A `MemoryClient` that keeps everything in this page, for demos, stories and
 * tests. Search is a plain word match, not semantic; documents, export and
 * import are not there.
 */
export function createInMemoryClient(options: InMemoryClientOptions = {}): MemoryClient {
  const kind = options.kind ?? 'uteke-serve';
  const capabilities: Capabilities = {
    ...capabilitiesFor(kind),
    ...options.capabilities,
    documents: false,
    export: false,
    import: false,
  };
  let sequence = 0;
  const clock = options.now ?? (() => new Date());
  const now = () => clock().toISOString();
  const newId = () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, '0')}`;

  const fill = (input: Partial<Memory> & { content: string }): Memory => {
    const at = now();
    return {
      id: input.id ?? newId(),
      content: input.content,
      tags: input.tags ?? [],
      namespace: input.namespace ?? 'default',
      memoryType: input.memoryType ?? 'fact',
      importance: input.importance ?? 0.5,
      pinned: input.pinned ?? false,
      deprecated: input.deprecated ?? false,
      contentType: input.contentType ?? 'text',
      metadata: input.metadata ?? null,
      createdAt: input.createdAt ?? at,
      updatedAt: input.updatedAt ?? input.createdAt ?? at,
      accessCount: input.accessCount ?? 0,
      recallCount: input.recallCount ?? 0,
      lastAccessed: input.lastAccessed ?? null,
      validFrom: input.validFrom ?? null,
      validUntil: input.validUntil ?? null,
    };
  };

  const store = new Map<string, Memory>();
  for (const seed of options.memories ?? []) {
    const memory = fill(seed);
    store.set(memory.id, memory);
  }
  const rooms = (options.rooms ?? []).map((r) => ({
    room: {
      id: r.id,
      title: r.title ?? null,
      namespace: r.namespace ?? 'default',
      createdAt: r.createdAt ?? null,
      updatedAt: r.updatedAt ?? null,
    } satisfies Room,
    ids: new Set(r.memoryIds ?? []),
  }));

  const newestFirst = () =>
    [...store.values()].sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
    );

  const find = (id: string) => {
    const memory = store.get(id);
    if (!memory) throw new MemoryError(`memory ${id} not found`, 'http', 404);
    return memory;
  };

  /** Share of the query's words found in the memory, so more matches rank higher. */
  const match = (query: string, limit = 10): SearchHit[] => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return newestFirst()
      .map((memory) => {
        const text = `${memory.content} ${memory.tags.join(' ')}`.toLowerCase();
        const found = words.filter((w) => text.includes(w)).length;
        return { memory, score: found / words.length };
      })
      .filter((hit) => hit.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  const docs: DocsClient = {
    list: async () => [],
    get: async () => {
      throw new UnsupportedError('docs.get', kind);
    },
    create: async () => {
      throw new UnsupportedError('docs.create', kind);
    },
    update: async () => {
      throw new UnsupportedError('docs.update', kind);
    },
    delete: async () => {
      throw new UnsupportedError('docs.delete', kind);
    },
    search: async () => [],
  };

  return {
    kind,
    capabilities,
    docs,
    async health() {
      return { status: 'ok', memories: store.size };
    },
    async list(params) {
      const rows = newestFirst().filter(
        (m) =>
          (!params?.tag || m.tags.includes(params.tag)) &&
          (!params?.namespace || m.namespace === params.namespace),
      );
      const offset = params?.offset ?? 0;
      return rows.slice(offset, offset + (params?.limit ?? 50));
    },
    async get(id) {
      return find(id);
    },
    async remember(input) {
      assertSupported(capabilities, 'create', 'remember', kind);
      const memory = fill({
        content: input.content,
        tags: input.tags,
        namespace: input.namespace,
        memoryType: input.type,
        metadata: input.author
          ? { ...input.metadata, author: input.author }
          : (input.metadata ?? null),
      });
      store.set(memory.id, memory);
      return memory.id;
    },
    async update(id, patch) {
      assertSupported(capabilities, 'update', 'update', kind);
      const memory = find(id);
      store.set(id, {
        ...memory,
        ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)),
        updatedAt: now(),
      });
    },
    async forget(id) {
      find(id);
      store.delete(id);
      for (const r of rooms) r.ids.delete(id);
    },
    async pin(id, pinned = true) {
      assertSupported(capabilities, 'pin', 'pin', kind);
      const memory = { ...find(id), pinned };
      store.set(id, memory);
      return memory;
    },
    async recall(query, params) {
      assertSupported(capabilities, 'recall', 'recall', kind);
      return match(query, params?.limit);
    },
    async search(query, params) {
      assertSupported(capabilities, 'search', 'search', kind);
      return match(query, params?.limit);
    },
    async namespaces() {
      if (capabilities.namespaces === 'none') return [];
      const counts = new Map<string, number>();
      for (const m of store.values()) counts.set(m.namespace, (counts.get(m.namespace) ?? 0) + 1);
      return [...counts].map(([name, count]) => ({ name, count, active: count, deprecated: 0 }));
    },
    async tags() {
      assertSupported(capabilities, 'tags', 'tags', kind);
      const counts = new Map<string, number>();
      for (const m of store.values()) {
        for (const tag of m.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
      return [...counts].map(([name, count]) => ({ name, count }));
    },
    async stats() {
      assertSupported(capabilities, 'stats', 'stats', kind);
      const tags = new Set([...store.values()].flatMap((m) => m.tags));
      return { totalMemories: store.size, uniqueTags: tags.size, dbSizeBytes: 0 };
    },
    async rooms() {
      assertSupported(capabilities, 'rooms', 'rooms', kind);
      return rooms.map((r) => r.room);
    },
    async roomMemories(roomId, params) {
      assertSupported(capabilities, 'rooms', 'roomMemories', kind);
      const ids = rooms.find((r) => r.room.id === roomId)?.ids ?? new Set<string>();
      return newestFirst()
        .filter((m) => ids.has(m.id))
        .slice(0, params?.limit ?? 100);
    },
    async exportJsonl() {
      throw new UnsupportedError('export', kind);
    },
    async importJsonl() {
      throw new UnsupportedError('import', kind);
    },
  };
}
