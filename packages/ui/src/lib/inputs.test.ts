import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Combobox from './Combobox.svelte';
import GroupDemo from './fixtures/GroupDemo.svelte';
import Slider from './Slider.svelte';

const regions = [
  { value: 'eu', label: 'Europe' },
  { value: 'us', label: 'United States' },
  { value: 'ap', label: 'Asia Pacific' },
];

describe('FieldGroup', () => {
  it('is a fieldset named by its legend with the hint linked', () => {
    render(GroupDemo);
    const group = screen.getByRole('group', { name: /Digest/ });
    expect(group).toHaveAccessibleDescription('How often we email you.');
  });

  it('announces an error and marks the controls invalid', () => {
    render(GroupDemo, { error: 'Choose one.' });
    expect(screen.getByRole('group', { name: /Digest/ })).toHaveAccessibleDescription(
      /Choose one\./,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Slider', () => {
  it('is a named slider that steps with the arrow keys', async () => {
    render(Slider, { label: 'Retention', value: 30, min: 0, max: 90, step: 10, showValue: true });
    const thumb = screen.getByRole('slider', { name: 'Retention' });
    expect(thumb).toHaveAttribute('aria-valuenow', '30');
    expect(screen.getByText('30')).toBeInTheDocument();
    await fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('reads its value through the format function', () => {
    render(Slider, { label: 'Storage', value: 5, format: (v) => `${v} GB` });
    expect(screen.getByRole('slider', { name: 'Storage' })).toHaveAttribute(
      'aria-valuetext',
      '5 GB',
    );
  });
});

describe('Combobox', () => {
  it('is a named combobox that shows the chosen label', () => {
    render(Combobox, { items: regions, label: 'Region', value: 'us' });
    const input = screen.getByRole('combobox', { name: 'Region' });
    expect(input).toHaveValue('United States');
  });

  it('filters while typing and picks an option', async () => {
    render(Combobox, { items: regions, label: 'Region' });
    const input = screen.getByRole('combobox', { name: 'Region' });
    await fireEvent.focus(input);
    await fireEvent.input(input, { target: { value: 'asi' } });
    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Asia Pacific');
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(input).toHaveValue('Asia Pacific'));
  });

  it('says when nothing matches', async () => {
    render(Combobox, { items: regions, label: 'Region', emptyText: 'No region found' });
    const input = screen.getByRole('combobox', { name: 'Region' });
    await fireEvent.focus(input);
    await fireEvent.input(input, { target: { value: 'zzz' } });
    expect(await screen.findByText('No region found')).toBeInTheDocument();
  });
});
