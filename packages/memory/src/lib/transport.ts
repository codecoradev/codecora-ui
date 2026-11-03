import { MemoryError } from './errors.js';

export type Query = Record<string, string | number | boolean | undefined>;

export interface RequesterOptions {
  /** Server root, for example `http://127.0.0.1:8767` or a same-origin path such as `/api`. */
  baseUrl: string;
  /** Bearer token. Never logged; only ever sent in the `Authorization` header. */
  apiKey?: string;
  /** Use "include" or "same-origin" to send the session cookie. */
  credentials?: RequestCredentials;
  /** Extra headers on every request. */
  headers?: Record<string, string>;
  /** Replace fetch (tests, or a server-side fetch with your own agent). */
  fetch?: typeof fetch;
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

/** What a server says went wrong: uteke-serve sends `{error}`, Uteke Cloud `{error, message}`. */
function failureMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: unknown; message?: unknown };
    if (typeof parsed.message === 'string') return parsed.message;
    if (typeof parsed.error === 'string') return parsed.error;
  } catch {
    // not JSON: keep the text
  }
  return body;
}

/**
 * The request plumbing both HTTP transports share: base URL, Bearer key (refused
 * over plain http to a remote host), cookies, JSON bodies and `MemoryError`s.
 */
export function createRequester(options: RequesterOptions) {
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
      const body = await response.text().catch(() => '');
      throw new MemoryError(
        `${method} ${path}: ${failureMessage(body) || response.statusText}`,
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

  return { json, text };
}
