/** A memory as every transport returns it (camelCase, defaults filled in). */
export interface Memory {
  id: string;
  content: string;
  tags: string[];
  namespace: string;
  /** fact, decision, procedure, context, ...; the server defaults to "fact". */
  memoryType: string;
  importance: number;
  pinned: boolean;
  deprecated: boolean;
  contentType: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  accessCount: number;
  recallCount: number;
  lastAccessed: string | null;
  validFrom: string | null;
  validUntil: string | null;
}

export interface NewMemory {
  content: string;
  tags?: string[];
  namespace?: string;
  /** Memory type, for example "decision". */
  type?: string;
  metadata?: Record<string, unknown>;
  /** Provenance, for example "human" or an agent name. */
  author?: string;
}

/** Fields to change; an absent field is left alone. */
export interface MemoryPatch {
  content?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  importance?: number;
  pinned?: boolean;
}

export interface ListParams {
  namespace?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  namespace?: string;
  limit?: number;
}

export interface SearchHit {
  memory: Memory;
  score: number;
}

export interface Health {
  status: string;
  version?: string;
  memories?: number;
  namespaces?: number;
}

export interface Stats {
  totalMemories: number;
  uniqueTags: number;
  dbSizeBytes: number;
}

export interface NamespaceInfo {
  name: string;
  count: number;
  active: number;
  deprecated: number;
}

export interface TagCount {
  name: string;
  count: number;
}

export interface Room {
  id: string;
  title: string | null;
  namespace: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Doc {
  id: string;
  slug: string;
  title: string;
  /** Only on get, create and update. */
  content?: string;
  tags: string[];
  version: number | null;
  parentId: string | null;
  updatedAt: string | null;
}

export interface NewDoc {
  slug: string;
  content: string;
  title?: string;
  tags?: string[];
  parent?: string;
}

export interface DocPatch {
  content?: string;
  title?: string;
  tags?: string[];
}

export interface DocHit {
  doc: Doc;
  snippet: string | null;
  score: number;
}

export interface ImportResult {
  imported: number;
  skipped: number;
}
