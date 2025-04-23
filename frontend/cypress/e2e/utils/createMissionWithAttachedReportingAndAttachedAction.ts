import { attachReportingToMissionSliceActions } from '@features/Mission/components/MissionForm/AttachReporting/slice'
import { undefine } from '@mtes-mct/monitor-ui'
import { setGeometry } from 'domain/shared_slices/Draw'

import { getFutureDate } from './getFutureDate'

import type { GeoJSON } from 'domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

export function createMissionWithAttachedReportingAndAttachedAction() {
  cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')

  cy.clickButton('Signalements')
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
  cy.fill('Nom du capitaine', 'Capitaine Crochet')
  cy.fill('Immatriculation', '123456789')
  cy.fill('Taille', 13)

  cy.clickButton('Ajouter un point')

  const geometry: GeoJSON.Geometry = {
    coordinates: [[-16.12054383, 49.94264815]],
    type: 'MultiPoint'
  }

  dispatch(setGeometry(geometry))

  cy.fill('Thématiques et sous-thématiques', ['Carénage sauvage'])
  cy.fill('Tags et sous-tags', ['Mixte'])

  cy.get('.rs-radio').find('label').contains('Infraction').click()
  cy.fill('Saisi par', 'XYZ')

  cy.wait(250)

  return cy.wait('@createReporting').then(({ response }) => {
    expect(response && response.statusCode).equal(201)

    const reporting = response?.body

    // Attach the reporting to a mission
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.intercept('PUT', '/bff/v1/missions').as('createMission')
    cy.clickButton('Missions et contrôles')
    cy.clickButton('Ajouter une nouvelle mission')

    const endDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', endDate)

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.fill('Unité 1', 'BN Toulon')

    cy.wait(250)

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
              ...undefine(reporting),
              missionId
            }
          ])
        )

        cy.clickButton('Ajouter un contrôle')

        const controlEndDate = getFutureDate(2, 'day')
        cy.fill('Date et heure du contrôle (UTC)', controlEndDate)

        cy.getDataCy('control-open-by').scrollIntoView().type('ABC')
        cy.wait(250)

        return Promise.resolve(missionResponse)
      }
    )
  })
}
