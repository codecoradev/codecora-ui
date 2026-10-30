import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Badge from './Badge.svelte';
import Button from './Button.svelte';
import EmptyState from './EmptyState.svelte';
import Field from './Field.svelte';
import IconButton from './IconButton.svelte';
import Input from './Input.svelte';
import Skeleton from './Skeleton.svelte';
import Spinner from './Spinner.svelte';
import Table from './Table.svelte';
import Textarea from './Textarea.svelte';
import { text } from './test-helpers.js';
import { createRawSnippet } from 'svelte';
import FieldInput from './fixtures/FieldInput.svelte';
import Star from './fixtures/Star.svelte';

describe('Button', () => {
  it('is a type=button button by default and fires onclick', async () => {
    const onclick = vi.fn();
    render(Button, { children: text('Save'), onclick });
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    await fireEvent.click(button);
    expect(onclick).toHaveBeenCalledOnce();
  });

  it('blocks activation and announces busy while loading', () => {
    render(Button, { children: text('Save'), loading: true });
    const button = screen.getByRole('button', { name: /Save/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('renders a link when href is set and drops it while disabled', () => {
    const { unmount } = render(Button, { children: text('Docs'), href: '/docs' });
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    unmount();
    render(Button, { children: text('Docs'), href: '/docs', disabled: true });
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('announces what is loading', () => {
    render(Button, { children: text('Save'), loading: true, loadingLabel: 'Saving' });
    expect(screen.getByRole('status')).toHaveTextContent('Saving');
  });

  it('does not run onclick on a disabled or loading link', async () => {
    const onclick = vi.fn();
    render(Button, { children: text('Docs'), href: '/docs', loading: true, onclick });
    await fireEvent.click(screen.getByRole('link', { name: /Docs/ }));
    expect(onclick).not.toHaveBeenCalled();
  });

  it('renders a leading icon component, hidden from assistive technology', () => {
    const { container } = render(Button, { children: text('Star'), icon: Star });
    expect(container.querySelector('.cc-icon[aria-hidden="true"] svg')).not.toBeNull();
  });
});

describe('IconButton', () => {
  it('takes its accessible name from label', () => {
    render(IconButton, { icon: Star, label: 'Add to favourites' });
    expect(screen.getByRole('button', { name: 'Add to favourites' })).toBeInTheDocument();
  });
});

describe('Field with Input', () => {
  const control = createRawSnippet<
    [{ id: string; 'aria-describedby': string | undefined; invalid: boolean }]
  >((props) => ({
    render: () => {
      const p = props();
      return `<input id="${p.id}" ${p['aria-describedby'] ? `aria-describedby="${p['aria-describedby']}"` : ''} ${p.invalid ? 'aria-invalid="true"' : ''} />`;
    },
  }));

  it('labels the control and links the hint', () => {
    render(Field, { label: 'Email', description: 'Work address', children: control });
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('Work address');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('links the error and marks the control invalid', () => {
    render(Field, { label: 'Email', error: 'Enter a valid email', children: control });
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(/Error:\s*Enter a valid email/);
  });
});

describe('Field with a real Input', () => {
  it('forwards required and invalid to the control', () => {
    render(FieldInput, { error: 'Enter a valid email', required: true });
    const input = screen.getByLabelText(/Email/);
    expect(input).toBeRequired();
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(/Work address.*Error:\s*Enter a valid email/s);
  });

  it('marks the error with an icon as well as colour', () => {
    const { container } = render(FieldInput, { error: 'Enter a valid email' });
    expect(container.querySelector('.error .cc-glyph')).not.toBeNull();
  });
});

describe('Input and Textarea', () => {
  it('binds typed text and flags invalid', async () => {
    render(Input, { 'aria-label': 'Name', invalid: true });
    const input = screen.getByRole('textbox', { name: 'Name' });
    await fireEvent.input(input, { target: { value: 'Ada' } });
    expect(input).toHaveValue('Ada');
    expect(input).toBeInvalid();
  });

  it('renders a multi-line textarea', () => {
    render(Textarea, { 'aria-label': 'Notes', value: 'hello' });
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('hello');
  });
});

describe('Badge, Spinner, Skeleton, EmptyState', () => {
  it('Badge shows its text with the tone class', () => {
    render(Badge, { children: text('Active'), tone: 'success' });
    expect(screen.getByText('Active').parentElement).toHaveClass('cc-badge-success');
  });

  it('Spinner has an announced label', () => {
    render(Spinner, { label: 'Saving' });
    expect(screen.getByRole('status')).toHaveTextContent('Saving');
  });

  it('Skeleton is hidden from assistive technology', () => {
    const { container } = render(Skeleton, { width: '8rem' });
    expect(container.querySelector('.cc-skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('EmptyState renders a heading at the chosen level plus its action', () => {
    const action = createRawSnippet(() => ({ render: () => '<button>Create</button>' }));
    render(EmptyState, { title: 'No keys yet', description: 'Create one.', level: 2, action });
    expect(screen.getByRole('heading', { level: 2, name: 'No keys yet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });
});

describe('Table', () => {
  it('is a named, focusable scroll region around a captioned table', () => {
    const rows = createRawSnippet(() => ({
      render: () => '<thead><tr><th>Name</th></tr></thead><tbody><tr><td>Ada</td></tr></tbody>',
    }));
    render(Table, { label: 'Members', children: rows });
    const region = screen.getByRole('region', { name: 'Members' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('table', { name: 'Members' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });
});
