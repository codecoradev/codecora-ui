---
'@codecora/memory': minor
---

Memory browser components on `@codecora/ui`: `MemoryList` (search, tag and room filters, keyboard rows, paging), `MemoryDetail` (pin, edit, delete with confirmation) and `MemoryEditor`, sharing state through `MemoryBrowser` and hiding what the backend's capabilities lack. The client gains `roomMemories` (uteke-serve `GET /room/memories`, Corin `uteke_room_memories`), and `createInMemoryClient` runs the components without a server for demos and tests. `@codecora/ui` is now a peer dependency.
