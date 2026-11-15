---
'@codecora/ui': patch
---

`Field` packs its rows at the top (`content-start`), so a field stretched by its parent (a form row beside a taller field, a stretching flex column) keeps its `Input`, `Select` or `Textarea` at the control height instead of growing it (#190).
