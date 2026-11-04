// Screenshots of the built playground against committed baselines, at 1280 px
// and 375 px (the two projects in playwright.config.ts).
//
// Pixels depend on the OS and its fonts, so the baselines are made on Linux in
// CI and compared there only. Locally these tests skip unless CC_E2E_VISUAL=1
// (then a diff only means your machine renders differently). To refresh the
// baselines after an intended change, run the CI workflow by hand with
// "update_snapshots" on your branch and commit the artifact's images; see
// e2e/README.md.
import { themeNames } from '@codecora/tokens';
import { expect, test, type Page } from '@playwright/test';

test.skip(
  process.platform !== 'linux' && !process.env.CC_E2E_VISUAL,
  'Baselines are made on Linux (CI); set CC_E2E_VISUAL=1 to compare anyway.',
);

/** Pages that show the components, in a light, a dark and the Corin themes. */
const pages: { path: string; themes: string[] }[] = [
  { path: '/components', themes: ['neutral', 'neutral-dark', 'corin', 'corin-light'] },
  { path: '/dashboard', themes: ['neutral', 'corin'] },
];

/** The pages restore the theme from the URL after hydration, so wait for it and the fonts. */
async function settle(page: Page, url: string, theme?: string) {
  await page.goto(url);
  if (theme) await page.locator(`[data-theme="${theme}"]`).first().waitFor({ state: 'attached' });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

for (const { path, themes } of pages) {
  for (const theme of themes) {
    test(`${path} in ${theme}`, async ({ page }) => {
      await settle(page, `${path}?theme=${theme}`, theme);
      await expect(page).toHaveScreenshot(`${path.slice(1)}-${theme}.png`);
    });
  }
}

// The fixed page of every theme: tokens, swatches and a strip of components.
for (const theme of themeNames) {
  test(`/themes/${theme}`, async ({ page }) => {
    await settle(page, `/themes/${theme}`);
    await expect(page).toHaveScreenshot(`theme-${theme}.png`);
  });
}
