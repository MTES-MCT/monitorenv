import { defineConfig } from 'cypress'
import initCypressMousePositionPlugin from 'cypress-mouse-position/plugin'
import { initPlugin } from 'cypress-plugin-snapshots/plugin'
import { platform } from 'os'

const IS_CI = Boolean(process.env.CI)
const IS_DARWIN = platform() === 'darwin'
const WEBAPP_PORT = IS_CI ? 8880 : 3000
const WEBAPP_HOST = IS_DARWIN ? '0.0.0.0' : 'localhost'

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
    specPattern: [
      'cypress/e2e/00_side_window_missions.spec.ts',
      'cypress/e2e/01_side_window_mission.spec.ts',
      'cypress/e2e/02_side_window_mission_actions.spec.ts',
      'cypress/e2e/03_side_window_missions_navigation.spec.ts',
      'cypress/e2e/05_side_window_reportings.spec.ts',
      // 'cypress/e2e/04_create_reporting.spec.ts',
      'cypress/e2e/**/*.spec.ts'
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
