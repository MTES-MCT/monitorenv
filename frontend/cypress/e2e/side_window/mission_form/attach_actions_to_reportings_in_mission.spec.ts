import { attachReportingToMissionSliceActions } from '@features/Mission/components/MissionForm/AttachReporting/slice'
import { getFormattedReportingId } from '@features/Reportings/utils'

import { createMissionWithAttachedReportingAndAttachedAction } from '../../utils/createMissionWithAttachedReportingAndAttachedAction'
import { createReportingOnSideWindow } from '../../utils/createReportingOnSideWindow'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

context('Side Window > Mission Form > Attach action to reporting', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
        Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
      }
    })
    cy.wait(500)
  })

  it('A control can be attached to a reporting', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-38').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('control-form-toggle-reporting').click({ force: true })
    cy.intercept('PUT', `/bff/v1/missions/38`).as('updateMission')
    cy.fill('Signalements', '8')

    cy.getDataCy('control-attached-reporting-tag').should('be.visible')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 1)
    cy.getDataCy('reporting-status-action-tag').contains('Ctl fait')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const controlWithAttachedReporting = response?.body.envActions.find(
        action => action.id === 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'
      )
      const attachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 8)

      expect(controlWithAttachedReporting.reportingIds.length).equal(1)
      expect(controlWithAttachedReporting.reportingIds[0]).equal(8)
      expect(attachedReporting.attachedEnvActionId).equal('f3e90d3a-6ba4-4bb3-805e-d391508aa46d')
    })
  })

  it('A control can be detached to a reporting', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-38').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('control-attached-reporting-tag').should('exist')
    cy.getDataCy('reporting-status-action-tag').contains('Ctl fait')
    cy.intercept('PUT', `/bff/v1/missions/38`).as('updateMission')
    cy.getDataCy('control-form-toggle-reporting').click({ force: true })

    cy.getDataCy('control-attached-reporting-tag').should('not.exist')
    cy.getDataCy('reporting-status-action-tag').should('not.exist')

    // Then
    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              id: 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d',
              reportingIds: []
            }
          ]
        }
      },
      5,
      0,
      response => {
        expect(response && response.statusCode).equal(200)
        const controlWithAttachedReporting = response?.body.envActions.find(
          action => action.id === 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'
        )
        const attachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 8)

        expect(controlWithAttachedReporting.reportingIds.length).equal(0)
        expect(attachedReporting.attachedEnvActionId).equal(null)
      }
    )
  })
  it('A surveillance can be detached to reportings', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-53').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()

    cy.intercept('PUT', `/bff/v1/missions/53`).as('updateMission')
    cy.wait(250)
    cy.getDataCy('surveillance-form-toggle-reporting').click({ force: true })

    cy.getDataCy('surveillance-attached-reportings-tags').should('not.exist')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 1)

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const surveillanceWithAttachedReportings = response?.body.envActions.find(
        action => action.id === '9969413b-b394-4db4-985f-b00743ffb833'
      )
      const firstAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 9)
      const secondAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 11)

      expect(surveillanceWithAttachedReportings.reportingIds.length).equal(0)
      expect(firstAttachedReporting.attachedEnvActionId).equal(null)
      expect(secondAttachedReporting.attachedEnvActionId).equal(null)
    })
  })
  it('A surveillance can be attached to multiple reportings', () => {
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.intercept('PUT', '/bff/v1/missions/53').as('updateMission')

    cy.wait(400)
    cy.getDataCy('edit-mission-53').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.wait(200)
    cy.getDataCy('surveillance-form-toggle-reporting').click({ force: true })
    cy.wait(200)

    cy.fill('Signalements', ['9'])
    cy.getDataCy('surveillance-attached-reportings-tags').should('exist')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 2)
    cy.getDataCy('reporting-status-action-tag').contains('Srv faite')
    cy.wait(500)

    cy.fill('Signalements', ['9', '11'], { delay: 500 })
    cy.getDataCy('reporting-status-action-tag').should('have.length', 3)
    cy.wait(500)

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              id: '2cdcd429-19ab-45ed-a892-7c695bd256e2',
              reportingIds: []
            },
            {
              id: '3480657f-7845-4eb4-aa06-07b174b1da45',
              reportingIds: [10]
            },
            {
              id: '9969413b-b394-4db4-985f-b00743ffb833',
              reportingIds: [9, 11]
            }
          ]
        }
      },
      5,
      0,
      response => {
        expect(response && response.statusCode).equal(200)
        const surveillanceWithAttachedReportings = response?.body.envActions.find(
          action => action.id === '9969413b-b394-4db4-985f-b00743ffb833'
        )
        const firstAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 9)
        const secondAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 11)

        expect(surveillanceWithAttachedReportings.reportingIds.length).equal(2)
        expect(firstAttachedReporting.attachedEnvActionId).equal('9969413b-b394-4db4-985f-b00743ffb833')
        expect(secondAttachedReporting.attachedEnvActionId).equal('9969413b-b394-4db4-985f-b00743ffb833')
      }
    )
  })

  it('A control with infraction can be created from a reporting', () => {
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')

    // create a reporting
    createReportingOnSideWindow().then(reportingResponse => {
      const firstReporting = reportingResponse?.body

      // create another reporting and attach it to a new mission
      createMissionWithAttachedReportingAndAttachedAction().then(missionResponse => {
        const missionId = missionResponse.body.id
        cy.intercept('PUT', `/bff/v1/missions/${missionId}`).as('updateMission')
        cy.clickButton('Editer')
        cy.getDataCy('infraction-form').should('be.visible')

        cy.getDataCy('envaction-theme-selector').contains('Rejet')
        cy.getDataCy('envaction-theme-element').contains('Carénage sauvage')
        cy.getDataCy('infraction-form-registrationNumber').should('have.value', '123456789')
        cy.getDataCy('infraction-form-controlledPersonIdentity').should('have.value', 'Capitaine Crochet')
        cy.getDataCy('infraction-form-vesselName').should('have.value', 'Le Bateau 2000')
        cy.getDataCy('infraction-form-vessel-size').should('have.value', 13)
        cy.getDataCy('infraction-form-nbTarget').should('have.value', 1)
        cy.fill("Type d'infraction", 'Avec PV')
        cy.fill('Réponse administrative', 'Sanction')
        cy.fill('Mise en demeure', 'En attente')
        cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])

        return cy.waitForLastRequest(
          '@updateMission',
          {
            body: {
              envActions: [
                {
                  openBy: 'ABC'
                }
              ],
              missionTypes: ['SEA']
            }
          },
          5,
          undefined,
          response => {
            const attachedReporting = response.body.attachedReportings
            // we attach the first created reporting to mission and update reporting attached to action
            cy.clickButton('Lier un signalement')
            dispatch(
              attachReportingToMissionSliceActions.setAttachedReportings([
                ...attachedReporting,
                { ...firstReporting, missionId }
              ])
            )

            const formattedReportingId = getFormattedReportingId(firstReporting.reportingId)
            cy.fill('Signalements', formattedReportingId)

            cy.getDataCy('envaction-theme-selector').contains('Culture marine')
            cy.getDataCy('envaction-theme-element').contains('Remise en état après occupation du DPM')
            cy.getDataCy('infraction-form-registrationNumber').should('have.value', '987654321')
            cy.getDataCy('infraction-form-vesselName').should('have.value', 'The Boat')
            cy.get('.Field-MultiRadio').contains("Type d'infraction").get('[aria-checked="true"]').contains('Avec PV')
            cy.get('.Field-MultiRadio')
              .contains('Réponse administrative')
              .get('[aria-checked="true"]')
              .contains('Sanction')
            cy.get('.Field-MultiRadio').contains('Mise en demeure').get('[aria-checked="true"]').contains('En attente')
            cy.get('[name="infraction-natinf"]').should('have.value', 1508)
            cy.getDataCy('infraction-form-nbTarget').should('have.value', 1)

            cy.wait(250)

            cy.clickButton('Supprimer la mission')
            cy.wait(400)
            cy.get('*[name="delete-mission-modal-confirm"]').click()
          }
        )
      })
    })
  })
})
