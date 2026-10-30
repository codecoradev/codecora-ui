import { capabilitiesFor, type BackendKind, type Capabilities } from './capabilities.js';
import type { DocsClient, MemoryClient } from './client.js';
import { MemoryError } from './errors.js';
import {
  compact,
  rows,
  toDoc,
  toHit,
  toImportResult,
  toMemory,
  toNamespaces,
  toRoom,
  toStats,
  toTags,
} from './normalize.js';
import { assertSupported } from './support.js';
import type { Doc, DocHit } from './types.js';

export interface HttpClientOptions {
  /** Server root, for example `http://127.0.0.1:8767` or a same-origin path such as `/api`. */
  baseUrl: string;
  /** "cloud" for Uteke Cloud; defaults to "uteke-serve". */
  kind?: Extract<BackendKind, 'uteke-serve' | 'cloud'>;
  /** Bearer token: the uteke-serve auth token or a Uteke Cloud API key. Never logged. */
  apiKey?: string;
  /** Use "include" for the Uteke Cloud portal session (cookie) instead of an API key. */
  credentials?: RequestCredentials;
  /** Extra headers on every request. */
  headers?: Record<string, string>;
  /** Replace fetch (tests, or a server-side fetch with your own agent). */
  fetch?: typeof fetch;
  /** Override the defaults for the backend kind. */
  capabilities?: Partial<Capabilities>;
}

/** Plain http is fine on this machine; anywhere else a Bearer key needs TLS. */
function isInsecureRemote(base: string): boolean {
  if (!/^http:\/\//i.test(base)) return false;
  try {
    const host = new URL(base).hostname.toLowerCase();
    return !(
      host === 'localhost' ||
      host.endsWith('.localhost') ||
      host === '127.0.0.1' ||
      host === '[::1]'
    );
  } catch {
    return true;
  }
}

type Query = Record<string, string | number | boolean | undefined>;

/**
 * Client for the uteke-serve REST API, which Uteke Cloud mirrors for the core
 * endpoints. Authentication is a Bearer token or the portal session cookie.
 */
export function createHttpClient(options: HttpClientOptions): MemoryClient {
  const kind = options.kind ?? 'uteke-serve';
  const capabilities: Capabilities = { ...capabilitiesFor(kind), ...options.capabilities };
  const base = options.baseUrl.replace(/\/+$/, '');
  if (options.apiKey && isInsecureRemote(base)) {
    throw new MemoryError(
      'baseUrl uses plain http for a remote host; the API key would travel unencrypted. Use https.',
      'invalid',
    );
  }
  const doFetch = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));

  async function send(
    method: string,
    path: string,
    opts: { query?: Query; body?: unknown } = {},
  ): Promise<Response> {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(opts.query ?? {})) {
      if (value !== undefined) search.set(key, String(value));
    }
    const qs = search.toString();
    const href = base + path + (qs ? `?${qs}` : '');
    // Headers is case-insensitive, so a caller's own "authorization" cannot sit next to ours.
    const headers = new Headers(options.headers);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    if (options.apiKey) headers.set('Authorization', `Bearer ${options.apiKey}`);
    if (opts.body !== undefined) headers.set('Content-Type', 'application/json');

    let response: Response;
    try {
      response = await doFetch(href, {
        method,
        headers,
        credentials: options.credentials,
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      });
    } catch (cause) {
      throw new MemoryError(
        `${method} ${path}: ${cause instanceof Error ? cause.message : 'network error'}`,
        'network',
      );
    }
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let message = text;
      try {
        const parsed = JSON.parse(text) as { error?: unknown };
        if (typeof parsed.error === 'string') message = parsed.error;
      } catch {
        // not JSON: keep the text
      }
      throw new MemoryError(
        `${method} ${path}: ${message || response.statusText}`,
        'http',
        response.status,
      );
    }
    return response;
  }

  /** JSON body, or undefined for an empty answer (204 or no content); bad JSON is a MemoryError. */
  const json = async <T = unknown>(
    method: string,
    path: string,
    opts?: { query?: Query; body?: unknown },
  ) => {
    const raw = await (await send(method, path, opts)).text();
    if (raw.trim() === '') return undefined as T;
    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new MemoryError(`${method} ${path}: the server did not answer with JSON`, 'invalid');
    }
  };
  const text = async (method: string, path: string, opts?: { query?: Query; body?: unknown }) =>
    (await send(method, path, opts)).text();

  const docs: DocsClient = {
    async list(params) {
      assertSupported(capabilities, 'documents', 'docs.list', kind);
      const list = rows(await json('POST', '/doc/list', { body: compact({ ...params }) }));
      return list.map(toDoc);
    },
    async get(slug) {
      assertSupported(capabilities, 'documents', 'docs.get', kind);
      return toDoc(await json('POST', '/doc/get', { body: { slug } }));
    },
    async create(input) {
      assertSupported(capabilities, 'documents', 'docs.create', kind);
      await json('POST', '/doc/create', { body: compact({ ...input }) });
      return toDoc(await json('POST', '/doc/get', { body: { slug: input.slug } }));
    },
    async update(slug, patch) {
      assertSupported(capabilities, 'documents', 'docs.update', kind);
      return toDoc(await json('POST', '/doc/update', { body: { slug, ...compact({ ...patch }) } }));
    },
    async delete(slug) {
      assertSupported(capabilities, 'documents', 'docs.delete', kind);
      await json('DELETE', '/doc/delete', { query: { slug } });
    },
    async search(query, params) {
      assertSupported(capabilities, 'documents', 'docs.search', kind);
      const found = rows(
        await json('POST', '/doc/search', { body: compact({ query, ...params }) }),
      );
      return found.map((row): DocHit => {
        const doc: Doc = toDoc((row.document ?? {}) as Record<string, unknown>);
        return {
          doc,
          snippet: typeof row.chunk_snippet === 'string' ? row.chunk_snippet : null,
          score: typeof row.score === 'number' ? row.score : 0,
        };
      });
    },
  };

  return {
    kind,
    capabilities,
    docs,
    health: () => json('GET', '/health'),
    async list(params) {
      return rows(await json('POST', '/list', { body: compact({ ...params }) })).map(toMemory);
    },
    async get(id) {
      return toMemory(await json('GET', '/memory', { query: { id } }));
    },
    async remember(input) {
      const body = compact({ ...input });
      const created = await json<{ id?: unknown }>('POST', '/remember', { body });
      if (typeof created?.id !== 'string') {
        throw new MemoryError('POST /remember: the server did not return an id', 'invalid');
      }
      return created.id;
    },
    async update(id, patch) {
      assertSupported(capabilities, 'update', 'update', kind);
      await json('PUT', '/memory', { body: { id, ...compact({ ...patch }) } });
    },
    async forget(id) {
      await json('DELETE', '/forget', { query: { id } });
    },
    async pin(id, pinned = true) {
      assertSupported(capabilities, 'pin', 'pin', kind);
      return toMemory(await json('POST', '/memory/pin', { body: { id, pinned } }));
    },
    async recall(query, params) {
      assertSupported(capabilities, 'recall', 'recall', kind);
      return rows(await json('POST', '/recall', { body: compact({ query, ...params }) })).map(
        toHit,
      );
    },
    async search(query, params) {
      assertSupported(capabilities, 'search', 'search', kind);
      return rows(await json('POST', '/search', { body: compact({ query, ...params }) })).map(
        toHit,
      );
    },
    async namespaces() {
      if (capabilities.namespaces === 'none') return [];
      return toNamespaces(await json('GET', '/namespaces', { query: { with_counts: true } }));
    },
    async tags(params) {
      assertSupported(capabilities, 'tags', 'tags', kind);
      return toTags(await json('GET', '/tags', { query: { namespace: params?.namespace } }));
    },
    async stats() {
      assertSupported(capabilities, 'stats', 'stats', kind);
      return toStats(await json('GET', '/stats'));
    },
    async rooms() {
      assertSupported(capabilities, 'rooms', 'rooms', kind);
      return rows(await json('GET', '/room/list')).map(toRoom);
    },
    async exportJsonl(params) {
      assertSupported(capabilities, 'export', 'export', kind);
      return text('GET', '/export', { query: { namespace: params?.namespace } });
    },
    async importJsonl(content, params) {
      assertSupported(capabilities, 'import', 'import', kind);
      return toImportResult(
        await json('POST', '/import', { body: compact({ content, ...params }) }),
      );
    },
  };
}
