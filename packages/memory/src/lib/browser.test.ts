import { describe, expect, it, vi } from 'vitest';
import { MemoryBrowser } from './browser.svelte.js';
import { createInMemoryClient } from './inmemory.js';

const seed = () =>
  createInMemoryClient({
    memories: [
      { id: 'a', content: 'Use bun workspaces', tags: ['project:ui', 'build'] },
      { id: 'b', content: 'Squash merge to develop', tags: ['project:ui', 'git'] },
      { id: 'c', content: 'Gaira uses Postgres', tags: ['project:gaira'] },
    ],
    rooms: [{ id: 'ui-room', title: 'UI', memoryIds: ['a', 'b'] }],
  });

describe('MemoryBrowser', () => {
  it('lists newest first and pages by tag', async () => {
    const browser = new MemoryBrowser(seed(), { pageSize: 2 });
    await browser.load();
    expect(browser.items.map((m) => m.id)).toEqual(['c', 'b']);
    expect(browser.hasMore).toBe(true);
    await browser.loadMore();
    expect(browser.items.map((m) => m.id)).toEqual(['c', 'b', 'a']);

    browser.tag = 'project:ui';
    await browser.load();
    expect(browser.items.map((m) => m.id)).toEqual(['b', 'a']);
  });

  it('searches with scores and narrows the hits by tag and room', async () => {
    const browser = new MemoryBrowser(seed());
    browser.query = 'workspaces';
    await browser.load();
    expect(browser.items.map((m) => m.id)).toEqual(['a']);
    expect(browser.scores.a).toBe(1);
    expect(browser.hasMore).toBe(false);

    browser.query = 'uses workspaces';
    browser.room = 'ui-room';
    await browser.load();
    expect(browser.items.map((m) => m.id)).toEqual(['a']);

    browser.query = 'develop workspaces';
    browser.room = '';
    browser.tag = 'git';
    await browser.load();
    expect(browser.items.map((m) => m.id)).toEqual(['b']);
  });

  it('lists a room and filters it by tag', async () => {
    const browser = new MemoryBrowser(seed());
    browser.room = 'ui-room';
    await browser.load();
    expect(browser.items.map((m) => m.id)).toEqual(['b', 'a']);
    browser.tag = 'git';
    await browser.load();
    expect(browser.items.map((m) => m.id)).toEqual(['b']);
  });

  it('loads tags by count and rooms, and leaves out what the backend lacks', async () => {
    const browser = new MemoryBrowser(seed());
    await browser.loadFilters();
    expect(browser.tags[0]).toEqual({ name: 'project:ui', count: 2 });
    expect(browser.rooms.map((r) => r.id)).toEqual(['ui-room']);

    const cloud = new MemoryBrowser(createInMemoryClient({ kind: 'cloud' }));
    await cloud.loadFilters();
    expect(cloud.rooms).toEqual([]);
  });

  it('keeps only the newest answer when loads overlap', async () => {
    const client = seed();
    let release!: () => void;
    const slow = new Promise<void>((resolve) => (release = resolve));
    const list = client.list.bind(client);
    client.list = vi.fn(async (params) => {
      await slow;
      return list(params);
    });
    const browser = new MemoryBrowser(client);
    const first = browser.load();
    browser.query = 'Postgres';
    await browser.load();
    release();
    await first;
    expect(browser.items.map((m) => m.id)).toEqual(['c']);
    expect(browser.loading).toBe(false);
  });

  it('reports a failed load and clears it on the next one', async () => {
    const client = seed();
    client.list = vi.fn().mockRejectedValueOnce(new Error('offline'));
    const browser = new MemoryBrowser(client);
    await browser.load();
    expect(browser.error).toBe('offline');
    client.list = vi.fn().mockResolvedValue([]);
    await browser.load();
    expect(browser.error).toBeNull();
  });

  it('creates, edits, pins and forgets, keeping the selection in place', async () => {
    const browser = new MemoryBrowser(seed());
    await browser.load();

    browser.create();
    const created = await browser.remember({ content: 'New note', tags: ['x'], type: 'decision' });
    expect(browser.items[0]!.id).toBe(created.id);
    expect(browser.selected?.memoryType).toBe('decision');
    expect(browser.mode).toBe('view');

    browser.edit();
    expect(browser.mode).toBe('edit');
    await browser.update(created.id, { content: 'Edited note' });
    expect(browser.selected?.content).toBe('Edited note');

    await browser.pin(created.id, true);
    expect(browser.selected?.pinned).toBe(true);

    browser.select('b');
    await browser.forget('b');
    expect(browser.items.some((m) => m.id === 'b')).toBe(false);
    expect(browser.selectedId).toBe('a');
  });

  it('does not start a new memory on a backend that cannot create one', () => {
    const browser = new MemoryBrowser(createInMemoryClient({ capabilities: { create: false } }));
    browser.create();
    expect(browser.mode).toBe('view');
  });

  it('does not enter edit mode on a backend without updates', async () => {
    const browser = new MemoryBrowser(
      createInMemoryClient({
        memories: [{ id: 'a', content: 'x' }],
        capabilities: { update: false },
      }),
    );
    await browser.load();
    browser.select('a');
    browser.edit();
    expect(browser.mode).toBe('view');
  });
});
