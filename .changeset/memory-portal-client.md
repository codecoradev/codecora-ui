---
'@codecora/memory': minor
---

`createPortalClient` for pages on the Uteke Cloud portal: browse, search, open, edit, pin and forget the signed-in user's own memories, plus rooms and tags, through the portal session routes (`/portal/*`) and their response shapes. A new `create` capability says whether a backend can write a new memory; the portal cannot (agents write those), so `MemoryList` and `MemoryBrowser` hide "New memory" there, and `remember` throws `UnsupportedError`. `capabilitiesFor('cloud')` now has rooms, which Cloud supports; the API client also reads room memories answered as `{ memories }` and shows the `message` of a Cloud error.
