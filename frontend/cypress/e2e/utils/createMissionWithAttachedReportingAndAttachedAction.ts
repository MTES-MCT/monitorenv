import { attachReportingToMissionSliceActions } from '@features/missions/MissionForm/AttachReporting/slice'
import { setGeometry } from 'domain/shared_slices/Draw'

import type { GeoJSON } from 'domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

export function createMissionWithAttachedReportingAndAttachedAction() {
  cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')

  cy.clickButton('signalements')
  cy.wait('@getReportings')
  cy.wait(1000)

  cy.clickButton('Ajouter un nouveau signalement')
  cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')

  cy.wait(1000)
  cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

  // because of the filter in reporting table with the same name
  // can't use cy.fill
  cy.getDataCy('reporting-target-type').click({ force: true })
  cy.get('div[role="option"]').contains('Véhicule').click()

  cy.fill('Type de véhicule', 'Navire')
  cy.fill('Nom du navire', 'Le Bateau 2000')
  cy.fill('Immatriculation', '123456789')
  cy.fill('Taille', 13)

  cy.clickButton('Ajouter un point')

  const geometry: GeoJSON.Geometry = {
    coordinates: [[-16.12054383, 49.94264815]],
    type: 'MultiPoint'
  }

  dispatch(setGeometry(geometry))

  cy.fill('Thématique du signalement', 'Rejet')
  cy.fill('Sous-thématique du signalement', ['Carénage sauvage'])

  cy.get('.rs-radio').find('label').contains('Infraction').click()
  cy.fill('Saisi par', 'XYZ')

  cy.wait(250)

  return cy.wait('@createReporting').then(({ response }) => {
    expect(response && response.statusCode).equal(201)

    const reporting = response?.body

    // Attach the reporting to a mission
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.clickButton('missions')
    cy.clickButton('Ajouter une nouvelle mission')

    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.fill('Unité 1', 'BN Toulon')

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')

    return cy.waitForLastRequest(
      '@createMission',
      {
        body: {
          missionTypes: ['SEA']
        }
      },
      5,
      undefined,
      missionResponse => {
        const missionId = missionResponse.body.id
        cy.clickButton('Lier un signalement')

        dispatch(
          attachReportingToMissionSliceActions.setAttachedReportings([
            {
              ...reporting,
              missionId
            }
          ])
        )

        cy.clickButton('Ajouter un contrôle')

        cy.getDataCy('control-open-by').scrollIntoView().type('ABC')
        cy.wait(250)

        return Promise.resolve(missionResponse)
      }
    )
  })
}
