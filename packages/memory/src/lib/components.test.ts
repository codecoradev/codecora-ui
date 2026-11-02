import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { MemoryBrowser } from './browser.svelte.js';
import { createInMemoryClient } from './inmemory.js';
import MemoryDetail from './MemoryDetail.svelte';
import MemoryEditor from './MemoryEditor.svelte';
import MemoryList from './MemoryList.svelte';
import type { BackendKind } from './capabilities.js';

const browserFor = (kind: BackendKind = 'uteke-serve') =>
  new MemoryBrowser(
    createInMemoryClient({
      kind,
      memories: [
        { id: 'a', content: 'Use bun workspaces', tags: ['project:ui'] },
        { id: 'b', content: 'Squash merge to develop', tags: ['project:ui', 'git'], pinned: true },
      ],
      rooms: [{ id: 'ui-room', title: 'UI', memoryIds: ['a'] }],
    }),
  );

describe('MemoryList', () => {
  it('loads on mount, counts the rows and selects one on click', async () => {
    const browser = browserFor();
    render(MemoryList, { browser });
    const list = await screen.findByRole('list', { name: 'Memories' });
    const rows = within(list).getAllByRole('button');
    expect(rows).toHaveLength(2);
    expect(screen.getByRole('status')).toHaveTextContent('2 memories');
    expect(within(rows[0]!).getByText('Pinned')).toBeInTheDocument();

    await fireEvent.click(rows[1]!);
    expect(browser.selectedId).toBe('a');
    await waitFor(() => expect(rows[1]).toHaveAttribute('aria-current', 'true'));
  });

  it('has one tab stop and moves between rows with the arrow keys', async () => {
    render(MemoryList, { browser: browserFor() });
    const list = await screen.findByRole('list', { name: 'Memories' });
    const [first, second] = within(list).getAllByRole('button');
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    first!.focus();
    await fireEvent.keyDown(first!, { key: 'ArrowDown' });
    expect(second).toHaveFocus();
    await fireEvent.keyDown(second!, { key: 'Home' });
    expect(first).toHaveFocus();
  });

  it('searches after the debounce and offers to clear filters when nothing matches', async () => {
    const browser = browserFor();
    render(MemoryList, { browser, debounce: 0 });
    await screen.findByRole('list', { name: 'Memories' });
    await fireEvent.input(screen.getByRole('searchbox', { name: 'Search memories' }), {
      target: { value: 'nothing-like-this' },
    });
    expect(await screen.findByText('No memories match')).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByRole('list', { name: 'Memories' })).toBeInTheDocument();
    expect(browser.query).toBe('');
  });

  it('shows the tag and room filters only when the backend has them', async () => {
    const { unmount } = render(MemoryList, { browser: browserFor() });
    expect(await screen.findByRole('combobox', { name: 'Filter by tag' })).toBeInTheDocument();
    expect(await screen.findByRole('combobox', { name: 'Filter by room' })).toBeInTheDocument();
    unmount();

    render(MemoryList, { browser: browserFor('cloud') });
    expect(await screen.findByRole('combobox', { name: 'Filter by tag' })).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Filter by room' })).toBeNull();
  });

  it('reports a failed load with a retry', async () => {
    const browser = browserFor();
    vi.spyOn(browser.client, 'list').mockRejectedValueOnce(new Error('offline'));
    render(MemoryList, { browser });
    expect(await screen.findByRole('alert')).toHaveTextContent('offline');
    await fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('list', { name: 'Memories' })).toBeInTheDocument();
  });

  it('invites the first memory when there are none', async () => {
    const browser = new MemoryBrowser(createInMemoryClient());
    render(MemoryList, { browser });
    expect(await screen.findByText('No memories yet')).toBeInTheDocument();
    await fireEvent.click(screen.getAllByRole('button', { name: 'New memory' })[1]!);
    expect(browser.mode).toBe('new');
  });
});

describe('MemoryDetail', () => {
  async function selected(kind: BackendKind = 'uteke-serve') {
    const browser = browserFor(kind);
    await browser.load();
    browser.select('b');
    render(MemoryDetail, { browser });
    return browser;
  }

  it('asks for a selection first', () => {
    render(MemoryDetail, { browser: browserFor() });
    expect(screen.getByText('No memory selected')).toBeInTheDocument();
  });

  it('shows the memory and unpins it', async () => {
    const browser = await selected();
    expect(screen.getByRole('heading', { name: /fact/i })).toBeInTheDocument();
    expect(screen.getByText('Squash merge to develop')).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Tags' })).getAllByRole('listitem'),
    ).toHaveLength(2);
    await fireEvent.click(screen.getByRole('button', { name: 'Unpin' }));
    await waitFor(() => expect(browser.selected?.pinned).toBe(false));
    expect(await screen.findByRole('button', { name: 'Pin' })).toBeInTheDocument();
  });

  it('edits in place and saves', async () => {
    const browser = await selected();
    await fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    const content = await screen.findByRole('textbox', { name: /content/i });
    expect(content).toHaveValue('Squash merge to develop');
    await fireEvent.input(content, { target: { value: 'Squash merge, always' } });
    await fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(browser.selected?.content).toBe('Squash merge, always'));
    expect(browser.mode).toBe('view');
  });

  it('deletes after confirming', async () => {
    const browser = await selected();
    await fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this memory?' });
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Delete memory' }));
    await waitFor(() => expect(browser.items.some((m) => m.id === 'b')).toBe(false));
  });

  it('hides the namespace where namespaces are deprecated', async () => {
    await selected('cloud');
    expect(screen.queryByText('Namespace')).toBeNull();
  });
});

describe('MemoryEditor', () => {
  it('requires content and hands back clean tags and the type', async () => {
    const onsave = vi.fn();
    render(MemoryEditor, { onsave });
    await fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    expect(onsave).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /content/i })).toHaveAccessibleDescription(
      /Write what the memory should hold\./,
    );

    await fireEvent.input(screen.getByRole('textbox', { name: /content/i }), {
      target: { value: '  Ship on Fridays  ' },
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /tags/i }), {
      target: { value: 'ops, , ops,release' },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    await waitFor(() =>
      expect(onsave).toHaveBeenCalledWith({
        content: 'Ship on Fridays',
        tags: ['ops', 'release'],
        type: 'fact',
      }),
    );
  });

  it('shows a failed save in the form', async () => {
    render(MemoryEditor, {
      onsave: () => Promise.reject(new Error('server said no')),
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /content/i }), {
      target: { value: 'x' },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('server said no');
  });
});
