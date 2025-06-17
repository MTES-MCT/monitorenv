import { FAKE_MAPBOX_RESPONSE } from '../constants'

describe('Vérification accessibilité RGAA avec axe-core', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.intercept('GET', '/api/v1/stations').as('getStations')
    cy.viewport(1580, 1024)

    cy.visit(`/`, {
      onBeforeLoad() {
        Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
      }
    })
    cy.wait(['@getReportings', '@getStations'])
    cy.injectAxe() // Injecte axe-core dans la page
  })

  it('devrait respecter les critères de base RGAA (axe)', () => {
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    // @ts-ignore
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'] // RGAA s’appuie sur WCAG 2.1 A et AA
      }
    })
  })
})
