---
'@codecora/ui': minor
'@codecora/memory': minor
'@codecora/tokens': minor
---

Tabs, Accordion, Breadcrumb, Pagination, AppShell, Sidebar, Table, DataTable, CodeBlock, MemoryList, MemoryDetail and MemoryEditor are written with Tailwind utilities (each takes a `class` prop merged last) and need Tailwind 4 with `@codecora/tokens/theme.css` and `@codecora/ui/source.css` (plus `@codecora/memory/source.css` for the memory components) (D13); same look. `theme.css` adds `font-inherit`, `ligatures-none`, `max-w-measure` and the `animate-accordion-open`/`-close` animations.
