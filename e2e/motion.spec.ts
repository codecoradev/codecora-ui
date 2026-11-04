// The motion of the controls that move on a press, an arrival or a hover, read
// from computed styles on the component page: it is there when motion is
// allowed, and it is gone when the user asks for reduced motion. jsdom has no
// styles, so a unit test cannot see this. Desktop only: the styles are the
// same at every width (see playwright.config.ts).
import { expect, test, type Page } from '@playwright/test';

const seconds = (value: string) => Math.max(...value.split(',').map((v) => parseFloat(v)));

async function open(page: Page) {
  await page.goto('/components?theme=neutral');
  await page.locator('[data-theme="neutral"]').first().waitFor({ state: 'attached' });
  await page.waitForLoadState('networkidle');
}

/** Presses the first primary button and reads its scale while it is held down. */
async function pressedScale(page: Page) {
  const button = page.locator('.cc-button-primary:not(:disabled)').first();
  await button.scrollIntoViewIfNeeded();
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(250);
  const scale = await button.evaluate((el) => getComputedStyle(el).scale);
  await page.mouse.up();
  return scale;
}

test.describe('when motion is allowed', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('a pressed button shrinks to the press scale', async ({ page }) => {
    await open(page);
    const scale = await pressedScale(page);
    expect(parseFloat(scale)).toBeCloseTo(0.98, 2);
  });

  test('controls and rows move between states', async ({ page }) => {
    await open(page);
    const read = (selector: string, property: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property);

    expect(await read('.cc-button', 'transition-property')).toContain('scale');
    expect(await read('.cc-icon-button', 'transition-property')).toContain('scale');
    expect(await read('.cc-input', 'transition-property')).toContain('border-color');
    expect(await read('.cc-radio', 'transition-property')).toContain('border-color');
    expect(seconds(await read('.cc-table tbody tr', 'transition-duration'))).toBeGreaterThan(0);
  });

  test('a radio dot and a field error arrive with an animation', async ({ page }) => {
    await open(page);
    const name = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).animationName);
    expect(await name('.cc-radio .dot')).toContain('cc-dot-pop');
    expect(await name('.cc-field .error')).toContain('cc-error-in');
  });
});

test.describe('when the user asks for reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('a pressed button keeps its size', async ({ page }) => {
    await open(page);
    expect(parseFloat(await pressedScale(page))).toBe(1);
  });

  test('nothing moves between states', async ({ page }) => {
    await open(page);
    const read = (selector: string, property: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property);

    for (const selector of [
      '.cc-button',
      '.cc-icon-button',
      '.cc-input',
      '.cc-radio',
      '.cc-table tbody tr',
    ]) {
      expect(seconds(await read(selector, 'transition-duration')), selector).toBe(0);
    }
    expect(await read('.cc-radio .dot', 'animation-name')).toBe('none');
    expect(await read('.cc-field .error', 'animation-name')).toBe('none');
  });
});
