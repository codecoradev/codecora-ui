# @codecora/memory

## 0.2.0

### Minor Changes

- bc72743: Memory browser components on `@codecora/ui`: `MemoryList` (search, tag and room filters, keyboard rows, paging), `MemoryDetail` (pin, edit, delete with confirmation) and `MemoryEditor`, sharing state through `MemoryBrowser` and hiding what the backend's capabilities lack. The client gains `roomMemories` (uteke-serve `GET /room/memories`, Corin `uteke_room_memories`), and `createInMemoryClient` runs the components without a server for demos and tests. `@codecora/ui` is now a peer dependency.

## 0.1.0

### Minor Changes

- a909232: First release: `MemoryClient` over uteke-serve and Uteke Cloud (HTTP, Bearer key or portal session) and over the Corin desktop commands (Tauri), with typed memories, documents, rooms, tags, stats, export and import, `Capabilities` per backend, and a contract test suite that runs against a real uteke-serve.
