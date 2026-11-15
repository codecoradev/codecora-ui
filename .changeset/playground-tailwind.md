---
'@codecora/ui': patch
'@codecora/memory': patch
---

The internal glyph (close, chevron, check icons inside the components) is written with Tailwind utilities, so no `@codecora/ui` component has a `<style>` block left (#165); it looks the same. EmptyState, MemoryList and MemoryDetail set their heading weight themselves, so their titles stay bold in apps that use Tailwind's preflight, and the CommandPalette placeholder reads the muted text colour, like Input and Combobox, instead of the browser's grey.
