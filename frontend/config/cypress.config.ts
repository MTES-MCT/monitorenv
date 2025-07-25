/* eslint-disable import/extensions */
import { defineConfig } from 'cypress'

const IS_CI = Boolean(process.env.CI)
const WEBAPP_PORT = IS_CI ? 8880 : 3000
const WEBAPP_HOST = 'localhost'

export default defineConfig({
  e2e: {
    baseUrl: `http://${WEBAPP_HOST}:${WEBAPP_PORT}`,
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
