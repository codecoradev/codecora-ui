---
'@codecora/ui': patch
---

Tabs no longer draw a vertical scrollbar next to the tab list when every tab fits. The tabs sit 1px over the list's border, which made the list scroll vertically too; `overflow-y: hidden` removes that, and horizontal scrolling still works when the tabs do not fit (#123).
