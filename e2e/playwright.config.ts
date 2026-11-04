import { defineConfig } from '@playwright/test';

const port = 4173;

/**
 * Tests of the built playground in a real browser. Run `bun run build` first;
 * the server below only previews `apps/playground/build`.
 *
 * Locally, Playwright's own Chromium is used when it is installed
 * (`bunx playwright install chromium`); set CC_E2E_CHROMIUM to the path of any
 * Chromium binary to use that instead. CI installs the matching browser.
 */
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    // Motion tokens drop to 0ms, so a scan never sees a half-faded element.
    contextOptions: { reducedMotion: 'reduce' },
    launchOptions: process.env.CC_E2E_CHROMIUM
      ? { executablePath: process.env.CC_E2E_CHROMIUM }
      : {},
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: `bun run --cwd ../apps/playground preview --port ${port} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
