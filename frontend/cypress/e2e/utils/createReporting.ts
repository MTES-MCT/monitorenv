import { setGeometry } from 'domain/shared_slices/Draw'

import type { GeoJSON } from 'domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

export function createReporting() {
  cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
  // When
  cy.fill('Source (1)', 'Autre')
  cy.fill('Nom, société ...', 'Source du signalement')
  cy.getDataCy('reporting-target-type').click({ force: true })

  cy.clickButton('Ajouter un point')
  const geometry: GeoJSON.Geometry = {
    coordinates: [[-16.12054383, 49.94264815]],
    type: 'MultiPoint'
  }
  dispatch(setGeometry(geometry))

  cy.get('.rs-radio').find('label').contains('Observation').click()
  cy.wait(250)
  cy.fill('Thématiques et sous-thématiques', ['Carénage sauvage'])
  cy.fill('Thématique du signalement', 'Rejet')
  cy.fill('Sous-thématique du signalement', ['Carénage sauvage'])

  cy.fill('Saisi par', 'XYZ')

  return cy.wait('@createReporting').then(response => Promise.resolve(response))
}
