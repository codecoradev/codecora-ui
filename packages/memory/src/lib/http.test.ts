// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { capabilitiesFor } from './capabilities.js';
import { MemoryError, UnsupportedError } from './errors.js';
import { createHttpClient } from './http.js';
import { toMemory } from './normalize.js';

function mockFetch(handler: (url: URL, init: RequestInit) => unknown, status = 200) {
  return vi.fn(async (href: string | URL | Request, init: RequestInit = {}) => {
    const url = new URL(String(href), 'http://test.local');
    const result = handler(url, init);
    const body = typeof result === 'string' ? result : JSON.stringify(result);
    return new Response(status === 204 ? null : body, {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

const raw = {
  id: 'abc',
  content: 'hello',
  tags: ['a'],
  namespace: 'default',
  memory_type: 'decision',
  importance: 0.7,
  pinned: true,
  metadata: { author: 'human' },
  created_at: '2026-10-30T00:00:00Z',
  updated_at: '2026-10-30T00:00:00Z',
};

describe('HTTP client requests', () => {
  it('sends the bearer key and a JSON body, dropping undefined fields', async () => {
    const fetch = mockFetch(() => ({ id: 'new' }));
    const client = createHttpClient({ baseUrl: 'http://srv:8767/', apiKey: 'secret', fetch });
    const id = await client.remember({
      content: 'x',
      tags: ['t'],
      namespace: undefined,
      type: 'fact',
    });
    expect(id).toBe('new');
    const [href, init] = fetch.mock.calls[0]!;
    expect(href).toBe('http://srv:8767/remember');
    expect((init as RequestInit).method).toBe('POST');
    const headers = new Headers((init as RequestInit).headers);
    expect(headers.get('Authorization')).toBe('Bearer secret');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      content: 'x',
      tags: ['t'],
      type: 'fact',
    });
  });

  it('builds query strings and skips undefined values', async () => {
    const fetch = mockFetch(() => [{ name: 'a', count: 2 }]);
    const client = createHttpClient({ baseUrl: 'http://srv', fetch });
    await client.tags({ namespace: 'work' });
    await client.tags();
    expect(fetch.mock.calls[0]![0]).toBe('http://srv/tags?namespace=work');
    expect(fetch.mock.calls[1]![0]).toBe('http://srv/tags');
  });

  it('works with a same-origin base path and the portal session cookie', async () => {
    const fetch = mockFetch(() => [raw]);
    const client = createHttpClient({
      baseUrl: '/api/memory',
      kind: 'cloud',
      credentials: 'include',
      fetch,
    });
    const rows = await client.list({ tag: 'a', limit: 5 });
    expect(rows[0]!.id).toBe('abc');
    const [href, init] = fetch.mock.calls[0]!;
    expect(href).toBe('/api/memory/list');
    expect((init as RequestInit).credentials).toBe('include');
    expect(new Headers((init as RequestInit).headers).has('Authorization')).toBe(false);
  });

  it('never puts the key in the URL', async () => {
    const fetch = mockFetch(() => raw);
    await createHttpClient({ baseUrl: 'http://srv', apiKey: 'k-123', fetch }).get('abc');
    expect(String(fetch.mock.calls[0]![0])).not.toContain('k-123');
  });

  it('sends update fields by id and leaves absent ones out', async () => {
    const fetch = mockFetch(() => ({ updated: 'abc' }));
    await createHttpClient({ baseUrl: 'http://srv', fetch }).update('abc', {
      content: 'new',
      importance: 0.9,
    });
    const [href, init] = fetch.mock.calls[0]!;
    expect(href).toBe('http://srv/memory');
    expect((init as RequestInit).method).toBe('PUT');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      id: 'abc',
      content: 'new',
      importance: 0.9,
    });
  });

  it('turns recall rows into hits with scores', async () => {
    const fetch = mockFetch(() => [{ memory: raw, score: 0.42 }]);
    const hits = await createHttpClient({ baseUrl: 'http://srv', fetch }).recall('q', { limit: 3 });
    expect(hits).toEqual([{ memory: toMemory(raw), score: 0.42 }]);
  });
});

describe('HTTP client errors', () => {
  it('uses the server error message and status', async () => {
    const fetch = mockFetch(() => ({ error: 'Invalid UUID format: zzz' }), 400);
    const error = await createHttpClient({ baseUrl: 'http://srv', fetch })
      .get('zzz')
      .catch((e) => e);
    expect(error).toBeInstanceOf(MemoryError);
    expect(error).toMatchObject({ code: 'http', status: 400 });
    expect(error.message).toContain('Invalid UUID format: zzz');
  });

  it('keeps plain-text errors', async () => {
    const fetch = vi.fn(
      async () => new Response('gateway down', { status: 502 }),
    ) as unknown as typeof globalThis.fetch;
    await expect(createHttpClient({ baseUrl: 'http://srv', fetch }).stats()).rejects.toMatchObject({
      status: 502,
      message: expect.stringContaining('gateway down'),
    });
  });

  it('wraps a network failure', async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError('fetch failed');
    }) as unknown as typeof globalThis.fetch;
    await expect(createHttpClient({ baseUrl: 'http://srv', fetch }).stats()).rejects.toMatchObject({
      code: 'network',
      status: 0,
    });
  });
});

describe('capabilities', () => {
  it('Uteke Cloud has no rooms, graph, lifecycle, dream or orphans and deprecated namespaces', () => {
    const cloud = capabilitiesFor('cloud');
    expect(cloud).toMatchObject({
      rooms: false,
      graph: false,
      lifecycle: false,
      dream: false,
      orphans: false,
      namespaces: 'deprecated',
      documents: true,
      recall: true,
    });
    expect(capabilitiesFor('uteke-serve')).toMatchObject({
      rooms: true,
      graph: true,
      namespaces: 'full',
    });
  });

  it('a missing capability throws UnsupportedError before any request', async () => {
    const fetch = mockFetch(() => []);
    const client = createHttpClient({ baseUrl: 'http://srv', kind: 'cloud', fetch });
    await expect(client.rooms()).rejects.toBeInstanceOf(UnsupportedError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('options can override the defaults', async () => {
    const client = createHttpClient({
      baseUrl: 'http://srv',
      kind: 'cloud',
      capabilities: { rooms: true },
      fetch: mockFetch(() => []),
    });
    expect(client.capabilities.rooms).toBe(true);
    expect(await client.rooms()).toEqual([]);
  });

  it('plain-name namespaces from older servers still normalise', async () => {
    const client = createHttpClient({
      baseUrl: 'http://srv',
      fetch: mockFetch(() => ['default', 'work']),
    });
    expect(await client.namespaces()).toEqual([
      { name: 'default', count: 0, active: 0, deprecated: 0 },
      { name: 'work', count: 0, active: 0, deprecated: 0 },
    ]);
  });
});

describe('normalisers', () => {
  it('fills defaults for missing fields', () => {
    expect(toMemory({ id: 'x', content: 'y' })).toMatchObject({
      namespace: 'default',
      memoryType: 'fact',
      importance: 0.5,
      pinned: false,
      tags: [],
      metadata: null,
    });
  });
});

describe('empty and malformed answers', () => {
  it('treats a 204 or empty body as undefined instead of throwing', async () => {
    const fetch = vi.fn(
      async () => new Response(null, { status: 204 }),
    ) as unknown as typeof globalThis.fetch;
    const client = createHttpClient({ baseUrl: 'http://srv', fetch });
    await expect(client.forget('abc')).resolves.toBeUndefined();
    await expect(client.update('abc', { content: 'x' })).resolves.toBeUndefined();
  });

  it('reports a non-JSON success body as a MemoryError', async () => {
    const fetch = vi.fn(
      async () => new Response('<html>oops</html>', { status: 200 }),
    ) as unknown as typeof globalThis.fetch;
    await expect(createHttpClient({ baseUrl: 'http://srv', fetch }).stats()).rejects.toMatchObject({
      code: 'invalid',
    });
  });
});

describe('answers that are not lists', () => {
  it('returns no rows for an empty or odd list answer', async () => {
    const empty = vi.fn(
      async () => new Response(null, { status: 204 }),
    ) as unknown as typeof globalThis.fetch;
    const client = createHttpClient({ baseUrl: 'http://srv', fetch: empty });
    expect(await client.list()).toEqual([]);
    expect(await client.search('q')).toEqual([]);
    expect(await client.docs.list()).toEqual([]);
    expect(await client.rooms()).toEqual([]);
  });

  it('remember fails with a MemoryError when the server returns no id', async () => {
    const empty = vi.fn(
      async () => new Response('{}', { status: 200 }),
    ) as unknown as typeof globalThis.fetch;
    await expect(
      createHttpClient({ baseUrl: 'http://srv', fetch: empty }).remember({ content: 'x' }),
    ).rejects.toMatchObject({ code: 'invalid' });
  });

  it('docs.create reads the document back by the slug it was given', async () => {
    const fetch = mockFetch((url) =>
      url.pathname === '/doc/get' ? { id: '1', slug: 'd', title: 'D', content: 'c' } : {},
    );
    const doc = await createHttpClient({ baseUrl: 'http://srv', fetch }).docs.create({
      slug: 'd',
      content: 'c',
    });
    expect(doc.slug).toBe('d');
    expect(JSON.parse((fetch.mock.calls[1]![1] as RequestInit).body as string)).toEqual({
      slug: 'd',
    });
  });
});

describe('headers', () => {
  it('a caller header in another case cannot sit next to the key', async () => {
    const fetch = mockFetch(() => ({}));
    await createHttpClient({
      baseUrl: 'http://srv',
      apiKey: 'real',
      headers: { authorization: 'Bearer stale', 'X-Trace': '1' },
      fetch,
    }).stats();
    const headers = new Headers((fetch.mock.calls[0]![1] as RequestInit).headers);
    expect(headers.get('authorization')).toBe('Bearer real');
    expect(headers.get('x-trace')).toBe('1');
  });

  it('keeps a base path that merely starts with http', async () => {
    const fetch = mockFetch(() => ({}));
    await createHttpClient({ baseUrl: '/httpproxy/api', fetch }).stats();
    expect(fetch.mock.calls[0]![0]).toBe('/httpproxy/api/stats');
  });
});
