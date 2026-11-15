// Fills the cc-theme item from the packages at build time, so the variable
// lists and the version ranges follow them instead of being copied by hand.
// Source, not dist: release.yml runs the tests before the packages are built.
import { tailwindKeys, themeVariables } from '../packages/tokens/src/index.js';

export interface Registry {
  items: { name: string; dependencies?: string[]; cssVars?: Record<string, unknown> }[];
}

/** Versions of the packages the theme item installs. */
export interface ThemeVersions {
  tokens: string;
  ui: string;
}

/**
 * `@codecora/tokens/theme.css` declares every shadcn variable (`--background`,
 * `--primary`, ... and our extensions) on each theme, in Tailwind's base layer. shadcn writes
 * its own values into the app's `:root` and `.dark` without a layer, which
 * would win over them, and the CLI can only set those variables, not delete
 * them: `revert-layer` sets each one back to the value theme.css declares.
 */
export const revertedVariables: Readonly<Record<string, string>> = Object.fromEntries(
  themeVariables.map((name) => [name, 'revert-layer']),
);

/**
 * Theme keys shadcn also writes into the app's `@theme inline` block (radius
 * and fonts). That block comes after the theme.css import, so its values would
 * win; the item writes theme.css's own values there instead: each key reads
 * the variable of the same name the themes declare (`--radius-md: var(--radius-md)`).
 */
export const themeKeys: Readonly<Record<string, string>> = Object.fromEntries(
  // The badge keys are CodeCora's own; shadcn never writes them.
  Object.entries(tailwindKeys).filter(([key]) => /^(radius|font)-(?!badge$)/.test(key)),
);

/** `registry` with the cc-theme item's package ranges and variables filled in. */
export function withTheme<R extends Registry>(registry: R, versions: ThemeVersions): R {
  return {
    ...registry,
    items: registry.items.map((item) =>
      item.name === 'cc-theme'
        ? {
            ...item,
            // A bare name would be written to the app's package.json as "latest".
            dependencies: [`@codecora/tokens@^${versions.tokens}`, `@codecora/ui@^${versions.ui}`],
            cssVars: {
              ...item.cssVars,
              theme: themeKeys,
              light: revertedVariables,
              dark: revertedVariables,
            },
          }
        : item,
    ),
  };
}
