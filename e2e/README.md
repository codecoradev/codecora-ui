# End-to-end checks

Playwright tests of the **built** playground in a real browser. Today: an axe
accessibility scan (`a11y.spec.ts`). The unit tests run in jsdom, which has no
layout or CSS, so landmarks, keyboard reachability and rendered contrast can
only be checked here.

What it scans, at 1280 px and 375 px, with `prefers-reduced-motion` on:

- `/components`, `/dashboard` and `/memory` in every theme (`?theme=`);
- the fixed page of every theme, `/themes/<name>`;
- every other playground page in the default theme.

Rules: WCAG 2 A and AA, 2.1 A and AA, 2.2 AA, and axe's best-practice rules.
Any violation fails the test, and the failing selector and fix hint are in the
output.

## Run it

```bash
bun run build                       # the tests preview apps/playground/build
cd e2e && bunx playwright install chromium   # once
bun run e2e                         # from the repo root
```

Useful flags (run them in `e2e/`): `bunx playwright test -g "/components in corin"`
or `--project=mobile`. To use another Chromium binary, set `CC_E2E_CHROMIUM` to
its path.

## Fixing a failure

Fix the component, token or playground page. An accepted exception goes in
`allowlist.ts` with the rule, the page or selector it covers, and a reason; it
is empty today, so keep it that way unless a finding is outside our control
(for example a third-party widget).

When the scan finds a colour pair that the token check missed, add the pair to
`packages/tokens/src/contrast.ts` too, so every theme and accent is checked
without a browser.
