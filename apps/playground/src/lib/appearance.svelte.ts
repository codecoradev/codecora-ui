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
 * Theme, accent and density of a playground page, restored from localStorage.
 * Storage may be unavailable or hold stale values, so only known names are
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
    restored = true;
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
