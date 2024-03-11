import { setGeometry } from '../../../../src/domain/shared_slices/Draw'
import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'
import { visitSideWindow } from '../../utils/visitSideWindow'

import type { GeoJSON } from '../../../../src/domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

context('Side Window > Mission Form > Main Form', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
  })

  it('A mission should be created', () => {
    // Given
    visitSideWindow()
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.wrap(numberOfMissions).as('numberOfMissions')
    })

    cy.get('*[data-cy="add-mission"]').click()

    //  cy.get('div').contains('Mission non enregistrée.')
    cy.get('.Element-Tag').contains('Enregistrement auto. actif')
    // When
    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])

    // with wrong end date of mission
    cy.fill('Date de fin (UTC)', [2024, 5, 25, 14, 15])
    cy.get('form').submit()
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de fin doit être postérieure à la date de début')

    // with good date
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'Cross Etel')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')

    // Then
    cy.waitForLastRequest(
      '@createMission',
      {
        body: {
          controlUnits: [
            {
              administration: 'DIRM / DM',
              id: 10011,
              name: 'Cross Etel'
            }
          ],
          isClosed: false,
          missionTypes: ['SEA', 'LAND'],
          openBy: 'PCF'
        }
      },
      5
    )
      .its('response.statusCode')
      .should('eq', 200)
    //  cy.get('div').contains('Mission créée par le')
    //  cy.get('div').contains('Dernière modification enregistrée')
  })

  it('A mission should be created When auto-save is not enabled', () => {
    // Given
    visitSideWindow('false')

    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait('@getMissions')
    cy.wait(400) // a first render with 0 missions is likely to happen
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.wrap(numberOfMissions).as('numberOfMissions')
    })

    cy.get('*[data-cy="add-mission"]').click()

    cy.get('form').submit()
    cy.wait(100)
    cy.get('.Element-Tag').contains('Enregistrement auto. inactif')
    // When
    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])

    // with wrong end date of mission
    cy.fill('Date de fin (UTC)', [2024, 5, 25, 14, 15])
    cy.get('form').submit()
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de fin doit être postérieure à la date de début')

    // with good date
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'Cross Etel')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')

    const geometry: GeoJSON.Geometry = {
      coordinates: [
        [
          [
            [-3.9617884109581034, 47.721266748801554],
            [-3.950968256158881, 47.72820847289114],
            [-3.9463533907207182, 47.718950664687924],
            [-3.9617884109581034, 47.721266748801554]
          ]
        ]
      ],
      type: 'MultiPolygon'
    }
    cy.clickButton('Ajouter une zone de mission manuelle').wait(1000)
    dispatch(setGeometry(geometry))

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')
    cy.clickButton('Enregistrer')

    // Then
    cy.waitForLastRequest(
      '@createMission',
      {
        body: {
          controlUnits: [
            {
              administration: 'DIRM / DM',
              id: 10011,
              name: 'Cross Etel'
            }
          ],
          isClosed: false,
          missionTypes: ['SEA', 'LAND'],
          openBy: 'PCF'
        }
      },
      5
    )
      .its('response.statusCode')
      .should('eq', 200)

    cy.wait('@getMissions')
    cy.wait(500)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.get('@numberOfMissions').then(numberOfMissionsBefore => {
        expect(numberOfMissions).equal(parseInt(numberOfMissionsBefore as unknown as string, 10) + 1)
      })
    })
  })

  it('A mission tab should be closed', () => {
    // Given
    visitSideWindow()
    cy.get('[data-cy="edit-mission-25"]').click({ force: true })
    cy.wait(500)

    // Back to missions list
    cy.get('[data-cy="mission-0"]').click({ force: true, multiple: true })
    cy.wait(500)

    cy.get('[data-cy="edit-mission-38"]').click({ force: true })
    cy.wait(500)

    cy.get('[data-cy="mission-1"]').click({ force: true, multiple: true })
    cy.wait(500)
    cy.get('[data-cy="mission-2"]').click({ force: true, multiple: true })

    cy.wait(500)

    cy.get('[data-cy="mission-2"] > [aria-label="close"]').eq(0).click({ force: true })
    cy.wait(500)
  })

  it('A closed mission should be reopenable, editable and saved again', () => {
    // Given
    visitSideWindow()
    cy.wait(200)
    cy.get('*[data-cy="edit-mission-25"]').click({ force: true })

    cy.intercept('PUT', `/bff/v1/missions/25`).as('updateMission')
    cy.get('*[data-cy="reopen-mission"]').click()

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.isClosed).equal(false)
    })
  })

  it('A closed mission can be saved and stay closed', () => {
    // Given
    visitSideWindow()
    cy.wait(200)
    cy.get('*[data-cy="edit-mission-38"]').click({ force: true })
    cy.intercept('PUT', '/bff/v1/missions/38').as('updateMission')
    cy.fill("Contact de l'unité 1", 'Test')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.isClosed).equal(true)
    })
  })

  it('A mission from monitorFish cannot be deleted', () => {
    // Given
    visitSideWindow()
    cy.wait(200)

    cy.get('*[data-cy="select-period-filter"]').click()
    cy.get('div[data-key="MONTH"]').click()

    cy.get('*[data-cy="edit-mission-50"]').click({ force: true })

    // Then
    cy.get('*[data-cy="delete-mission"]').should('be.disabled')
  })

  it('A user can delete mission if control unit already engaged and be redirected to filtered mission list', () => {
    // Given
    visitSideWindow()
    cy.wait(200)
    cy.intercept('GET', '/api/v1/missions/engaged_control_units').as('getEngagedControlUnits')

    // When
    cy.get('*[data-cy="add-mission"]').click()
    cy.fill('Unité 1', 'PAM Jeanne Barret')
    cy.wait('@getEngagedControlUnits')

    // Then
    cy.get('body').contains('Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')
    cy.clickButton("Non, l'abandonner")

    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')

    // table have two rows for one résult because of the header
    cy.get('.Table-SimpleTable tr').should('have.length', 2)
  })

  it('A user can create mission even if control unit already engaged', () => {
    visitSideWindow()
    cy.wait(200)
    cy.intercept('GET', '/api/v1/missions/engaged_control_units').as('getEngagedControlUnits')

    cy.get('*[data-cy="add-mission"]').click()

    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'PAM Jeanne Barret')
    cy.wait('@getEngagedControlUnits')
    cy.get('body').contains('Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')

    cy.getDataCy('add-other-control-unit').should('be.disabled')
    cy.clickButton('Oui, la conserver')

    // we want to test with a second engaged control unit
    cy.getDataCy('add-other-control-unit').should('not.be.disabled')
    cy.clickButton('Ajouter une autre unité')
    cy.fill('Unité 2', 'DML 2A')
    cy.wait(200)
    cy.get('body').contains('Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')
    cy.clickButton('Oui, la conserver')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')

    // Then
    cy.waitForLastRequest(
      '@createMission',
      {
        body: {
          controlUnits: [
            {
              administration: 'DIRM / DM',
              id: 10121,
              name: 'PAM Jeanne Barret'
            }
          ],
          isClosed: false,
          missionTypes: ['SEA', 'LAND'],
          openBy: 'PCF'
        }
      },
      5
    )
      .its('response.statusCode')
      .should('eq', 200)
  })

  it('A warning should not be displayed When it is an edited mission', () => {
    // Given
    visitSideWindow()
    cy.wait(200)
    cy.intercept('GET', '/api/v1/missions/engaged_control_units').as('getEngagedControlUnits')

    // When
    cy.get('*[data-cy="edit-mission-43"]').click({ force: true })

    // Then
    cy.get('body').should('not.contain', 'Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')
  })

  it('The mission form Should be updated When a mission update event is received', () => {
    // Given
    visitSideWindow()
    cy.wait(200)
    cy.get('*[data-cy="edit-mission-43"]').click({ force: true })

    cy.wait(500)
    cy.window()
      .its('mockEventSources' as any)
      .then(mockEventSources => {
        mockEventSources['/api/v1/missions/sse'].emitOpen()
        mockEventSources['/api/v1/missions/sse'].emit(
          'MISSION_UPDATE',
          new MessageEvent('MISSION_UPDATE', {
            bubbles: true,
            data: JSON.stringify({
              attachedReportingIds: [],
              attachedReportings: [],
              // Changed field
              closedBy: 'LTH',
              controlUnits: [
                {
                  administration: 'DREAL / DEAL',
                  contact: 'Full contact',
                  id: 10018,
                  isArchived: false,
                  name: 'DREAL Pays-de-La-Loire',
                  resources: []
                }
              ],
              detachedReportingIds: [],
              detachedReportings: [],
              endDateTimeUtc: '2024-01-08T16:55:41.314507Z',
              envActions: [],
              facade: 'NAMO',
              geom: {
                coordinates: [
                  [
                    [
                      [-4.14598393, 49.02650252],
                      [-3.85722498, 48.52088004],
                      [-3.54255983, 48.92233858],
                      [-3.86251979, 49.15131242],
                      [-4.09368042, 49.18079556],
                      [-4.14598393, 49.02650252]
                    ]
                  ]
                ],
                type: 'MultiPolygon'
              },
              hasMissionOrder: false,
              id: 43,
              isClosed: false,
              isUnderJdp: false,
              missionSource: 'MONITORENV',
              missionTypes: ['SEA'],
              observationsCacem: 'Anything box film quality. Lot series agent out rule end young pressure.',
              // Changed field
              observationsCnsp: 'Encore une observation',
              // Changed field
              openBy: 'LTH',
              startDateTimeUtc: '2024-01-01T06:14:55.887549Z'
            })
          })
        )
      })

    cy.wait(500)
    cy.intercept('PUT', '/bff/v1/missions/43').as('updateMission')
    cy.get('[name="missionTypes1"]').click({ force: true })
    cy.wait(250)

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          closedBy: 'LTH',
          observationsCnsp: 'Encore une observation',
          openBy: 'LTH'
        }
      },
      5
    )
      .its('response.statusCode')
      .should('eq', 200)
  })

  it('Should keep the existing archived resources when appending new resources', () => {
    visitSideWindow()

    // -------------------------------------------------------------------------
    // Open

    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=*`).as('getMissions')
    cy.fill('Période', 'Période spécifique')
    const startDateInString = getUtcDateInMultipleFormats().utcDateAsDayjs.subtract(6, 'month').toISOString()
    const endDateInString = getUtcDateInMultipleFormats().utcDateAsDayjs.subtract(3, 'month').toISOString()
    const startDate = getUtcDateInMultipleFormats(startDateInString).utcDateTuple
    const endDate = getUtcDateInMultipleFormats(endDateInString).utcDateTuple
    cy.fill('Période spécifique', [startDate, endDate])

    cy.wait('@getMissions')

    cy.intercept('GET', '/bff/v1/missions/30').as('getMission')

    cy.get('*[data-cy="edit-mission-30"]').click({ force: true }).wait(500)

    cy.wait('@getMission')

    // -------------------------------------------------------------------------
    // Update

    // We do that manually to keep the existing "Voiture" resource which is an archived one.
    cy.intercept('PUT', '/bff/v1/missions/30').as('updateMission')
    cy.contains('Moyen(s) 1').parent().find('.rs-picker-caret-icon').forceClick().wait(250)
    cy.get('span[title="Semi-rigide 1"]').forceClick().wait(250)
    cy.clickOutside()
    cy.wait(250)

    cy.fill("Contact de l'unité 1", 'Un contact')
    cy.fill("Contact de l'unité 2", 'Un autre contact')
    cy.wait(250)

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          controlUnits: [
            {
              administration: 'DDTM',
              contact: 'Un contact',
              id: 10000,
              isArchived: false,
              name: 'Cultures marines – DDTM 40',
              resources: [
                { id: 1, name: 'Semi-rigide 1' },
                { controlUnitId: 10000, id: 13, name: 'Voiture' }
              ]
            },
            {
              administration: 'DDTM',
              contact: 'Un autre contact',
              id: 10002,
              isArchived: false,
              name: 'DML 2A',
              resources: []
            }
          ]
        }
      },
      5
    )
      .its('response.statusCode')
      .should('eq', 200)

    // -------------------------------------------------------------------------
    // Reset

    cy.wait(500)
    cy.clickButton('Fermer')
    cy.get('*[data-cy="edit-mission-30"]').click({ force: true }).wait(500)

    cy.wait('@getMission')

    cy.contains('Moyen(s) 1').parent().find('.rs-picker-caret-icon').forceClick().wait(250)
    cy.get('span[title="Semi-rigide 1"]').forceClick().wait(250) // Uncheck this resource
    cy.clickOutside()
    cy.wait(250)
  })

  it('Should display the archived control unit and administration when edit mission', () => {
    visitSideWindow()
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=*`).as('getMissions')
    cy.fill('Période', 'Période spécifique')
    const startDateInString = getUtcDateInMultipleFormats().utcDateAsDayjs.subtract(6, 'month').toISOString()
    const endDateInString = getUtcDateInMultipleFormats().utcDateAsDayjs.toISOString()
    const startDate = getUtcDateInMultipleFormats(startDateInString).utcDateTuple
    const endDate = getUtcDateInMultipleFormats(endDateInString).utcDateTuple
    cy.fill('Période spécifique', [startDate, endDate])

    cy.wait('@getMissions')

    cy.intercept('GET', '/bff/v1/missions/40').as('getMission')

    cy.get('*[data-cy="edit-mission-40"]').click({ force: true }).wait(500)

    cy.wait('@getMission')

    cy.getDataCy('add-control-unit').find('.rs-picker-toggle-value').contains('Unité archivée')
    cy.getDataCy('add-control-administration').find('.rs-picker-toggle-value').contains('Administration Archivée 2')
  })
})
