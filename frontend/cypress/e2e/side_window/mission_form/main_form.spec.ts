import { customDayjs } from '@mtes-mct/monitor-ui'

import { setGeometry } from '../../../../src/domain/shared_slices/Draw'
import { createPendingMission } from '../../utils/createPendingMission'
import { getPreviousMonthUTC, todayUTC } from '../../utils/dates'
import { getMissionEndDateWithTime } from '../../utils/getMissionEndDate'
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
    cy.getDataCy('mission-status-tag-pending').should('exist')
    cy.getDataCy('completion-mission-status-tag-to-completed').should('exist')

    cy.get('div').contains('Mission non créée.')
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

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')

    cy.fill('Unité 1', 'Cross Etel')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

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
          missionTypes: ['SEA', 'LAND']
        }
      },
      5
    )
      .its('response.statusCode')
      .should('eq', 200)
    cy.get('div').contains('Mission créée par le')
    cy.get('div').contains('Dernière modification enregistrée')
    cy.get('.Component-Banner').contains('La mission a bien été créée')
    cy.clickButton('Supprimer la mission')
    cy.get('*[name="delete-mission-modal-confirm"]').click()
  })

  it('A mission should be created When auto-save is not enabled', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    visitSideWindow('false')

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
    cy.wait('@createMission').then(({ response }) => {
      const id = response?.body.id
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.equal(response.statusCode, 200)

      cy.wait('@getMissions')
      cy.wait(500)
      cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
        const numberOfMissions = parseInt($el.text(), 10)
        cy.get('@numberOfMissions').then(numberOfMissionsBefore => {
          expect(numberOfMissions).equal(parseInt(numberOfMissionsBefore as unknown as string, 10) + 1)
        })
      })
      cy.get(`*[data-cy="edit-mission-${id}"]`).scrollIntoView().click({ force: true })
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

  it('A mission from monitorFish cannot be deleted', () => {
    // Given
    visitSideWindow()
    cy.wait(200)

    cy.get('*[data-cy="select-period-filter"]').click()
    cy.get('div[data-key="MONTH"]').click()

    cy.get('*[data-cy="edit-mission-50"]').scrollIntoView().click({ force: true })

    // Then
    cy.get('*[data-cy="delete-mission"]').should('be.disabled')
  })

  it('An user can cancel mission creation if control unit already engaged and be redirected to filtered mission list', () => {
    // Given
    visitSideWindow()
    cy.wait(200)
    const { asDatePickerDate: expectedStartDate } = getUtcDateInMultipleFormats(
      getPreviousMonthUTC(2, customDayjs().utc())
    )
    const { asDatePickerDate: expectedEndDate } = getUtcDateInMultipleFormats(todayUTC())

    cy.fill('Période', 'Période spécifique')
    cy.fill('Période spécifique', [expectedStartDate, expectedEndDate])
    const controlUnit = 'PAM Jeanne Barret'
    cy.fill('Unité', [controlUnit])
    cy.fill('Statut de mission', ['En cours'])

    cy.get('.Table-SimpleTable tr').then(rows => {
      cy.intercept('GET', '/api/v1/missions/engaged_control_units').as('getEngagedControlUnits')

      // When
      cy.get('*[data-cy="add-mission"]').click()
      cy.fill('Unité 1', controlUnit)
      cy.wait('@getEngagedControlUnits')

      // Then
      cy.get('body').contains('Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')
      cy.clickButton("Non, l'abandonner")

      cy.intercept('GET', '/bff/v1/missions*').as('getMissions')

      // table should have the same number of rows than before
      cy.get('.Table-SimpleTable tr').should('have.length', rows.length)
    })
  })

  it('An user can create mission even if control unit already engaged', () => {
    visitSideWindow()
    cy.wait(200)
    cy.intercept('GET', '/api/v1/missions/engaged_control_units').as('getEngagedControlUnits')

    cy.get('*[data-cy="add-mission"]').click()

    const startDate = getUtcDateInMultipleFormats().asDatePickerDateTime
    const endDate = getMissionEndDateWithTime(7, 'day')

    cy.fill('Date de début (UTC)', startDate)
    cy.fill('Date de fin (UTC)', endDate)

    cy.fill('Unité 1', 'PAM Jeanne Barret')
    cy.wait('@getEngagedControlUnits')
    cy.get('body').contains('Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')

    cy.getDataCy('add-other-control-unit').should('be.disabled')
    cy.clickButton('Oui, la conserver')
    cy.wait(250)

    // we want to test with a second engaged control unit
    cy.getDataCy('add-other-control-unit').should('not.be.disabled')
    cy.clickButton('Ajouter une autre unité')
    cy.fill('Unité 2', 'DML 2A')
    cy.wait(200)
    cy.get('body').contains('Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')
    cy.clickButton('Oui, la conserver')

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

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
          missionTypes: ['SEA', 'LAND']
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
    cy.get('*[data-cy="edit-mission-43"]').scrollIntoView().click({ force: true })

    // Then
    cy.get('body').should('not.contain', 'Une autre mission, ouverte par le CACEM, est en cours avec cette unité.')
  })

  it('The mission form Should be updated When a mission update event is received', () => {
    // Given
    visitSideWindow()
    cy.wait(200)

    createPendingMission().then(response => {
      const missionId = response.body.id

      cy.clickButton('Fermer')
      cy.wait(500)
      cy.get(`*[data-cy="edit-mission-${missionId}"]`).scrollIntoView().click({ force: true })

      cy.intercept('PUT', `/bff/v1/missions/${missionId}`).as('updateMission')
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
                completedBy: 'LTH',
                controlUnits: [
                  {
                    administration: 'Gendarmerie Nationale',
                    // Changed field
                    contact: 'contact',
                    id: 10020,
                    isArchived: false,
                    name: 'BN Toulon',
                    resources: []
                  }
                ],
                detachedReportingIds: [],
                detachedReportings: [],
                endDateTimeUtc: response.body.endDateTimeUtc,
                envActions: [],
                facade: null,
                geom: null,
                hasMissionOrder: false,
                id: missionId,
                isUnderJdp: false,
                missionSource: 'MONITORENV',
                missionTypes: ['SEA'],
                observationsCacem: null,
                // Changed field
                observationsCnsp: 'Encore une observation',
                // Changed field
                openBy: 'LTH',
                startDateTimeUtc: response.body.startDateTimeUtc
              })
            })
          )
        })

      cy.wait(500)
      cy.get('[name="missionTypes1"]').click({ force: true })
      cy.wait(250)

      cy.waitForLastRequest(
        '@updateMission',
        {
          body: {
            controlUnits: [
              {
                administration: 'Gendarmerie Nationale',
                contact: 'contact',
                id: 10020,
                isArchived: false,
                name: 'BN Toulon',
                resources: []
              }
            ],
            // TODO : uncomment this field when Fish andRapportNav have deleted closedBy field
            // completedBy: 'LTH',
            missionTypes: ['SEA', 'LAND'],
            observationsCnsp: 'Encore une observation',
            openBy: 'LTH'
          }
        },
        5
      )
        .its('response.statusCode')
        .should('eq', 200)

      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('Should keep the existing archived resources when appending new resources', () => {
    visitSideWindow()

    // -------------------------------------------------------------------------
    // Open

    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=*`).as('getMissions')
    cy.fill('Période', 'Période spécifique')
    const startDateInString = getUtcDateInMultipleFormats().asDayjsUtcDate.subtract(6, 'month').toISOString()
    const endDateInString = getUtcDateInMultipleFormats().asDayjsUtcDate.subtract(3, 'month').toISOString()
    const startDate = getUtcDateInMultipleFormats(startDateInString).asDatePickerDate
    const endDate = getUtcDateInMultipleFormats(endDateInString).asDatePickerDate
    cy.fill('Période spécifique', [startDate, endDate])

    cy.wait('@getMissions')

    cy.intercept('GET', '/bff/v1/missions/30').as('getMission')

    cy.get('*[data-cy="edit-mission-30"]').scrollIntoView().click({ force: true }).wait(500)

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

    cy.clickButton('Enregistrer').wait(250)
    cy.wait('@updateMission').then(({ response }) => {
      if (!response) {
        return
      }

      assert.deepEqual(response.body.controlUnits, [
        {
          administration: 'DDTM',
          contact: 'Un contact',
          id: 10000,
          isArchived: false,
          name: 'Cultures marines – DDTM 40',
          resources: [
            { controlUnitId: 10000, id: 1, name: 'Semi-rigide 1' },
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
      ])
    })

    // -------------------------------------------------------------------------
    // Reset

    cy.wait(500)

    cy.get('*[data-cy="edit-mission-30"]').scrollIntoView().click({ force: true }).wait(500)

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
    const startDateInString = getUtcDateInMultipleFormats().asDayjsUtcDate.subtract(6, 'month').toISOString()
    const endDateInString = getUtcDateInMultipleFormats().asDayjsUtcDate.toISOString()
    const startDate = getUtcDateInMultipleFormats(startDateInString).asDatePickerDate
    const endDate = getUtcDateInMultipleFormats(endDateInString).asDatePickerDate
    cy.fill('Période spécifique', [startDate, endDate])

    cy.wait('@getMissions')

    cy.intercept('GET', '/bff/v1/missions/40').as('getMission')

    cy.get('*[data-cy="edit-mission-40"]').scrollIntoView().click({ force: true }).wait(500)

    cy.wait('@getMission')

    cy.getDataCy('add-control-unit').find('.rs-picker-toggle-value').contains('Unité archivée')
    cy.getDataCy('add-control-administration').find('.rs-picker-toggle-value').contains('Administration Archivée 2')
  })

  it('Should display missing fields banner if mission is ended and has missing fields', () => {
    visitSideWindow()
    cy.fill('Période', 'Un mois')
    cy.wait(500)
    cy.getDataCy('edit-mission-27').scrollIntoView().click({ force: true })
    cy.get('.Component-Banner').contains('euillez compléter ou corriger les éléments en rouge')
  })
})
