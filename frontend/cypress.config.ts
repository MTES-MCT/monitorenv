import { defineConfig } from 'cypress'
import { platform } from 'os'

import cypressPlugins from './cypress/plugins'

const IS_CI = Boolean(process.env.CI)
const DEFAULT_PORT = IS_CI || platform() === 'darwin' ? 8880 : 3000

export default defineConfig({
  // We do that to avoid e2e logs pollution with useless`GET /security-state-staging/intermediates/` lines
  // Despite the name, this aso applies to Firefox
  chromeWebSecurity: false,
  e2e: {
    baseUrl: IS_CI ? `http://localhost:${DEFAULT_PORT}` : `http://0.0.0.0:3000`,
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return cypressPlugins(on, config) as any
    },
    specPattern: [
      'cypress/e2e/00_side_window_missions.spec.ts',
      'cypress/e2e/01_side_window_mission.spec.ts',
      'cypress/e2e/02_side_window_mission_actions.spec.ts',
      'cypress/e2e/03_side_window_missions_navigation.spec.ts',
      'cypress/e2e/04_reportings.spec.ts'
      // 'cypress/e2e/04_create_reporting.spec.ts'
    ]
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
