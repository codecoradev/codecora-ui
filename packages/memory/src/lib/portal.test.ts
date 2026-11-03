// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { MemoryError, UnsupportedError } from './errors.js';
import { createPortalClient } from './portal.js';

type Handler = (url: URL, init: RequestInit) => unknown;

/** Answers like the Uteke Cloud portal routes (shapes read from uteke-cloud, contract 0.38). */
function mockFetch(handler: Handler, status = 200) {
  return vi.fn(async (href: string | URL | Request, init: RequestInit = {}) => {
    const url = new URL(String(href), 'https://uteke.app');
    const result = handler(url, init);
    const body = typeof result === 'string' ? result : JSON.stringify(result);
    return new Response(status === 204 ? null : body, {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

const row = {
  id: 'abc',
  content: 'hello',
  tags: ['a'],
  namespace: 'default',
  memory_type: 'decision',
  importance: 0.7,
  pinned: false,
  author: 'claude-code',
  created_at: '2026-11-01T00:00:00Z',
  updated_at: '2026-11-01T00:00:00Z',
};

const client = (handler: Handler, status?: number) => {
  const fetch = mockFetch(handler, status);
  return { fetch, client: createPortalClient({ baseUrl: '/api/v2', fetch }) };
};

const calls = (fetch: ReturnType<typeof mockFetch>) =>
  fetch.mock.calls.map(([href, init]) => `${(init as RequestInit).method} ${String(href)}`);

describe('portal client reads', () => {
  it('lists memories from the { memories, total } envelope with the session cookie', async () => {
    const { fetch, client: portal } = client(() => ({
      memories: [row],
      total: 1,
      has_more: false,
      next_offset: null,
    }));
    const memories = await portal.list({ limit: 20, offset: 40, tag: 'a', namespace: 'ignored' });
    expect(memories[0]).toMatchObject({ id: 'abc', memoryType: 'decision', tags: ['a'] });
    expect(calls(fetch)).toEqual(['GET /api/v2/portal/memories?limit=20&offset=40&tag=a']);
    const init = fetch.mock.calls[0]![1] as RequestInit;
    expect(init.credentials).toBe('same-origin');
    expect(new Headers(init.headers).has('Authorization')).toBe(false);
  });

  it('opens one memory from { memory, rooms, provenance }, encoding the id', async () => {
    const { fetch, client: portal } = client(() => ({ memory: row, rooms: [], provenance: {} }));
    expect((await portal.get('a/b c')).content).toBe('hello');
    expect(calls(fetch)).toEqual(['GET /api/v2/portal/memories/a%2Fb%20c']);
  });

  it('searches by keyword and recalls by meaning through one route', async () => {
    const { fetch, client: portal } = client((_url, init) => {
      const body = JSON.parse(init.body as string) as { mode: string };
      // Keyword hits are flat memories; meaning hits come with a score.
      return {
        memories: body.mode === 'keyword' ? [row] : [{ memory: row, score: 0.42 }],
      };
    });
    const keyword = await portal.search('owls', { limit: 5 });
    expect(keyword[0]).toMatchObject({ score: 0, memory: { id: 'abc' } });
    const meaning = await portal.recall('owls');
    expect(meaning[0]).toMatchObject({ score: 0.42, memory: { id: 'abc' } });
    const [first, second] = fetch.mock.calls.map(([, init]) =>
      JSON.parse((init as RequestInit).body as string),
    );
    expect(first).toEqual({ query: 'owls', mode: 'keyword', limit: 5 });
    expect(second).toEqual({ query: 'owls', mode: 'meaning' });
    expect(calls(fetch)).toEqual([
      'POST /api/v2/portal/memories/search',
      'POST /api/v2/portal/memories/search',
    ]);
  });

  it('takes tags from the facets and stats from the overview', async () => {
    const { client: portal } = client((url) =>
      url.pathname.endsWith('/facets')
        ? {
            types: [],
            tags: [
              { tag: 'a', count: 3 },
              { tag: 'b', count: 1 },
            ],
            rooms: [],
            authors: [],
          }
        : { storage: { bytes: 2048, memories: 4, documents: 1 }, plan: 'free' },
    );
    expect(await portal.tags()).toEqual([
      { name: 'a', count: 3 },
      { name: 'b', count: 1 },
    ]);
    expect(await portal.stats()).toEqual({ totalMemories: 4, uniqueTags: 2, dbSizeBytes: 2048 });
    expect(await portal.health()).toEqual({ status: 'ok', memories: 4 });
  });

  it('lists rooms from { rooms } and reads a room as { memories }', async () => {
    const { fetch, client: portal } = client((url) =>
      url.pathname.endsWith('/rooms')
        ? {
            rooms: [
              {
                room_id: 'atlas',
                title: 'Atlas',
                description: null,
                created_at: '2026-11-01T00:00:00Z',
                memory_count: 3,
              },
            ],
            truncated: false,
          }
        : { memories: [row] },
    );
    expect(await portal.rooms()).toEqual([
      {
        id: 'atlas',
        title: 'Atlas',
        namespace: 'default',
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: null,
      },
    ]);
    expect((await portal.roomMemories('atlas', { limit: 10 }))[0]!.id).toBe('abc');
    expect(calls(fetch)).toEqual([
      'GET /api/v2/portal/rooms',
      'GET /api/v2/portal/rooms/memories?room_id=atlas&limit=10',
    ]);
  });

  it('has no namespaces to list', async () => {
    const { fetch, client: portal } = client(() => []);
    expect(await portal.namespaces()).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('portal client writes', () => {
  it('edits with PATCH, dropping undefined fields, and forgets with DELETE', async () => {
    const { fetch, client: portal } = client(() => '');
    await portal.update('abc', { content: 'new', tags: undefined, importance: 0.9 });
    await portal.forget('abc');
    expect(calls(fetch)).toEqual([
      'PATCH /api/v2/portal/memories/abc',
      'DELETE /api/v2/portal/memories/abc',
    ]);
    expect(JSON.parse((fetch.mock.calls[0]![1] as RequestInit).body as string)).toEqual({
      content: 'new',
      importance: 0.9,
    });
  });

  it('pins and unpins through their own routes and reads the memory back', async () => {
    const { fetch, client: portal } = client((url) =>
      url.pathname.endsWith('/pin') || url.pathname.endsWith('/unpin')
        ? ''
        : { memory: { ...row, pinned: true } },
    );
    expect((await portal.pin('abc')).pinned).toBe(true);
    await portal.pin('abc', false);
    expect(calls(fetch)).toEqual([
      'POST /api/v2/portal/memories/abc/pin',
      'GET /api/v2/portal/memories/abc',
      'POST /api/v2/portal/memories/abc/unpin',
      'GET /api/v2/portal/memories/abc',
    ]);
  });

  it('cannot create memories, documents, exports or imports, whatever the overrides say', async () => {
    const fetch = mockFetch(() => []);
    const portal = createPortalClient({
      baseUrl: '/api/v2',
      fetch,
      capabilities: { create: true, documents: true, export: true, import: true },
    });
    expect(portal.capabilities).toMatchObject({
      create: false,
      documents: false,
      export: false,
      import: false,
      rooms: true,
      namespaces: 'deprecated',
    });
    await expect(portal.remember({ content: 'x' })).rejects.toBeInstanceOf(UnsupportedError);
    await expect(portal.docs.list()).rejects.toBeInstanceOf(UnsupportedError);
    await expect(portal.exportJsonl()).rejects.toBeInstanceOf(UnsupportedError);
    await expect(portal.importJsonl('{}')).rejects.toBeInstanceOf(UnsupportedError);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('portal client errors and keys', () => {
  it('reports a signed-out session as a 401 MemoryError', async () => {
    const { client: portal } = client(
      () => ({ error: 'unauthorized', message: 'sign in to the portal' }),
      401,
    );
    await expect(portal.list()).rejects.toMatchObject({
      code: 'http',
      status: 401,
      message: expect.stringContaining('sign in to the portal'),
    });
  });

  it('reports a refused cross-site write with the server message', async () => {
    const { client: portal } = client(
      () => ({ error: 'csrf_failed', message: 'cross-site portal request refused' }),
      403,
    );
    await expect(portal.forget('abc')).rejects.toMatchObject({
      status: 403,
      message: expect.stringContaining('cross-site portal request refused'),
    });
  });

  it('sends a portal bearer instead of the cookie, and refuses it over plain http', async () => {
    const fetch = mockFetch(() => ({ memories: [] }));
    await createPortalClient({
      baseUrl: 'https://uteke.app/api/v2',
      bearer: 'secret',
      fetch,
    }).list();
    const headers = new Headers((fetch.mock.calls[0]![1] as RequestInit).headers);
    expect(headers.get('Authorization')).toBe('Bearer secret');

    expect(() =>
      createPortalClient({ baseUrl: 'http://uteke.example/api/v2', bearer: 'secret', fetch }),
    ).toThrow(MemoryError);
  });
});
