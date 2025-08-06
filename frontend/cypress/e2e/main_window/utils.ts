import { FAKE_MAPBOX_RESPONSE } from '../constants'

export function goToMainWindow() {
  cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
  cy.login('superuser')
  cy.visit(`/`, {
    onBeforeLoad() {
      Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
      Cypress.env('CYPRESS_REPORTING_FORM_AUTO_UPDATE', 'true')
    }
  })
  cy.wait(1000)
}
