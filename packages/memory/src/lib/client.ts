import type { BackendKind, Capabilities } from './capabilities.js';
import type {
  Doc,
  DocHit,
  DocPatch,
  Health,
  ImportResult,
  ListParams,
  Memory,
  MemoryPatch,
  NamespaceInfo,
  NewDoc,
  NewMemory,
  Room,
  SearchHit,
  SearchParams,
  Stats,
  TagCount,
} from './types.js';

export interface DocsClient {
  list(params?: { namespace?: string; limit?: number }): Promise<Doc[]>;
  /** By slug. */
  get(slug: string): Promise<Doc>;
  create(input: NewDoc): Promise<Doc>;
  update(slug: string, patch: DocPatch): Promise<Doc>;
  delete(slug: string): Promise<void>;
  search(query: string, params?: SearchParams): Promise<DocHit[]>;
}

/**
 * One interface over every backend (uteke-serve, Uteke Cloud, the Tauri app).
 * Check `capabilities` before offering a feature; a method whose capability is
 * false throws `UnsupportedError`.
 */
export interface MemoryClient {
  readonly kind: BackendKind;
  readonly capabilities: Capabilities;
  health(): Promise<Health>;
  list(params?: ListParams): Promise<Memory[]>;
  get(id: string): Promise<Memory>;
  /** Returns the new memory's id. */
  remember(input: NewMemory): Promise<string>;
  update(id: string, patch: MemoryPatch): Promise<void>;
  forget(id: string): Promise<void>;
  pin(id: string, pinned?: boolean): Promise<Memory>;
  recall(query: string, params?: SearchParams): Promise<SearchHit[]>;
  search(query: string, params?: SearchParams): Promise<SearchHit[]>;
  namespaces(): Promise<NamespaceInfo[]>;
  tags(params?: { namespace?: string }): Promise<TagCount[]>;
  stats(): Promise<Stats>;
  rooms(): Promise<Room[]>;
  readonly docs: DocsClient;
  /** All memories as JSON lines. */
  exportJsonl(params?: { namespace?: string }): Promise<string>;
  importJsonl(content: string, params?: { namespace?: string }): Promise<ImportResult>;
}
