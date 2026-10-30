import { describe, expect, it } from 'vitest';
import type { MemoryClient } from './client.js';
import { MemoryError } from './errors.js';

/**
 * Behaviour every backend must share. Run it against a real server through a
 * factory that returns a connected client (see contract.test.ts).
 */
export function runContract(
  name: string,
  make: () => MemoryClient,
  options: { auth?: () => MemoryClient } = {},
) {
  describe(`contract: ${name}`, () => {
    const tag = `contract-${Math.random().toString(36).slice(2, 8)}`;
    let id = '';

    it('reports health', async () => {
      const health = await make().health();
      expect(health.status).toBe('ok');
    });

    it('remembers and gets a memory back', async () => {
      const client = make();
      id = await client.remember({
        content: `Contract memory about owls ${tag}`,
        tags: [tag, 'owl'],
        type: 'decision',
      });
      expect(id).toMatch(/^[0-9a-f-]{20,}$/);
      const memory = await client.get(id);
      expect(memory).toMatchObject({
        id,
        content: `Contract memory about owls ${tag}`,
        memoryType: 'decision',
        pinned: false,
      });
      expect(memory.tags).toEqual(expect.arrayContaining([tag, 'owl']));
      expect(memory.createdAt).not.toBe('');
    });

    it('lists by tag and respects the limit', async () => {
      const client = make();
      await client.remember({ content: `Second contract memory ${tag}`, tags: [tag] });
      expect((await client.list({ tag })).length).toBeGreaterThanOrEqual(2);
      expect(await client.list({ tag, limit: 1 })).toHaveLength(1);
    });

    it('updates content, tags and importance', async () => {
      const client = make();
      await client.update(id, {
        content: `Contract memory about owls ${tag} (edited)`,
        tags: [tag, 'edited'],
        importance: 0.9,
      });
      const memory = await client.get(id);
      expect(memory.content).toBe(`Contract memory about owls ${tag} (edited)`);
      expect(memory.tags).toEqual(expect.arrayContaining(['edited']));
      expect(memory.importance).toBeCloseTo(0.9);
    });

    it('pins and unpins', async () => {
      const client = make();
      expect((await client.pin(id, true)).pinned).toBe(true);
      expect((await client.pin(id, false)).pinned).toBe(false);
    });

    it('recalls and searches with scores', async () => {
      const client = make();
      const hits = await client.search(`owls ${tag}`, { limit: 5 });
      expect(hits.length).toBeGreaterThan(0);
      expect(hits[0]!.memory.id).not.toBe('');
      expect(typeof hits[0]!.score).toBe('number');
      expect((await client.recall('owls', { limit: 5 })).length).toBeGreaterThan(0);
    });

    it('lists namespaces, tags and stats', async () => {
      const client = make();
      expect((await client.tags()).find((t) => t.name === tag)?.count).toBeGreaterThanOrEqual(2);
      expect((await client.stats()).totalMemories).toBeGreaterThanOrEqual(2);
      if (client.capabilities.namespaces !== 'none') {
        expect((await client.namespaces()).some((n) => n.name === 'default')).toBe(true);
      }
    });

    it('creates, reads, updates, searches and deletes a document', async () => {
      const client = make();
      if (!client.capabilities.documents) return;
      const slug = `${tag}-doc`;
      const doc = await client.docs.create({
        slug,
        title: 'Contract doc',
        content: '# Contract\nowl notes',
      });
      expect(doc.slug).toBe(slug);
      expect((await client.docs.get(slug)).content).toContain('owl notes');
      expect((await client.docs.update(slug, { content: 'changed body' })).version).toBeGreaterThan(
        1,
      );
      expect((await client.docs.list()).some((d) => d.slug === slug)).toBe(true);
      expect((await client.docs.search('changed')).some((h) => h.doc.slug === slug)).toBe(true);
      await client.docs.delete(slug);
      expect((await client.docs.list()).some((d) => d.slug === slug)).toBe(false);
    });

    it('lists rooms when supported', async () => {
      const client = make();
      if (!client.capabilities.rooms) return;
      expect(Array.isArray(await client.rooms())).toBe(true);
    });

    it('exports and imports JSON lines', async () => {
      const client = make();
      if (!client.capabilities.export) return;
      expect(await client.exportJsonl()).toContain(`Second contract memory ${tag}`);
      const result = await client.importJsonl(
        JSON.stringify({ content: `Imported by the contract ${tag}`, tags: [tag, `imp-${tag}`] }),
      );
      expect(result.imported).toBe(1);
      expect(
        (await client.list({ tag: `imp-${tag}` })).some(
          (m) => m.content === `Imported by the contract ${tag}`,
        ),
      ).toBe(true);
    });

    it('fails with a MemoryError that carries the server message', async () => {
      const client = make();
      await expect(client.get('not-a-uuid')).rejects.toMatchObject({
        name: 'MemoryError',
        code: 'http',
        status: 400,
      });
      await expect(client.get('not-a-uuid')).rejects.toBeInstanceOf(MemoryError);
    });

    it('forgets a memory so it no longer lists', async () => {
      const client = make();
      await client.forget(id);
      expect((await client.list({ tag, limit: 100 })).some((m) => m.id === id)).toBe(false);
    });

    if (options.auth) {
      it('rejects a missing or wrong key with 401', async () => {
        await expect(options.auth!().stats()).rejects.toMatchObject({ code: 'http', status: 401 });
      });
    }
  });
}
