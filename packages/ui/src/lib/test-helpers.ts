import { createRawSnippet } from 'svelte';

/** A snippet that renders plain text, for components that take `children`. */
export const text = (value: string) =>
  createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));
