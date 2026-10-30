# @codecora/memory

The Uteke domain layer for CodeCora products: one `MemoryClient` over every
Uteke backend, with `Capabilities` that say what a backend supports. It has no
UI and no dependency besides Svelte (the memory components come next, #11).

```ts
import { createHttpClient } from '@codecora/memory';

// uteke-serve (Bearer token optional)
const local = createHttpClient({ baseUrl: 'http://127.0.0.1:8767', apiKey: token });

// Uteke Cloud with an API key
const cloud = createHttpClient({ baseUrl: cloudUrl, kind: 'cloud', apiKey: key });

const id = await local.remember({ content: 'Use bun workspaces', tags: ['project:x'], type: 'decision' });
const hits = await local.search('workspaces', { limit: 5 });
if (local.capabilities.rooms) await local.rooms();
```

## Transports

| Transport                 | Use it for                           | Notes                                                                                  |
| ------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `createHttpClient`        | uteke-serve and Uteke Cloud          | Bearer token, or `credentials: 'include'` for the Cloud portal session                 |
| `createTauriClient`       | the Corin desktop app                | pass Tauri's `invoke`; the command names come from Corin and are checked in #13        |

The Uteke Cloud portal session needs a session-scoped data route on the Cloud
side (tracked in the Uteke Cloud project). Until it exists, a browser app
cannot read Cloud memories without an API key; the client already supports it
through `baseUrl` and `credentials: 'include'`.

## Capabilities

`client.capabilities` lists what the backend can do. A UI hides what is false;
calling it anyway throws `UnsupportedError` before any request.

| Capability                                                       | uteke-serve | Uteke Cloud | Tauri |
| ---------------------------------------------------------------- | :---------: | :---------: | :---: |
| update, pin, recall, search, tags, stats, documents              |     yes     |     yes     |  yes  |
| rooms                                                            |     yes     |     no      |  yes  |
| export, import                                                   |     yes     |     yes     |  no   |
| namespaces                                                       |    full     | deprecated  | full  |
| graph, lifecycle, dream, orphans (reserved, no client method yet) |     yes     |     no      |  no   |

## Errors

Every failure is a `MemoryError` with `code` (`http`, `network`, `unsupported`)
and, for `http`, the `status` and the server's own message. API keys are only
ever sent in the `Authorization` header.

## Contract tests

`runContract` (in `src/lib/contract.ts`) is the behaviour every backend must
share. `contract.test.ts` runs it against:

- a **real uteke-serve** when the binary is on `PATH` (started on a free port
  with an auth token and a fixed temp data directory; the first run downloads
  the embedding model, about 40 s, later runs take about a second);
- a **Uteke Cloud test stack** when `UTEKE_CLOUD_URL` and `UTEKE_CLOUD_KEY` are
  set (skipped otherwise; there is no Cloud stack in CI yet).

Without either, only the unit tests run (mocked `fetch` and `invoke`).
