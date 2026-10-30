import type { Component } from 'svelte';

/** An icon component from any set; `@codecora/ui` never imports one itself. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- icon sets type their props differently
export type IconComponent = Component<any>;

export interface NavItem {
  id: string;
  label: string;
  /** Renders a link; without it the item is a button and reports through `onselect`. */
  href?: string;
  /** Required for the collapsed sidebar and the mobile bottom bar. */
  icon?: IconComponent;
  badge?: string | number;
  /** Prefer this item for the mobile bottom bar (at most 5 are shown). */
  pinned?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
