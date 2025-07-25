import { FAKE_MAPBOX_RESPONSE } from '../constants'

export function goToMainWindow() {
  cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

  cy.visit(`/`).wait(1000)
}
