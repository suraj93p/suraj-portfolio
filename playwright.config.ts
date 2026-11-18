import { defineConfig, devices } from '@playwright/test';
import { portfolioConfig } from './src/config/portfolio.config';
const base = portfolioConfig.site.basePath;
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: `http://127.0.0.1:4173${base}`, trace: 'retain-on-failure', serviceWorkers: 'allow' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm run preview', url: `http://127.0.0.1:4173${base}`, reuseExistingServer: !process.env.CI, timeout: 30000 }
});
