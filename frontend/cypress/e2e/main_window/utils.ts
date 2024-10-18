import { FAKE_MAPBOX_RESPONSE } from '../constants'

export function goToMainWindow() {
  cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

  cy.visit(`/`).wait(1000)
}

export function getBaseLayerSnapShot() {
  cy.get('.baselayer').toMatchImageSnapshot({
    imageConfig: {
      threshold: 0.05,
      thresholdType: 'percent'
    },
    screenshotConfig: {
      clip: { height: 250, width: 250, x: 440, y: 450 }
    }
  })
}
