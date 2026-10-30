export { capabilitiesFor, type BackendKind, type Capabilities } from './capabilities.js';
export type { DocsClient, MemoryClient } from './client.js';
export { MemoryError, UnsupportedError } from './errors.js';
export { createHttpClient, type HttpClientOptions } from './http.js';
export { createTauriClient, type Invoke, type TauriClientOptions } from './tauri.js';
export type {
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
