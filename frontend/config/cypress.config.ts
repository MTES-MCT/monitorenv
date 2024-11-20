/* eslint-disable import/extensions */
import { defineConfig } from 'cypress'
import initCypressMousePositionPlugin from 'cypress-mouse-position/plugin.js'
import { initPlugin } from 'cypress-plugin-snapshots/plugin.js'

const IS_CI = Boolean(process.env.CI)
const WEBAPP_PORT = IS_CI ? 8880 : 3000
const WEBAPP_HOST = 'localhost'

export default defineConfig({
  e2e: {
    baseUrl: `http://${WEBAPP_HOST}:${WEBAPP_PORT}`,
    // We do that to avoid e2e logs pollution with useless `GET /security-state-staging/intermediates/` lines.
    // Despite the name, this also applies to Firefox.
    chromeWebSecurity: false,
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    setupNodeEvents(on, config) {
      initCypressMousePositionPlugin(on)
      initPlugin(on, config)
    },
    specPattern: 'cypress/e2e/**/*.spec.ts'
  },
  env: {
    'cypress-plugin-snapshots': {
      imageConfig: {
        threshold: 20,
        thresholdType: 'pixel'
      },
      updateSnapshots: false
    }
  },
  projectId: 's1fr1i',
  retries: {
    openMode: 0,
    runMode: 5
  },
  screenshotOnRunFailure: true,
  scrollBehavior: false,
  video: false,
  viewportHeight: 1024,
  viewportWidth: 1280,
  waitForAnimations: true
})
