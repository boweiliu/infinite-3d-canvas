// @ts-check
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [['list']],
  use: {
    viewport: { width: 1280, height: 800 },
    launchOptions: {
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
      // Talk to the local server directly even if the machine has an HTTP proxy configured.
      args: ['--no-sandbox', '--proxy-server=direct://', '--proxy-bypass-list=*'],
    },
  },
  webServer: {
    command: 'npx http-server -p 4173 -s .',
    port: 4173,
    reuseExistingServer: true,
  },
});
