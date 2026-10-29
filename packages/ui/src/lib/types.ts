import type { Component } from 'svelte';

/** An icon component from any set; `@codecora/ui` never imports one itself. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- icon sets type their props differently
export type IconComponent = Component<any>;

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
