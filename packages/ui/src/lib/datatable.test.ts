import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { createRawSnippet, type Component } from 'svelte';
import { describe, expect, it } from 'vitest';
import DataTable from './DataTable.svelte';

interface Key {
  id: string;
  name: string;
  calls: number;
}

const rows: Key[] = [
  { id: '1', name: 'staging-bot', calls: 411 },
  { id: '2', name: 'ci-deploy', calls: 12840 },
  { id: '3', name: 'dashboard', calls: 3112 },
  { id: '4', name: 'old-importer', calls: 0 },
  { id: '5', name: 'zeta', calls: 7 },
];
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'calls', label: 'Calls', sortable: true, numeric: true },
];
const base = { label: 'API keys', columns, rows, rowKey: (row: Key) => row.id };

// DataTable is generic; the tests only need it as a component taking plain props.
const Table = DataTable as unknown as Component<Record<string, unknown>>;
const view = (props: Record<string, unknown> = {}) => render(Table, { ...base, ...props });

const names = () =>
  screen
    .getAllByRole('rowheader')
    .map((cell) => cell.textContent?.trim())
    .filter(Boolean);

describe('DataTable sorting', () => {
  it('cycles ascending, descending and unsorted, marking aria-sort', async () => {
    view();
    const header = screen.getByRole('columnheader', { name: /Name/ });
    expect(header).not.toHaveAttribute('aria-sort');
    await fireEvent.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(names()[0]).toBe('ci-deploy');
    await fireEvent.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(names()[0]).toBe('zeta');
    await fireEvent.click(within(header).getByRole('button'));
    expect(header).not.toHaveAttribute('aria-sort');
    expect(names()[0]).toBe('staging-bot');
  });

  it('sorts numbers as numbers', async () => {
    view();
    await fireEvent.click(
      within(screen.getByRole('columnheader', { name: /Calls/ })).getByRole('button'),
    );
    expect(names()).toEqual(['old-importer', 'zeta', 'staging-bot', 'dashboard', 'ci-deploy']);
  });
});

describe('DataTable selection', () => {
  it('selects rows, shows a mixed header state and selects all', async () => {
    view({ selectable: true });
    const all = screen.getByRole('checkbox', { name: 'Select all rows on this page' });
    const boxes = screen.getAllByRole('checkbox', { name: /^Select (?!all)/ });
    expect(boxes).toHaveLength(5);
    await fireEvent.click(boxes[0]!);
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    expect(boxes[0]!.closest('tr')).toHaveAttribute('data-selected', 'true');
    await fireEvent.click(all);
    expect(all).toHaveAttribute('aria-checked', 'true');
    expect(boxes.every((box) => box.getAttribute('aria-checked') === 'true')).toBe(true);
    await fireEvent.click(all);
    expect(boxes.every((box) => box.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('names each row checkbox after its row', () => {
    view({ selectable: true });
    expect(screen.getByRole('checkbox', { name: 'Select ci-deploy' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select zeta' })).toBeInTheDocument();
  });

  it('shows the bulk bar with a count while rows are selected', async () => {
    const bulk = createRawSnippet(() => ({
      render: () => '<button type="button">Revoke</button>',
    }));
    view({ selectable: true, bulk });
    expect(screen.queryByText(/\d+ selected/)).toBeNull();
    await fireEvent.click(screen.getAllByRole('checkbox', { name: /^Select (?!all)/ })[1]!);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Revoke' })).toBeInTheDocument();
  });
});

describe('DataTable data changes', () => {
  it('moves back to the last page when the rows shrink', async () => {
    const { rerender } = view({ pageSize: 2, page: 3 });
    expect(names()).toEqual(['zeta']);
    await rerender({ ...base, rows: rows.slice(0, 3), pageSize: 2 });
    expect(names()).toEqual(['dashboard']);
  });

  it('keeps the page while loading, when no rows have arrived yet', async () => {
    const { rerender } = view({ pageSize: 2, page: 3 });
    await rerender({ ...base, rows: [], pageSize: 2, page: 3, loading: true });
    await rerender({ ...base, pageSize: 2, page: 3, loading: false });
    expect(names()).toEqual(['zeta']);
  });

  it('counts only selected rows that are still in the table', async () => {
    const bulk = createRawSnippet(() => ({
      render: () => '<button type="button">Revoke</button>',
    }));
    const { rerender } = view({ selectable: true, selected: ['1', '2'], bulk });
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    await rerender({ ...base, rows: rows.slice(1), selectable: true, bulk });
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });
});

describe('DataTable paging and states', () => {
  it('shows one page of rows and moves to the next', async () => {
    view({ pageSize: 2 });
    expect(names()).toEqual(['staging-bot', 'ci-deploy']);
    await fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(names()).toEqual(['dashboard', 'old-importer']);
  });

  it('shows an empty state with its message', () => {
    view({ rows: [], emptyTitle: 'No keys yet' });
    expect(screen.getByText('No keys yet')).toBeInTheDocument();
  });

  it('announces loading to assistive tech', () => {
    view({ loading: true });
    expect(screen.getByRole('status')).toHaveTextContent('Loading API keys');
  });

  it('marks the body busy and hides the rows while loading', () => {
    const { container } = view({ loading: true });
    expect(container.querySelector('tbody')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('ci-deploy')).toBeNull();
  });
});
