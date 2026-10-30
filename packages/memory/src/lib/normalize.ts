import type {
  Doc,
  ImportResult,
  Memory,
  NamespaceInfo,
  Room,
  SearchHit,
  Stats,
  TagCount,
} from './types.js';

type Raw = Record<string, unknown>;

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const num = (v: unknown, fallback = 0): number => (typeof v === 'number' ? v : fallback);
const bool = (v: unknown): boolean => v === true;
const strOrNull = (v: unknown): string | null => (typeof v === 'string' ? v : null);
const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

/** A list answer as rows: anything else (an empty body, an error shape) is no rows. */
export const rows = (value: unknown): Raw[] => (Array.isArray(value) ? (value as Raw[]) : []);

/** Server and desktop memory rows (snake_case, fields sometimes missing) to the domain model. */
export function toMemory(raw: Raw): Memory {
  return {
    id: str(raw.id),
    content: str(raw.content),
    tags: strings(raw.tags),
    namespace: str(raw.namespace, 'default'),
    memoryType: str(raw.memory_type, 'fact'),
    importance: num(raw.importance, 0.5),
    pinned: bool(raw.pinned),
    deprecated: bool(raw.deprecated),
    contentType: str(raw.content_type, 'text'),
    metadata:
      raw.metadata && typeof raw.metadata === 'object' && !Array.isArray(raw.metadata)
        ? (raw.metadata as Record<string, unknown>)
        : null,
    createdAt: str(raw.created_at),
    updatedAt: str(raw.updated_at),
    accessCount: num(raw.access_count),
    recallCount: num(raw.recall_count),
    lastAccessed: strOrNull(raw.last_accessed),
    validFrom: strOrNull(raw.valid_from),
    validUntil: strOrNull(raw.valid_until),
  };
}

/** `/recall` and `/search` rows: `{ memory, score }`; the desktop returns flat rows with a score. */
export function toHit(raw: Raw): SearchHit {
  const memory = raw.memory && typeof raw.memory === 'object' ? (raw.memory as Raw) : raw;
  return { memory: toMemory(memory), score: num(raw.score) };
}

export function toStats(raw: Raw): Stats {
  return {
    totalMemories: num(raw.total_memories),
    uniqueTags: num(raw.unique_tags),
    dbSizeBytes: num(raw.db_size_bytes),
  };
}

/** `/namespaces` returns objects with counts, or plain names on older servers. */
export function toNamespaces(value: unknown): NamespaceInfo[] {
  return (Array.isArray(value) ? value : []).map((row) =>
    typeof row === 'string'
      ? { name: row, count: 0, active: 0, deprecated: 0 }
      : {
          name: str((row as Raw).name),
          count: num((row as Raw).count),
          active: num((row as Raw).active, num((row as Raw).count)),
          deprecated: num((row as Raw).deprecated),
        },
  );
}

export function toTags(value: unknown): TagCount[] {
  return (Array.isArray(value) ? value : []).map((row) => ({
    name: str((row as Raw).name),
    count: num((row as Raw).count),
  }));
}

export function toRoom(raw: Raw): Room {
  return {
    id: str(raw.id),
    title: strOrNull(raw.title),
    namespace: str(raw.namespace, 'default'),
    createdAt: strOrNull(raw.created_at),
    updatedAt: strOrNull(raw.updated_at),
  };
}

export function toDoc(raw: Raw): Doc {
  return {
    id: str(raw.id),
    slug: str(raw.slug),
    title: str(raw.title),
    ...(typeof raw.content === 'string' ? { content: raw.content } : {}),
    tags: strings(raw.tags),
    version: typeof raw.version === 'number' ? raw.version : null,
    parentId: strOrNull(raw.parent_id),
    updatedAt: strOrNull(raw.updated_at),
  };
}

export function toImportResult(raw: Raw): ImportResult {
  return { imported: num(raw.imported), skipped: num(raw.skipped) };
}

/** Drop undefined keys: servers read an absent field as "leave it" and an explicit null as "clear it". */
export function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>;
}
