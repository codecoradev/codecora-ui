// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { UnsupportedError } from './errors.js';
import { createTauriClient, type Invoke } from './tauri.js';

const row = { id: 'abc', content: 'hello', tags: ['a'], namespace: 'default', memory_type: 'fact' };

function fake(table: Record<string, unknown>) {
  return vi.fn(async (command: string) => {
    if (!(command in table)) throw new Error(`unexpected command ${command}`);
    return table[command];
  }) as unknown as Invoke & ReturnType<typeof vi.fn>;
}

describe('Tauri client', () => {
  it('maps the core operations onto the desktop commands', async () => {
    const invoke = fake({
      list: [row],
      get_memory: row,
      remember: 'new-id',
      memory_update: undefined,
      forget: undefined,
      recall: [{ id: 'abc', content: 'hello', tags: [], score: 0.5 }],
      stats: { total_memories: 3, unique_tags: 1, db_size_bytes: 10 },
      list_tags: [{ name: 'a', count: 1 }],
      uteke_namespaces_breakdown: [{ name: 'default', count: 3 }],
      uteke_rooms: [{ id: 'r', title: 'Room', namespace: 'default' }],
    });
    const client = createTauriClient({ invoke });

    expect((await client.list({ tag: 'a', limit: 5 }))[0]!.id).toBe('abc');
    expect(invoke).toHaveBeenCalledWith('list', {
      namespace: null,
      tag: 'a',
      limit: 5,
      offset: null,
    });

    expect(await client.remember({ content: 'x', type: 'decision', author: 'human' })).toBe(
      'new-id',
    );
    expect(invoke).toHaveBeenCalledWith('remember', {
      content: 'x',
      tags: [],
      namespace: null,
      memoryType: 'decision',
      metadata: { author: 'human' },
    });

    await client.update('abc', { content: 'y' });
    expect(invoke).toHaveBeenCalledWith('memory_update', { id: 'abc', content: 'y' });
    await client.forget('abc');
    expect(invoke).toHaveBeenCalledWith('forget', { id: 'abc' });

    const hits = await client.recall('q');
    expect(hits[0]).toMatchObject({ score: 0.5, memory: { id: 'abc', memoryType: 'fact' } });
    expect((await client.stats()).totalMemories).toBe(3);
    expect((await client.tags())[0]!.count).toBe(1);
    expect((await client.namespaces())[0]!.name).toBe('default');
    expect((await client.rooms())[0]!.title).toBe('Room');
  });

  it('keeps the author when metadata is given too', async () => {
    const invoke = fake({ remember: 'id' });
    await createTauriClient({ invoke }).remember({
      content: 'x',
      metadata: { source: 'ui' },
      author: 'human',
    });
    expect(invoke).toHaveBeenCalledWith(
      'remember',
      expect.objectContaining({ metadata: { source: 'ui', author: 'human' } }),
    );
  });

  it('pins through memory_update and reads the memory back', async () => {
    const invoke = fake({ memory_update: undefined, get_memory: { ...row, pinned: true } });
    expect((await createTauriClient({ invoke }).pin('abc')).pinned).toBe(true);
    expect(invoke).toHaveBeenCalledWith('memory_update', { id: 'abc', pinned: true });
  });

  it('reports export and import as unsupported', async () => {
    const client = createTauriClient({ invoke: fake({}) });
    expect(client.capabilities).toMatchObject({ export: false, import: false, graph: false });
    await expect(client.exportJsonl()).rejects.toBeInstanceOf(UnsupportedError);
    await expect(client.importJsonl('{}')).rejects.toBeInstanceOf(UnsupportedError);
  });
});

describe('Tauri client capabilities', () => {
  it('export and import stay off even when an override asks for them', async () => {
    const client = createTauriClient({
      invoke: fake({}),
      capabilities: { export: true, import: true },
    });
    expect(client.capabilities).toMatchObject({ export: false, import: false });
    await expect(client.exportJsonl()).rejects.toBeInstanceOf(UnsupportedError);
  });

  it('namespaces answer no rows when the capability is none, without calling the desktop', async () => {
    const invoke = fake({});
    const client = createTauriClient({ invoke, capabilities: { namespaces: 'none' } });
    expect(await client.namespaces()).toEqual([]);
    expect(invoke).not.toHaveBeenCalled();
  });
});
