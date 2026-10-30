import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import AppShell from './AppShell.svelte';
import Sidebar from './Sidebar.svelte';
import Star from './fixtures/Star.svelte';
import type { NavGroup } from './types.js';

const groups: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { id: 'home', label: 'Overview', href: '/', icon: Star },
      { id: 'keys', label: 'API keys', href: '/keys', icon: Star, badge: 3 },
    ],
  },
  { label: 'Account', items: [{ id: 'logout', label: 'Sign out', icon: Star }] },
];

const page = createRawSnippet(() => ({ render: () => '<p>Page body</p>' }));

describe('Sidebar', () => {
  it('names the landmark and groups, and marks the current page', () => {
    render(Sidebar, { groups, current: 'keys', label: 'Workspace menu' });
    const nav = screen.getByRole('navigation', { name: 'Workspace menu' });
    expect(within(nav).getByRole('list', { name: 'Workspace' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /API keys/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: /Overview/ })).not.toHaveAttribute('aria-current');
  });

  it('renders links for items with href and buttons for the rest', async () => {
    const onselect = vi.fn();
    render(Sidebar, { groups, onselect });
    expect(screen.getByRole('link', { name: /Overview/ })).toHaveAttribute('href', '/');
    await fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(onselect).toHaveBeenCalledWith(expect.objectContaining({ id: 'logout' }));
  });

  it('collapses to icons: the toggle reports its state and labels stay accessible', async () => {
    render(Sidebar, { groups });
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await fireEvent.click(toggle);
    const expand = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(expand).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.queryByText('Workspace')).toBeNull();
  });

  it('hides the toggle when not collapsible', () => {
    render(Sidebar, { groups, collapsible: false });
    expect(screen.queryByRole('button', { name: /sidebar/ })).toBeNull();
  });
});

describe('AppShell', () => {
  it('renders the page in a main landmark with a skip link', () => {
    render(AppShell, { nav: groups, current: 'home', children: page });
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('Page body');
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      `#${main.id}`,
    );
  });

  it('has a main navigation and a primary bottom bar of at most 5 icon items', () => {
    const many: NavGroup[] = [
      {
        items: Array.from({ length: 7 }, (_, i) => ({
          id: `i${i}`,
          label: `Item ${i}`,
          href: `/${i}`,
          icon: Star,
        })),
      },
    ];
    render(AppShell, { nav: many, children: page });
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    const bar = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(bar).getAllByRole('link')).toHaveLength(5);
  });

  it('prefers pinned items for the bottom bar', () => {
    const nav: NavGroup[] = [
      {
        items: [
          ...Array.from({ length: 5 }, (_, i) => ({
            id: `a${i}`,
            label: `A${i}`,
            href: '/',
            icon: Star,
          })),
          { id: 'pin', label: 'Pinned', href: '/p', icon: Star, pinned: true },
        ],
      },
    ];
    render(AppShell, { nav, children: page });
    const bar = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(bar).getByRole('link', { name: 'Pinned' })).toBeInTheDocument();
    expect(within(bar).queryByRole('link', { name: 'A4' })).toBeNull();
  });

  it('opens the navigation drawer from the menu button and closes it on select', async () => {
    const onselect = vi.fn();
    render(AppShell, { nav: groups, current: 'home', onselect, children: page });
    await fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    const drawer = await screen.findByRole('dialog', { name: 'Navigation' });
    await fireEvent.click(within(drawer).getByRole('button', { name: 'Sign out' }));
    expect(onselect).toHaveBeenCalledWith(expect.objectContaining({ id: 'logout' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('applies the sidebar theme to the sidebar region and the drawer only', async () => {
    const { container } = render(AppShell, { nav: groups, sidebarTheme: 'corin', children: page });
    expect(container.querySelector('aside')).toHaveAttribute('data-theme', 'corin');
    expect(container.querySelector('main')?.closest('[data-theme]')).toBeNull();
    await fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(await screen.findByRole('dialog', { name: 'Navigation' })).toHaveAttribute(
      'data-theme',
      'corin',
    );
  });
});
