---
'@codecora/ui': patch
---

`AppShell`'s top bar is a `<header>` (the banner landmark), so the menu button, the mobile brand and the `header` snippet are inside a landmark and axe's `region` rule no longer fails on a phone-width page. It sits next to `<main>`, not inside it. A shell without a `header` snippet hides its bare top bar on a wide screen, so there is no empty landmark; on a phone it stays for the menu button (#128).
