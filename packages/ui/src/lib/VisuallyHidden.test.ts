import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import VisuallyHidden from './VisuallyHidden.svelte';

const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

describe('VisuallyHidden', () => {
  it('keeps its text in the accessibility tree', () => {
    render(VisuallyHidden, { children: text('Close dialog') });
    expect(screen.getByText('Close dialog')).toBeInTheDocument();
  });

  it('forwards attributes to the span', () => {
    render(VisuallyHidden, { children: text('Status'), id: 'status', 'aria-live': 'polite' });
    const el = screen.getByText('Status').parentElement;
    expect(el).toHaveAttribute('id', 'status');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveClass('cc-visually-hidden');
  });

  it('keeps the hiding class when a class is passed', () => {
    render(VisuallyHidden, { children: text('Label'), class: 'extra' });
    const el = screen.getByText('Label').parentElement;
    expect(el).toHaveClass('cc-visually-hidden', 'extra');
  });
});
