/* eslint-disable import/extensions */
import { defineConfig } from 'cypress'

const IS_CI = Boolean(process.env.CI)

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: `http://${IS_CI ? '0.0.0.0:8880' : 'localhost:3000'}`,
    specPattern: ['cypress/e2e/**/*.spec.ts']
  },
  pageLoadTimeout: 120000,
  projectId: 's1fr1i',
  retries: {
    openMode: 0,
    runMode: 5
  },
  screenshotOnRunFailure: true,
  scrollBehavior: false,
  viewportHeight: 1024,
  viewportWidth: 1280,
  waitForAnimations: true
})
