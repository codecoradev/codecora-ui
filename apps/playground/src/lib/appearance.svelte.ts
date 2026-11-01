import { replaceState } from '$app/navigation';
import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import {
  accentNames,
  densities,
  themeNames,
  type AccentName,
  type ThemeName,
} from '@codecora/tokens';

const KEY = 'cc-playground';

const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
  list.includes(value as T);

/**
 * Theme, accent and density of a playground page, restored from the URL
 * (`?theme=&accent=&density=`, so a view can be linked) or else from
 * localStorage. Either may hold stale values, so only known names are
 * restored. Call it during component initialisation (it registers effects).
 */
export function createAppearance() {
  let theme = $state<ThemeName>('neutral');
  let accent = $state('default');
  let density = $state('comfortable');
  let restored = $state(false);

  $effect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
      if (isOneOf(themeNames, saved?.theme)) theme = saved.theme;
      if (saved?.accent === 'default' || isOneOf(accentNames, saved?.accent)) accent = saved.accent;
      if (isOneOf(densities, saved?.density)) density = saved.density;
    } catch {
      // keep the defaults
    }
    // Read from location, not the page store: the pages are prerendered. A
    // linked view (the URL always carries `theme`) wins over the saved one,
    // and a key it leaves out means that key's default, not the saved value.
    const query = new SvelteURLSearchParams(location.search);
    if (query.has('theme')) {
      const urlTheme = query.get('theme');
      const urlAccent = query.get('accent') ?? 'default';
      const urlDensity = query.get('density') ?? 'comfortable';
      theme = isOneOf(themeNames, urlTheme) ? urlTheme : 'neutral';
      accent = urlAccent === 'default' || isOneOf(accentNames, urlAccent) ? urlAccent : 'default';
      density = isOneOf(densities, urlDensity) ? urlDensity : 'comfortable';
    }
    restored = true;
  });

  // Keep the URL in step so the address bar is shareable: `theme` always, the
  // others only when they differ from their defaults.
  $effect(() => {
    const params = { theme, accent, density };
    if (!restored) return;
    const url = new SvelteURL(location.href);
    const set = (key: string, value: string, fallback: string) =>
      value === fallback ? url.searchParams.delete(key) : url.searchParams.set(key, value);
    url.searchParams.set('theme', params.theme);
    set('accent', params.accent, 'default');
    set('density', params.density, 'comfortable');
    // Same page, only the query changes, so there is no route to resolve.
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    if (url.href !== location.href) replaceState(url, {});
  });

  $effect(() => {
    const value = JSON.stringify({ theme, accent, density });
    if (!restored) return;
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // not persisted; the page still works
    }
  });

  // Dialogs, sheets, selects and toasts render in a portal under <body>, outside
  // the page frame, so the choice is mirrored on <html> for them to inherit.
  $effect(() => {
    const root = document.documentElement;
    const set = (name: string, value: string | undefined) =>
      value === undefined ? root.removeAttribute(name) : root.setAttribute(name, value);
    set('data-theme', theme);
    set('data-accent', accent === 'default' ? undefined : accent);
    set('data-density', density === 'comfortable' ? undefined : density);
    return () => {
      for (const name of ['data-theme', 'data-accent', 'data-density']) root.removeAttribute(name);
    };
  });

  return {
    get theme() {
      return theme;
    },
    set theme(value: ThemeName) {
      theme = value;
    },
    get accent() {
      return accent;
    },
    set accent(value: string) {
      accent = value;
    },
    get density() {
      return density;
    },
    set density(value: string) {
      density = value;
    },
    /** Attribute values for the themed element. */
    get accentName(): AccentName | undefined {
      return accent === 'default' ? undefined : (accent as AccentName);
    },
    get densityName(): string | undefined {
      return density === 'comfortable' ? undefined : density;
    },
  };
}
