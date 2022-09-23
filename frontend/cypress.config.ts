import { defineConfig } from 'cypress'
import { platform } from 'os'

import cypressPlugins from './cypress/plugins'

const IS_CI = Boolean(process.env.CI)
const DEFAULT_PORT = IS_CI || platform() === 'darwin' ? 3000 : 3000

export default defineConfig({
  // We do that to avoid e2e logs pollution with useless`GET /security-state-staging/intermediates/` lines
  // Despite the name, this aso applies to Firefox
  chromeWebSecurity: false,
  e2e: {
    baseUrl: `http://localhost:${DEFAULT_PORT}`,
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return cypressPlugins(on, config) as any
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}'
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
  port: 3002,
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
