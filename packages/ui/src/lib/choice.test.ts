import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Checkbox from './Checkbox.svelte';
import RadioGroup from './RadioGroup.svelte';
import Switch from './Switch.svelte';

describe('Checkbox', () => {
  it('is named by its label and toggles on click', async () => {
    render(Checkbox, { label: 'Send me a receipt' });
    const box = screen.getByRole('checkbox', { name: 'Send me a receipt' });
    expect(box).toHaveAttribute('aria-checked', 'false');
    await fireEvent.click(box);
    expect(box).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles from its label too', async () => {
    render(Checkbox, { label: 'Remember me' });
    await fireEvent.click(screen.getByText('Remember me'));
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('shows a mixed state and links its description', () => {
    render(Checkbox, { label: 'All keys', description: 'Some are selected', indeterminate: true });
    const box = screen.getByRole('checkbox', { name: 'All keys' });
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    expect(box).toHaveAccessibleDescription('Some are selected');
  });

  it('does not toggle while disabled and marks invalid', async () => {
    render(Checkbox, { label: 'Terms', disabled: true, invalid: true });
    const box = screen.getByRole('checkbox', { name: 'Terms' });
    expect(box).toBeDisabled();
    expect(box).toHaveAttribute('aria-invalid', 'true');
    await fireEvent.click(box);
    expect(box).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Switch', () => {
  it('is a named switch that flips on click', async () => {
    render(Switch, { label: 'Email alerts', description: 'Sent at most daily' });
    const toggle = screen.getByRole('switch', { name: 'Email alerts' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAccessibleDescription('Sent at most daily');
    await fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});

describe('RadioGroup', () => {
  const items = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly', description: 'Mondays' },
    { value: 'never', label: 'Never', disabled: true },
  ];

  it('is a named group with one radio per item', () => {
    render(RadioGroup, { items, label: 'Digest', value: 'daily' });
    expect(screen.getByRole('radiogroup', { name: 'Digest' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveAttribute('aria-checked', 'true');
  });

  it('selects on click, links descriptions and respects disabled items', async () => {
    render(RadioGroup, { items, label: 'Digest', value: 'daily' });
    const weekly = screen.getByRole('radio', { name: 'Weekly' });
    expect(weekly).toHaveAccessibleDescription('Mondays');
    await fireEvent.click(weekly);
    expect(weekly).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Never' })).toBeDisabled();
  });
});
