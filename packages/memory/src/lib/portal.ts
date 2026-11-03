import { capabilitiesFor, type Capabilities } from './capabilities.js';
import type { DocsClient, MemoryClient } from './client.js';
import { UnsupportedError } from './errors.js';
import {
  compact,
  memoryRows,
  toHit,
  toMemory,
  toPortalMemory,
  toPortalRooms,
  toPortalStats,
  toPortalTags,
} from './normalize.js';
import { assertSupported } from './support.js';
import { createRequester } from './transport.js';

export interface PortalClientOptions {
  /**
   * The Uteke Cloud API root on the page's own origin, for example `/api/v2`;
   * the portal routes live under `/portal`. The API sends no CORS headers, so
   * this works from pages served next to it (the portal), not from another origin.
   */
  baseUrl: string;
  /** A portal bearer, instead of the session cookie. Never logged. */
  bearer?: string;
  /** Defaults to "same-origin", which sends the session cookie to the portal's own origin. */
  credentials?: RequestCredentials;
  /** Extra headers on every request. */
  headers?: Record<string, string>;
  /** Replace fetch (tests). */
  fetch?: typeof fetch;
  /** Override the defaults; documents, export, import and create are always off. */
  capabilities?: Partial<Capabilities>;
}

const kind = 'cloud' as const;

/**
 * Client for what the Uteke Cloud portal lets a signed-in user do with their own
 * memories: browse, search, open, edit, pin and forget, plus rooms and tags.
 * Authentication is the portal session; writes need the portal's CSRF check, so
 * the page must be on the portal's own origin.
 *
 * Not offered here: creating a memory (agents write those), documents, export
 * and import, which use other portal routes and report as unsupported. Search
 * returns no scores, so every hit scores 0; `recall` is the meaning search,
 * which Cloud answers with a keyword search when the vector index is off.
 */
export function createPortalClient(options: PortalClientOptions): MemoryClient {
  // These have no portal route here, so no override can turn them on.
  const capabilities: Capabilities = {
    ...capabilitiesFor(kind),
    ...options.capabilities,
    create: false,
    documents: false,
    export: false,
    import: false,
  };
  const { json } = createRequester({
    baseUrl: options.baseUrl,
    apiKey: options.bearer,
    credentials: options.credentials ?? 'same-origin',
    headers: options.headers,
    fetch: options.fetch,
  });

  const memoryPath = (id: string) => `/portal/memories/${encodeURIComponent(id)}`;
  const getMemory = async (id: string) => toPortalMemory(await json('GET', memoryPath(id)));
  const overview = () => json('GET', '/portal/overview');
  const facets = () => json('GET', '/portal/memories/facets');

  const find = async (mode: 'keyword' | 'meaning', query: string, params?: { limit?: number }) =>
    memoryRows(
      await json('POST', '/portal/memories/search', {
        body: compact({ query, mode, limit: params?.limit }),
      }),
    ).map(toHit);

  const noDocs = (operation: string) => async (): Promise<never> => {
    throw new UnsupportedError(`docs.${operation}`, kind);
  };
  const docs: DocsClient = {
    list: noDocs('list'),
    get: noDocs('get'),
    create: noDocs('create'),
    update: noDocs('update'),
    delete: noDocs('delete'),
    search: noDocs('search'),
  };

  return {
    kind,
    capabilities,
    docs,
    async health() {
      const storage = toPortalStats(await overview(), []);
      return { status: 'ok', memories: storage.totalMemories };
    },
    async list(params) {
      const query = { limit: params?.limit, offset: params?.offset, tag: params?.tag };
      return memoryRows(await json('GET', '/portal/memories', { query })).map(toMemory);
    },
    get: getMemory,
    async remember() {
      assertSupported(capabilities, 'create', 'remember', kind);
      throw new UnsupportedError('remember', kind);
    },
    async update(id, patch) {
      assertSupported(capabilities, 'update', 'update', kind);
      await json('PATCH', memoryPath(id), { body: compact({ ...patch }) });
    },
    async forget(id) {
      await json('DELETE', memoryPath(id));
    },
    async pin(id, pinned = true) {
      assertSupported(capabilities, 'pin', 'pin', kind);
      await json('POST', `${memoryPath(id)}/${pinned ? 'pin' : 'unpin'}`);
      return getMemory(id);
    },
    async recall(query, params) {
      assertSupported(capabilities, 'recall', 'recall', kind);
      return find('meaning', query, params);
    },
    async search(query, params) {
      assertSupported(capabilities, 'search', 'search', kind);
      return find('keyword', query, params);
    },
    // Namespaces are deprecated on Cloud and the portal has no route for them.
    async namespaces() {
      return [];
    },
    async tags() {
      assertSupported(capabilities, 'tags', 'tags', kind);
      return toPortalTags(await facets());
    },
    async stats() {
      assertSupported(capabilities, 'stats', 'stats', kind);
      const [usage, tags] = await Promise.all([overview(), facets()]);
      return toPortalStats(usage, toPortalTags(tags));
    },
    async rooms() {
      assertSupported(capabilities, 'rooms', 'rooms', kind);
      return toPortalRooms(await json('GET', '/portal/rooms'));
    },
    async roomMemories(roomId, params) {
      assertSupported(capabilities, 'rooms', 'roomMemories', kind);
      const query = { room_id: roomId, limit: params?.limit };
      return memoryRows(await json('GET', '/portal/rooms/memories', { query })).map(toMemory);
    },
    async exportJsonl() {
      throw new UnsupportedError('export', kind);
    },
    async importJsonl() {
      throw new UnsupportedError('import', kind);
    },
  };
}
