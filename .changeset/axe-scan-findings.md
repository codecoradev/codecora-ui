---
'@codecora/tokens': patch
'@codecora/ui': patch
---

Fixes from the first real-browser axe scan. `@codecora/tokens`: the contrast check now also covers accent text on its own tint and on a sunken surface (badges, the current nav item, links in wells), and two themes failed it: `corin-light` has a slightly darker teal (`#0B6D66`, was `#0E7C74`, 4.0:1 on its tint) and `sepia` has a darker blue accent. `@codecora/ui`: a `Table` that scrolls names its region "<label> (scrollable)" instead of repeating the label, so a heading or section with the same words no longer makes two landmarks with one name; the new `regionLabel` prop sets another name (#141).
