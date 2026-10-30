# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: CodeCora developers** building and maintaining the fleet of Svelte 5 product apps (Uteke Cloud, Corin, titen, gaira, tagfold, plotweft, waca, metobuz, vetio, tenun, drawover). Their job: ship product screens quickly without rebuilding Button, Input, Dialog, Toast or a theme in every repository, and land one fix in every app at once.
- **Secondary: outside developers** who find the public repository (Apache-2.0) and use the packages or the shadcn-svelte registry in their own Svelte apps.
- **Indirect: the end users of those products.** They never see this library by name, but they get its accessibility, keyboard behaviour and contrast.

## Product Purpose

One general UI system for every CodeCora product: design tokens, mixable themes, Svelte 5 components on bits-ui, icons, brand marks, and the Uteke memory domain layer. It succeeds when a fix made once reaches every app, and when each product keeps its own identity on shared structure and accessibility. See [docs/decisions.md](docs/decisions.md) (D1–D12) and [docs/architecture.md](docs/architecture.md).

## Positioning

One system, many themes, mixable per element (`data-theme`, `data-accent`, `data-density`). Products differ in accent, fonts, radius and icon weight, not in structure or accessibility. Components are plain CSS on semantic `--cc-*` tokens, so apps with Tailwind and apps without it (Uteke Cloud) consume the same packages.

## Operating Context

- Consumed as npm packages under `@codecora/*` (D4) in SvelteKit 2, SvelteKit 3 and plain Vite apps, including Tauri desktop builds; no `$app/*` imports.
- Blocks and templates that products customise are distributed through a shadcn-svelte registry (D6) instead of npm.
- The playground (`apps/playground`) is the catalogue: every component in every theme, at desktop and 375 px.
- Design work follows the impeccable workflow (D12); contrast is checked per theme in CI.

## Capabilities and Constraints

- Packages: `@codecora/tokens`, `@codecora/ui`, `@codecora/icons`, `@codecora/brand`, `@codecora/memory`; dependencies point down only (`memory -> ui -> tokens`).
- Themes today: `neutral` (default), `uteke`, `corin`. Accents: blue, green, teal, violet. Densities: comfortable, compact.
- A component enters `@codecora/ui` only when at least two products need it; product-specific variants go to the registry.
- Product-only UI (billing, admin, quotas of any one product) never enters this repository; `@codecora/ui` knows nothing about Uteke (D11).
- Icons: Lucide by default, Phosphor optional; components take any Svelte icon component and never import an icon set (D9).
- Corin is a reference, not a source to copy wholesale (D10).
- Undecided: the registry host, and whether a light `corin` and a dark `uteke` variant will exist.

## Brand Commitments

- Name: CodeCora UI; packages under the `@codecora` npm scope.
- Each product theme keeps its product's identity: `uteke` from uteke.app (uteke-cloud `web/src/lib/styles/tokens.css`), `corin` from Corin's `DESIGN.md`.
- Public-facing text is English and names no internal hosts or private trackers.

## Evidence on Hand

- Fleet survey of the eleven apps and their current UI: [docs/architecture.md](docs/architecture.md).
- Theme sources: uteke-cloud tokens and contrast gate, Corin `DESIGN.md` and `src/app.css` (sibling repositories, not vendored).
- No adoption metrics, testimonials or external users yet; do not claim any.

## Product Principles

1. **Fix once, reach everywhere.** Shared behaviour lives in packages; product variation lives in themes and the registry.
2. **Identity on shared structure.** A theme may change colour, type, radius, density and icon weight, never structure or accessibility.
3. **Accessible by construction.** Contrast, keyboard use and small screens are gates in the build, not review comments.
4. **Framework-light.** Plain CSS on semantic tokens; Tailwind and shadcn are bridges, not requirements.
5. **General by default.** Nothing product-specific enters the shared packages.

## Accessibility & Inclusion

- WCAG 2.2 AA for every theme and accent: 4.5:1 for text, 3:1 for UI boundaries and focus indicators, checked by `bun run contrast` and the unit tests.
- Every component works with the keyboard alone, shows a visible focus ring, and works at 375 px.
- Motion respects `prefers-reduced-motion` (token durations drop to 0 ms).
- Touch targets: 44 px at comfortable density; compact density (32 px) stays above the 24 px minimum of WCAG 2.5.8.
