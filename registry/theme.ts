// Fills the cc-theme item from @codecora/tokens at build time, so the bridge
// map and the tokens range follow the package instead of being copied by hand.
// Source, not dist: release.yml runs the tests before the packages are built.
import { shadcnBridge } from '../packages/tokens/src/index.js';

export interface Registry {
  items: { name: string; dependencies?: string[]; cssVars?: Record<string, unknown> }[];
}

/** `registry` with the cc-theme item's tokens dependency and light/dark variables filled in. */
export function withTheme<R extends Registry>(registry: R, tokensVersion: string): R {
  const vars = Object.fromEntries(
    Object.entries(shadcnBridge).map(([name, token]) => [name, `var(--cc-${token})`]),
  );
  return {
    ...registry,
    items: registry.items.map((item) =>
      item.name === 'cc-theme'
        ? {
            ...item,
            // A bare name would be written to the app's package.json as "latest".
            dependencies: [`@codecora/tokens@^${tokensVersion}`],
            cssVars: { ...item.cssVars, light: vars, dark: vars },
          }
        : item,
    ),
  };
}
