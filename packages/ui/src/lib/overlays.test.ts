import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import ConfirmDialog from './ConfirmDialog.svelte';
import Dialog from './Dialog.svelte';
import Select from './Select.svelte';
import Sheet from './Sheet.svelte';
import Tabs from './Tabs.svelte';
import Toaster from './Toaster.svelte';
import { toast, toasts } from './toast.svelte.js';
import { text } from './test-helpers.js';

describe('Dialog and Sheet', () => {
  it('opens as a named modal dialog and closes with Escape', async () => {
    render(Dialog, {
      open: true,
      title: 'Rename key',
      description: 'Pick a clear name.',
      children: text('body'),
    });
    const dialog = await screen.findByRole('dialog', { name: 'Rename key' });
    expect(dialog).toHaveAccessibleDescription('Pick a clear name.');
    await fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('the close button has an accessible name', async () => {
    render(Dialog, { open: true, title: 'Rename key' });
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('Sheet uses the side placement class', async () => {
    render(Sheet, { open: true, title: 'Filters', side: 'left' });
    expect(await screen.findByRole('dialog', { name: 'Filters' })).toHaveClass('cc-modal-left');
  });
});

describe('ConfirmDialog', () => {
  it('announces as an alert dialog and confirms', async () => {
    const onconfirm = vi.fn();
    render(ConfirmDialog, {
      open: true,
      title: 'Delete key?',
      confirmLabel: 'Delete',
      tone: 'danger',
      onconfirm,
    });
    expect(await screen.findByRole('alertdialog', { name: 'Delete key?' })).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(onconfirm).toHaveBeenCalledOnce());
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  });

  it('cancel closes without confirming', async () => {
    const onconfirm = vi.fn();
    render(ConfirmDialog, { open: true, title: 'Delete key?', onconfirm });
    await fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(onconfirm).not.toHaveBeenCalled();
  });
});

describe('Tabs', () => {
  const panel = createRawSnippet<[string]>((value) => ({
    render: () => `<p>panel ${value()}</p>`,
  }));

  it('shows the first panel and switches with the arrow keys', async () => {
    render(Tabs, {
      label: 'Sections',
      items: [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ],
      panel,
    });
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument();
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('panel a')).toBeInTheDocument();
    alpha.focus();
    await fireEvent.keyDown(alpha, { key: 'ArrowRight' });
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true'),
    );
  });
});

describe('Select', () => {
  const items = [
    { value: 'eu', label: 'Europe' },
    { value: 'us', label: 'United States' },
  ];

  it('shows the placeholder, then the chosen label', async () => {
    render(Select, { items, label: 'Region', placeholder: 'Pick a region' });
    const trigger = screen.getByRole('combobox', { name: 'Region' });
    expect(trigger).toHaveTextContent('Pick a region');
    await fireEvent.click(trigger);
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it('reflects an initial value', () => {
    render(Select, { items, label: 'Region', value: 'us' });
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveTextContent('United States');
  });
});

describe('Toaster', () => {
  it('announces a toast and dismisses it', async () => {
    render(Toaster);
    toast.show({ title: 'Saved', duration: 0 });
    expect(await screen.findByRole('status')).toHaveTextContent('Saved');
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('uses role=alert for errors, which stay until dismissed', async () => {
    render(Toaster);
    const id = toast.error('Could not save', 'Try again.');
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not save');
    toast.dismiss(id);
    expect(toasts.items).toHaveLength(0);
  });

  it('dismisses itself after its duration', async () => {
    vi.useFakeTimers();
    toast.show({ title: 'Brief', duration: 1000 });
    expect(toasts.items).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    expect(toasts.items).toHaveLength(0);
    vi.useRealTimers();
  });
});

describe('theme prop', () => {
  it('Dialog and Sheet pass their theme to the portalled panel', async () => {
    const dialog = render(Dialog, { open: true, title: 'A', theme: 'corin' });
    expect(await screen.findByRole('dialog', { name: 'A' })).toHaveAttribute('data-theme', 'corin');
    dialog.unmount();
    render(Sheet, { open: true, title: 'B', theme: 'uteke' });
    expect(await screen.findByRole('dialog', { name: 'B' })).toHaveAttribute('data-theme', 'uteke');
  });
});
