/**
 * Axe findings we accept, each with the reason. Keep it short: a real
 * violation in a component is fixed, not listed here. An entry matches when
 * the rule id is equal and every given field matches.
 */
export interface Allowed {
  rule: string;
  /** Substring of the page path, for example "/motion". */
  page?: string;
  /** Substring of the axe node target (the CSS selector). */
  target?: string;
  reason: string;
}

export const allowed: Allowed[] = [];
