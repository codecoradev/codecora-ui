import type { MemoryClient } from './client.js';
import { MemoryError } from './errors.js';
import type { Memory, MemoryPatch, NewMemory, Room, TagCount } from './types.js';

export interface MemoryBrowserOptions {
  /** Rows per page and per search; defaults to 50. */
  pageSize?: number;
}

/** What the detail pane shows: the selected memory, its editor, or a new memory's editor. */
export type BrowserMode = 'view' | 'edit' | 'new';

const message = (cause: unknown) =>
  cause instanceof Error ? cause.message : 'Something went wrong';

/**
 * Shared state for MemoryList, MemoryDetail and MemoryEditor over one
 * `MemoryClient`. Filters combine: a query searches (one page; uteke-serve
 * matches words, and a search is not counted as a recall), a room lists that
 * room's memories, otherwise the list pages by tag. When a
 * room or a query is set, the other filters narrow those rows in the browser.
 * Capabilities decide which filters and actions exist at all.
 */
export class MemoryBrowser {
  readonly client: MemoryClient;
  readonly pageSize: number;

  query = $state('');
  tag = $state('');
  room = $state('');

  items = $state.raw<Memory[]>([]);
  /** Search scores by memory id; empty unless a query is set. */
  scores = $state.raw<Record<string, number>>({});
  loading = $state(false);
  /** The last failed load; actions throw to their caller instead. */
  error = $state<string | null>(null);
  hasMore = $state(false);

  tags = $state.raw<TagCount[]>([]);
  rooms = $state.raw<Room[]>([]);

  selectedId = $state<string | null>(null);
  mode = $state<BrowserMode>('view');

  readonly selected = $derived(this.items.find((m) => m.id === this.selectedId) ?? null);
  readonly filtered = $derived(this.query.trim() !== '' || this.tag !== '' || this.room !== '');

  /** Bumped per load so a slow answer never overwrites a newer one. */
  #request = 0;

  constructor(client: MemoryClient, options: MemoryBrowserOptions = {}) {
    this.client = client;
    this.pageSize = options.pageSize ?? 50;
  }

  get capabilities() {
    return this.client.capabilities;
  }

  /** Loads the first page for the current filters. */
  async load() {
    const request = ++this.#request;
    this.loading = true;
    this.error = null;
    try {
      const { items, scores, hasMore } = await this.#fetch(0);
      if (request !== this.#request) return;
      this.items = items;
      this.scores = scores;
      this.hasMore = hasMore;
    } catch (cause) {
      if (request !== this.#request) return;
      this.items = [];
      this.hasMore = false;
      this.error = message(cause);
    } finally {
      if (request === this.#request) this.loading = false;
    }
  }

  /** Appends the next page; only the plain and tag lists page. */
  async loadMore() {
    if (!this.hasMore || this.loading) return;
    const request = ++this.#request;
    this.loading = true;
    try {
      const { items, hasMore } = await this.#fetch(this.items.length);
      if (request !== this.#request) return;
      const seen = this.items.map((m) => m.id);
      this.items = [...this.items, ...items.filter((m) => !seen.includes(m.id))];
      this.hasMore = hasMore;
    } catch (cause) {
      if (request === this.#request) this.error = message(cause);
    } finally {
      if (request === this.#request) this.loading = false;
    }
  }

  /** Tags and rooms for the filter menus; a backend without them leaves the lists empty. */
  async loadFilters() {
    const { tags, rooms } = this.capabilities;
    const [tagList, roomList] = await Promise.all([
      tags ? this.client.tags().catch(() => []) : [],
      rooms ? this.client.rooms().catch(() => []) : [],
    ]);
    this.tags = [...tagList].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    this.rooms = roomList;
  }

  select(id: string | null) {
    this.selectedId = id;
    this.mode = 'view';
  }

  edit() {
    if (this.selected && this.capabilities.update) this.mode = 'edit';
  }

  create() {
    this.mode = 'new';
  }

  cancel() {
    this.mode = 'view';
  }

  async pin(id: string, pinned: boolean) {
    const memory = await this.client.pin(id, pinned);
    this.#replace(memory);
  }

  async update(id: string, patch: MemoryPatch) {
    await this.client.update(id, patch);
    this.#replace(await this.client.get(id));
    this.mode = 'view';
  }

  async remember(input: NewMemory) {
    const id = await this.client.remember(input);
    const memory = await this.client.get(id);
    this.items = [memory, ...this.items.filter((m) => m.id !== id)];
    this.selectedId = id;
    this.mode = 'view';
    return memory;
  }

  async forget(id: string) {
    await this.client.forget(id);
    const index = this.items.findIndex((m) => m.id === id);
    this.items = this.items.filter((m) => m.id !== id);
    if (this.selectedId === id) {
      // Keep the reader's place: the row that slid up takes the selection.
      this.selectedId = this.items[Math.min(index, this.items.length - 1)]?.id ?? null;
      this.mode = 'view';
    }
  }

  #replace(memory: Memory) {
    this.items = this.items.map((m) => (m.id === memory.id ? memory : m));
  }

  async #fetch(offset: number) {
    const limit = this.pageSize;
    const query = this.query.trim();
    const { tag, room } = this;

    if (query !== '') {
      if (!this.capabilities.search) {
        throw new MemoryError('This backend cannot search', 'unsupported');
      }
      const hits = await this.client.search(query, { limit });
      const roomIds = room ? await this.#roomIds(room) : null;
      const kept = hits.filter(
        (h) => (!tag || h.memory.tags.includes(tag)) && (!roomIds || roomIds.includes(h.memory.id)),
      );
      return {
        items: kept.map((h) => h.memory),
        scores: Object.fromEntries(kept.map((h) => [h.memory.id, h.score])),
        hasMore: false,
      };
    }

    if (room) {
      const rows = await this.client.roomMemories(room, { limit });
      return {
        items: tag ? rows.filter((m) => m.tags.includes(tag)) : rows,
        scores: {},
        hasMore: false,
      };
    }

    const rows = await this.client.list({ tag: tag || undefined, limit, offset });
    return { items: rows, scores: {}, hasMore: rows.length === limit };
  }

  async #roomIds(room: string) {
    const rows = await this.client.roomMemories(room, { limit: 500 });
    return rows.map((m) => m.id);
  }
}
