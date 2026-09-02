import { defineConfig } from '@playwright/test'

/** CHROMIUM_PATH points at an already-downloaded browser; this environment
 *  ships one and blocks `playwright install`. Unset elsewhere and Playwright
 *  uses its own. */
const executablePath = process.env.CHROMIUM_PATH || undefined

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['list']],
  timeout: 180_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://127.0.0.1:5174',
    launchOptions: { executablePath, args: ['--no-proxy-server'] },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
