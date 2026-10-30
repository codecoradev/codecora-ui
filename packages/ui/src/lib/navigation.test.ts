import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Accordion from './Accordion.svelte';
import Breadcrumb from './Breadcrumb.svelte';
import MenuDemo from './fixtures/MenuDemo.svelte';
import PopoverDemo from './fixtures/PopoverDemo.svelte';
import Pagination from './Pagination.svelte';
import ToggleGroup from './ToggleGroup.svelte';
import { createRawSnippet } from 'svelte';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Keys', href: '/keys' },
    { label: 'ci-deploy' },
  ];

  it('is a named landmark with the last item as the current page', () => {
    render(Breadcrumb, { items });
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByText('ci-deploy')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'ci-deploy' })).toBeNull();
  });
});

describe('Accordion', () => {
  const panel = createRawSnippet<[string]>((value) => ({
    render: () => `<p>panel ${value()}</p>`,
  }));
  const items = [
    { value: 'a', label: 'Billing' },
    { value: 'b', label: 'Security' },
  ];

  it('opens a section from its trigger and keeps one open in single mode', async () => {
    render(Accordion, { items, panel });
    const billing = screen.getByRole('button', { name: 'Billing' });
    const security = screen.getByRole('button', { name: 'Security' });
    expect(billing).toHaveAttribute('aria-expanded', 'false');
    await fireEvent.click(billing);
    expect(billing).toHaveAttribute('aria-expanded', 'true');
    await fireEvent.click(security);
    expect(security).toHaveAttribute('aria-expanded', 'true');
    expect(billing).toHaveAttribute('aria-expanded', 'false');
  });

  it('lets several stay open in multiple mode', async () => {
    render(Accordion, { items, panel, type: 'multiple' });
    await fireEvent.click(screen.getByRole('button', { name: 'Billing' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Security' }));
    expect(screen.getByRole('button', { name: 'Billing' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Security' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});

describe('ToggleGroup', () => {
  it('is a named group where one item is pressed at a time', async () => {
    render(ToggleGroup, {
      label: 'View',
      items: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
      ],
      value: 'list',
    });
    expect(screen.getByRole('group', { name: 'View' })).toBeInTheDocument();
    const list = screen.getByRole('radio', { name: 'List' });
    const grid = screen.getByRole('radio', { name: 'Grid' });
    expect(list).toHaveAttribute('aria-checked', 'true');
    await fireEvent.click(grid);
    expect(grid).toHaveAttribute('aria-checked', 'true');
    expect(list).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Pagination', () => {
  it('marks the current page and moves with next and previous', async () => {
    render(Pagination, { count: 100, perPage: 10, page: 1 });
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('data-selected');
    await fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('data-selected');
  });
});

describe('Popover', () => {
  it('opens a named panel from its trigger and closes with Escape', async () => {
    render(PopoverDemo);
    await fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const panel = await screen.findByRole('dialog', { name: 'Filters' });
    expect(panel).toHaveTextContent('Narrow the list');
    await fireEvent.keyDown(panel, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

describe('DropdownMenu', () => {
  it('opens from the keyboard, runs an item and skips disabled ones', async () => {
    const onrename = vi.fn();
    render(MenuDemo, { onrename, ondelete: vi.fn() });
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await fireEvent.keyDown(trigger, { key: 'Enter' });
    const menu = await screen.findByRole('menu', { name: 'Key actions' });
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveAttribute('data-disabled');
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onrename).toHaveBeenCalledOnce();
  });
});
