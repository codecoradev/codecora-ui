import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import PaletteDemo from './fixtures/PaletteDemo.svelte';

describe('CommandPalette', () => {
  it('opens with Ctrl+K as a named dialog and closes with Escape', async () => {
    render(PaletteDemo, { onkeys: vi.fn(), onbilling: vi.fn() });
    expect(screen.queryByRole('dialog')).toBeNull();
    await fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog = await screen.findByRole('dialog', { name: 'Command palette' });
    expect(dialog).toBeInTheDocument();
    await fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('lists grouped options and finds one through its keywords', async () => {
    render(PaletteDemo, { onkeys: vi.fn(), onbilling: vi.fn() });
    await fireEvent.keyDown(window, { key: 'k', metaKey: true });
    await screen.findByRole('dialog');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    await fireEvent.input(screen.getByRole('combobox'), { target: { value: 'invoices' } });
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
    expect(screen.getByRole('option', { name: /Billing/ })).toBeInTheDocument();
  });

  it('runs the chosen item and closes', async () => {
    const onkeys = vi.fn();
    render(PaletteDemo, { onkeys, onbilling: vi.fn() });
    await fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const input = await screen.findByRole('combobox');
    await fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(onkeys).toHaveBeenCalledOnce());
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('says when nothing matches', async () => {
    render(PaletteDemo, { onkeys: vi.fn(), onbilling: vi.fn() });
    await fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    await fireEvent.input(await screen.findByRole('combobox'), { target: { value: 'zzzz' } });
    expect(await screen.findByText('No results')).toBeInTheDocument();
  });
});
