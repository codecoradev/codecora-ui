# @codecora/memory

## 0.3.0

### Minor Changes

- c012b91: `createPortalClient` for pages on the Uteke Cloud portal: browse, search, open, edit, pin and forget the signed-in user's own memories, plus rooms and tags, through the portal session routes (`/portal/*`) and their response shapes. A new `create` capability says whether a backend can write a new memory; the portal cannot (agents write those), so `MemoryList` and `MemoryBrowser` hide "New memory" there, and `remember` throws `UnsupportedError`. `capabilitiesFor('cloud')` now has rooms, which Cloud supports; the API client also reads room memories answered as `{ memories }` and shows the `message` of a Cloud error.

### Patch Changes

- Updated dependencies [298ede5]
- Updated dependencies [d063cf4]
- Updated dependencies [996cc0f]
  - @codecora/ui@0.5.0

## 0.2.0

### Minor Changes

- bc72743: Memory browser components on `@codecora/ui`: `MemoryList` (search, tag and room filters, keyboard rows, paging), `MemoryDetail` (pin, edit, delete with confirmation) and `MemoryEditor`, sharing state through `MemoryBrowser` and hiding what the backend's capabilities lack. The client gains `roomMemories` (uteke-serve `GET /room/memories`, Corin `uteke_room_memories`), and `createInMemoryClient` runs the components without a server for demos and tests. `@codecora/ui` is now a peer dependency.

## 0.1.0

### Minor Changes

- a909232: First release: `MemoryClient` over uteke-serve and Uteke Cloud (HTTP, Bearer key or portal session) and over the Corin desktop commands (Tauri), with typed memories, documents, rooms, tags, stats, export and import, `Capabilities` per backend, and a contract test suite that runs against a real uteke-serve.
