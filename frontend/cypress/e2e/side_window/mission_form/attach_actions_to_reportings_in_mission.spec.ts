import { attachReportingToMissionSliceActions } from '@features/missions/MissionForm/AttachReporting/slice'
import { setGeometry } from 'domain/shared_slices/Draw'

import type { GeoJSON } from 'domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

context('Side Window > Mission Form > Attach action to reporting', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
      }
    })
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
    cy.intercept('PUT', `/bff/v1/missions/38`).as('updateMission')
    cy.getDataCy('control-form-toggle-reporting').click({ force: true })

    cy.getDataCy('control-attached-reporting-tag').should('not.exist')
    cy.getDataCy('reporting-control-done').should('not.exist')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const controlWithAttachedReporting = response?.body.envActions.find(
        action => action.id === 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'
      )
      const attachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 8)

      expect(controlWithAttachedReporting.reportingIds.length).equal(0)
      expect(attachedReporting.attachedEnvActionId).equal(null)
    })
  })
  it('A surveillance can be detached to reportings', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-53').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()

    cy.intercept('PUT', `/bff/v1/missions/53`).as('updateMission')
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
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-53').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('surveillance-form-toggle-reporting').click({ force: true })
    cy.wait(250)

    cy.fill('Signalements', ['9'])

    cy.getDataCy('surveillance-attached-reportings-tags').should('exist')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 2)
    cy.getDataCy('reporting-status-action-tag').contains('Srv faite')

    cy.wait(250)
    cy.fill('Signalements', ['9', '11'])
    cy.intercept('PUT', `/bff/v1/missions/53`).as('updateMission')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 3)

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const surveillanceWithAttachedReportings = response?.body.envActions.find(
        action => action.id === '9969413b-b394-4db4-985f-b00743ffb833'
      )
      const firstAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 9)
      const secondAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 11)

      expect(surveillanceWithAttachedReportings.reportingIds.length).equal(2)
      expect(firstAttachedReporting.attachedEnvActionId).equal('9969413b-b394-4db4-985f-b00743ffb833')
      expect(secondAttachedReporting.attachedEnvActionId).equal('9969413b-b394-4db4-985f-b00743ffb833')
    })
  })

  it('A control with infraction can be created from a reporting', () => {
    // Create a reporting

    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')

    cy.clickButton('signalements')
    cy.wait('@getReportings')

    cy.clickButton('Ajouter un nouveau signalement')
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')

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

    cy.clickButton('Valider le signalement')
    cy.wait('@createReporting').then(({ response }) => {
      expect(response && response.statusCode).equal(201)

      const reporting = response?.body

      // Attach the reporting to a mission
      cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
      cy.clickButton('missions')
      cy.clickButton('Ajouter une nouvelle mission')

      cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])
      cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])

      cy.get('[name="missionTypes0"]').click({ force: true })
      cy.get('*[data-cy="add-control-unit"]').click()
      cy.get('.rs-picker-search-bar-input').type('BN Toulon{enter}')
      cy.get('*[data-cy="control-unit-contact"]').first().type('Contact 012345')

      cy.get('[name="openBy"]').scrollIntoView().type('PCF')

      cy.intercept('PUT', '/bff/v1/missions').as('createMission')
      cy.waitForLastRequest('@createMission', {}, 5, undefined, missionResponse => {
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
        cy.clickButton('Editer')
        cy.getDataCy('infraction-form').should('be.visible')

        cy.getDataCy('infraction-form-registrationNumber').should('have.value', '123456789')
        cy.getDataCy('infraction-form-controlledPersonIdentity').should('have.value', 'Le Bateau 2000')
      })
    })
  })
})
