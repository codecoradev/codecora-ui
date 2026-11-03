---
'@codecora/ui': minor
---

`Table` (and so `DataTable`) is a labelled, focusable scroll region only while it overflows sideways, so a table that fits adds no tab stop. It is measured with a ResizeObserver, so it follows the viewport and the rows; until then, and without JavaScript, the wrapper is a plain element and the `<caption>` names the table. Tests that expected `role="region"` and `tabindex="0"` on every table need a table that overflows (#124).
