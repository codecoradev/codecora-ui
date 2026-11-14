---
'@codecora/ui': minor
---

New `@codecora/ui/source.css` (`@source` for the shipped components) and `cn()` taught the theme names (`h-control`, `duration-fast`, `ease-spring`, `shadow-popover`, `z-popover`) so they replace their Tailwind counterparts; the config is exported as `twMergeExtension` (#158).

Checkbox renames its internal visually-hidden label class from `hidden` to `label-hidden`, so Tailwind's `hidden` utility (`display: none`) can no longer remove a hidden label from the accessibility tree in apps that scan the components.
