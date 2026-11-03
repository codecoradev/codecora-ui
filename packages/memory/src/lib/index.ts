export { MemoryBrowser, type BrowserMode, type MemoryBrowserOptions } from './browser.svelte.js';
export { capabilitiesFor, type BackendKind, type Capabilities } from './capabilities.js';
export type { DocsClient, MemoryClient } from './client.js';
export { MemoryError, UnsupportedError } from './errors.js';
export { createHttpClient, type HttpClientOptions } from './http.js';
export { default as MemoryDetail } from './MemoryDetail.svelte';
export { default as MemoryEditor } from './MemoryEditor.svelte';
export { default as MemoryList } from './MemoryList.svelte';
export { createInMemoryClient, type InMemoryClientOptions } from './inmemory.js';
export { createPortalClient, type PortalClientOptions } from './portal.js';
export { createTauriClient, type Invoke, type TauriClientOptions } from './tauri.js';
export type {
  Doc,
  DocHit,
  DocPatch,
  Health,
  ImportResult,
  ListParams,
  Memory,
  MemoryDraft,
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
