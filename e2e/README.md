# End-to-end checks

Playwright tests of the **built** playground in a real browser. The unit tests
run in jsdom, which has no layout or CSS, so landmarks, keyboard reachability,
rendered contrast and the look of every theme can only be checked here.

- `a11y.spec.ts`: an axe scan (below).
- `visual.spec.ts`: screenshots against committed baselines (see "Visual
  snapshots").

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

## Visual snapshots

`visual.spec.ts` takes a screenshot of the playground at 1280 px and 375 px and
compares it with `e2e/__screenshots__/<desktop|mobile>/`: the fixed page of every
theme (`/themes/<name>`), `/components` in `neutral`, `neutral-dark`, `corin` and
`corin-light`, and `/dashboard` in `neutral` and `corin`. A pixel depends on the
OS and its fonts, so the baselines are made on the CI runner (Linux) and compared
there only. Locally these tests skip; set `CC_E2E_VISUAL=1` to run them anyway
(a diff then usually means your machine renders differently).

When a CI diff is a bug, fix it. When it is the change you meant to make:

1. Push your branch, then run the **CI** workflow on it by hand with
   `update_snapshots` on (Actions tab, or
   `gh workflow run ci.yml --ref <branch> -f update_snapshots=true`).
2. Download the `visual-baselines` artifact of that run
   (`gh run download <run-id> -n visual-baselines -D e2e/__screenshots__`).
3. Look at the changed images, commit them with the change, and push.

A failing comparison uploads `visual-diffs` (expected, actual and diff images).
