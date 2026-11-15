import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Mark from './fixtures/Mark.svelte';
import Icon from './Icon.svelte';
import * as lucide from './lucide.js';
import PhosphorIcon from './PhosphorIcon.svelte';
import { weightForStroke } from './phosphor-weight.js';

describe('Icon', () => {
  it('is hidden from assistive technology by default', () => {
    const { container } = render(Icon, { icon: Mark });
    const wrap = container.querySelector('.cc-icon');
    expect(wrap).toHaveAttribute('aria-hidden', 'true');
    expect(wrap).not.toHaveAttribute('role');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('is an image with a name when labelled', () => {
    render(Icon, { icon: Mark, label: 'Delete' });
    expect(screen.getByRole('img', { name: 'Delete' })).toBeInTheDocument();
  });

  it('overrides the theme size and stroke for one icon only', () => {
    const { container } = render(Icon, { icon: Mark, size: '1rem', stroke: 3 });
    const wrap = container.querySelector<HTMLElement>('.cc-icon')!;
    expect(wrap.style.getPropertyValue('--cc-icon-size')).toBe('1rem');
    expect(wrap.style.getPropertyValue('--cc-icon-stroke')).toBe('3');
  });

  it('leaves the theme tokens alone when nothing is overridden', () => {
    const { container } = render(Icon, { icon: Mark });
    const wrap = container.querySelector<HTMLElement>('.cc-icon')!;
    expect(wrap.style.getPropertyValue('--cc-icon-size')).toBe('');
  });

  it('passes extra props to the icon component', () => {
    const { container } = render(Icon, { icon: Mark, iconProps: { weight: 'bold' } });
    expect(container.querySelector('svg')).toHaveAttribute('data-weight', 'bold');
  });
});

describe('Lucide set', () => {
  it('exports icon components that render an svg', () => {
    const names = Object.keys(lucide);
    expect(names.length).toBeGreaterThan(30);
    for (const name of ['Plus', 'Trash', 'KeyRound', 'LayoutDashboard', 'Funnel']) {
      expect(names).toContain(name);
      const { container, unmount } = render(Icon, { icon: lucide[name as keyof typeof lucide] });
      expect(container.querySelector('svg')).not.toBeNull();
      unmount();
    }
  });
});

describe('Phosphor adapter', () => {
  it('maps the theme stroke to a weight', () => {
    expect(weightForStroke(1)).toBe('thin');
    expect(weightForStroke(1.5)).toBe('light');
    expect(weightForStroke(1.75)).toBe('regular');
    expect(weightForStroke(2)).toBe('regular');
    expect(weightForStroke(2.5)).toBe('bold');
  });

  it('passes the weight chosen from the stroke, or the explicit one', () => {
    const a = render(PhosphorIcon, { icon: Mark, stroke: 1 });
    expect(a.container.querySelector('svg')).toHaveAttribute('data-weight', 'thin');
    a.unmount();
    const b = render(PhosphorIcon, { icon: Mark, stroke: 1, weight: 'duotone' });
    expect(b.container.querySelector('svg')).toHaveAttribute('data-weight', 'duotone');
    b.unmount();
    const c = render(PhosphorIcon, { icon: Mark });
    expect(c.container.querySelector('svg')).toHaveAttribute('data-weight', 'regular');
  });
});
