// An axe scan of the built playground: every theme on the pages that show the
// components, and every other page in the default theme, at 1280 px and 375 px
// (the two projects in playwright.config.ts).
import AxeBuilder from '@axe-core/playwright';
import { themeNames } from '@codecora/tokens';
import { expect, test, type Page } from '@playwright/test';
import { allowed } from './allowlist.js';

/** Pages that render the components; scanned in every theme. */
const themedPages = ['/components', '/dashboard', '/memory'];
/** The rest of the playground; scanned in the default theme. */
const otherPages = ['/', '/samples', '/registry', '/tokens', '/motion', '/icons', '/brand'];

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function scan(page: Page, path: string) {
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  const lines: string[] = [];
  for (const violation of results.violations) {
    for (const node of violation.nodes) {
      const target = node.target.join(' ');
      const accepted = allowed.some(
        (a) =>
          a.rule === violation.id &&
          (a.page === undefined || path.includes(a.page)) &&
          (a.target === undefined || target.includes(a.target)),
      );
      if (!accepted) {
        lines.push(`${violation.id} (${violation.impact}): ${target}\n    ${node.failureSummary}`);
      }
    }
  }
  return lines;
}

/** The pages restore the theme from the URL after hydration, so wait for it. */
async function open(page: Page, url: string, theme?: string) {
  await page.goto(url);
  if (theme) await page.locator(`[data-theme="${theme}"]`).first().waitFor({ state: 'attached' });
  await page.waitForLoadState('networkidle');
}

for (const theme of themeNames) {
  for (const path of themedPages) {
    test(`${path} in ${theme}`, async ({ page }) => {
      await open(page, `${path}?theme=${theme}`, theme);
      expect(await scan(page, path)).toEqual([]);
    });
  }

  // The fixed page for the theme: its tokens, swatches and contrast table.
  test(`/themes/${theme}`, async ({ page }) => {
    await open(page, `/themes/${theme}`);
    expect(await scan(page, `/themes/${theme}`)).toEqual([]);
  });
}

for (const path of otherPages) {
  test(`${path} in the default theme`, async ({ page }) => {
    await open(page, path);
    expect(await scan(page, path)).toEqual([]);
  });
}
