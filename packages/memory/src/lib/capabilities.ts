export type BackendKind = 'uteke-serve' | 'cloud' | 'tauri';

/**
 * What a backend can do. A UI hides what is false; a client method whose
 * capability is false throws `UnsupportedError` instead of failing at the server.
 */
export interface Capabilities {
  update: boolean;
  pin: boolean;
  recall: boolean;
  search: boolean;
  tags: boolean;
  stats: boolean;
  rooms: boolean;
  documents: boolean;
  export: boolean;
  import: boolean;
  /** "deprecated": works but should not be shown as a feature (Uteke Cloud). */
  namespaces: 'full' | 'deprecated' | 'none';
  graph: boolean;
  lifecycle: boolean;
  dream: boolean;
  orphans: boolean;
}

const all: Capabilities = {
  update: true,
  pin: true,
  recall: true,
  search: true,
  tags: true,
  stats: true,
  rooms: true,
  documents: true,
  export: true,
  import: true,
  namespaces: 'full',
  graph: true,
  lifecycle: true,
  dream: true,
  orphans: true,
};

/**
 * Defaults per backend. Uteke Cloud has no graph, lifecycle, dream, orphans or
 * rooms, and namespaces are deprecated there. The Tauri client covers the core
 * operations only; export and import go through other desktop commands.
 */
export function capabilitiesFor(kind: BackendKind): Capabilities {
  switch (kind) {
    case 'uteke-serve':
      return { ...all };
    case 'cloud':
      return {
        ...all,
        rooms: false,
        namespaces: 'deprecated',
        graph: false,
        lifecycle: false,
        dream: false,
        orphans: false,
      };
    case 'tauri':
      return {
        ...all,
        export: false,
        import: false,
        graph: false,
        lifecycle: false,
        dream: false,
        orphans: false,
      };
  }
}
