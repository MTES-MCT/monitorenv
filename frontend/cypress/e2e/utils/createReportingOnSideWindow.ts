import { setGeometry } from 'domain/shared_slices/Draw'

import type { GeoJSON } from 'domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

export function createReportingOnSideWindow() {
  cy.clickButton('Signalements')
  cy.clickButton('Ajouter un nouveau signalement')
  cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
  cy.wait(500)

  // When
  cy.get('div').contains('Signalement non créé')
  cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

  cy.getDataCy('reporting-target-type').click({ force: true })
  cy.get('div[role="option"]').contains('Véhicule').click()

  cy.fill('Type de véhicule', 'Navire')
  cy.fill('Nom du navire', 'The Boat')
  cy.fill('Immatriculation', '987654321')
  cy.fill('Taille', 54)

  cy.clickButton('Ajouter un point')

  const geometry: GeoJSON.Geometry = {
    coordinates: [[-16.12054383, 49.94264815]],
    type: 'MultiPoint'
  }

  dispatch(setGeometry(geometry))

  cy.get('.rs-radio').find('label').contains('Infraction (susp.)').click()

  cy.fill('Thématiques et sous-thématiques', ['Remise en état après occupation du DPM'])
  cy.fill('Tags et sous-tags', ['Mixte'])

  cy.wait(250)
  cy.fill('Saisi par', 'XYZ')

  return cy.wait('@createReporting').then(({ response }) => {
    cy.clickButton('Fermer')

    return Promise.resolve(response)
  })
}
