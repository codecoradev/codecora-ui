---
'@codecora/ui': minor
'@codecora/tokens': minor
---

Button, IconButton, Badge, Kbd, Link, Separator, Spinner, Skeleton, Card, Alert, Avatar, VisuallyHidden, EmptyState and Progress are written with Tailwind utilities and need Tailwind 4 with `@codecora/tokens/theme.css` and `@codecora/ui/source.css` (D13); they look the same. `theme.css` adds the animations they use (`animate-spinner`, `animate-spinner-reduced`, `animate-skeleton`, `animate-settle-in`, `animate-fade-in`) and `max-w-measure`, `font-inherit` and `underline-offset-text`.
