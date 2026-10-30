import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Alert from './Alert.svelte';
import Avatar from './Avatar.svelte';
import Card from './Card.svelte';
import CodeBlock from './CodeBlock.svelte';
import Kbd from './Kbd.svelte';
import Link from './Link.svelte';
import Progress from './Progress.svelte';
import Separator from './Separator.svelte';
import { text } from './test-helpers.js';

describe('Card', () => {
  it('renders header, body and footer', () => {
    render(Card, { header: text('Plan'), footer: text('Billed monthly'), children: text('Pro') });
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Billed monthly')).toBeInTheDocument();
  });
});

describe('Alert', () => {
  it('interrupts for danger and is a polite status otherwise', () => {
    const { unmount } = render(Alert, { tone: 'danger', title: 'Failed', children: text('Retry') });
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    unmount();
    render(Alert, { tone: 'success', children: text('Saved') });
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });
});

describe('Avatar', () => {
  it('is named by the full name and falls back to initials', () => {
    render(Avatar, { name: 'Ada Lovelace' });
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('uses one initial for a single name and caps at two', () => {
    const { unmount } = render(Avatar, { name: 'corin' });
    expect(screen.getByText('C')).toBeInTheDocument();
    unmount();
    render(Avatar, { name: 'Grace Brewster Hopper' });
    expect(screen.getByText('GB')).toBeInTheDocument();
  });
});

describe('Progress', () => {
  it('exposes a named progressbar with its value', () => {
    render(Progress, { label: 'Storage', value: 40, showValue: true });
    const bar = screen.getByRole('progressbar', { name: 'Storage' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('clamps the shown percentage to the range', () => {
    render(Progress, { label: 'Over', value: 150, showValue: true });
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

describe('Separator', () => {
  it('is hidden from assistive tech unless it is meaningful', () => {
    const { unmount } = render(Separator);
    expect(screen.queryByRole('separator')).toBeNull();
    unmount();
    render(Separator, { decorative: false, orientation: 'vertical' });
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

describe('Kbd', () => {
  it('renders a kbd element', () => {
    render(Kbd, { children: text('⌘K') });
    expect(screen.getByText('⌘K').closest('kbd')).not.toBeNull();
  });
});

describe('Link', () => {
  it('opens external links safely and announces it', () => {
    render(Link, { href: 'https://example.com', external: true, children: text('Docs') });
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAccessibleName('Docs, opens in a new tab');
  });

  it('leaves internal links alone', () => {
    render(Link, { href: '/docs', children: text('Docs') });
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
});

describe('CodeBlock', () => {
  it('copies the code and says so', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(CodeBlock, { code: 'bun add @codecora/ui', language: 'bash' });
    expect(screen.getByLabelText('bash code')).toHaveTextContent('bun add @codecora/ui');
    await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('bun add @codecora/ui');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument());
    expect(screen.getByRole('status')).toHaveTextContent('Copied to the clipboard');
  });
});
