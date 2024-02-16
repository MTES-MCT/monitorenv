import { FAKE_FISH_MISSION_ACTIONS } from '../../constants'
import { createMissionWithAttachedReportingAndAttachedAction } from '../../utils/createMissionWithAttachedReportingAndAttachedAction'
import { visitSideWindow } from '../../utils/visitSideWindow'

context('Side Window > Mission Form > Delete Mission', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
  })

  it('A mission should be deleted if no action created in MonitorFish', () => {
    // Given
    visitSideWindow()
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait('@getMissions')
    cy.wait(600) // a first render with 0 missions is likely to happen
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.wrap(numberOfMissions).as('numberOfMissions')
    })

    cy.get('*[data-cy="edit-mission-49"]').click({ force: true })

    cy.intercept({
      url: `/bff/v1/missions*`
    }).as('deleteMission')
    cy.intercept({ method: 'GET', url: '/bff/v1/missions/49/can_delete?source=MONITORENV' }).as('canDeleteMission')
    cy.get('*[data-cy="delete-mission"]').click()

    cy.wait('@canDeleteMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.canDelete).equal(true)
    })
    cy.get('*[name="delete-mission-modal-cancel"]').click()
    cy.clickButton('Supprimer la mission')
    cy.get('*[name="delete-mission-modal-confirm"]').click()

    // Then
    cy.wait('@deleteMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
    cy.wait('@getMissions')
    cy.wait(500)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.get('@numberOfMissions').then(numberOfMissionsBefore => {
        expect(numberOfMissions).equal(parseInt(numberOfMissionsBefore as unknown as string, 10) - 1)
      })
    })
  })

  it('A mission should not be deleted if actions have been created in MonitorFish', () => {
    visitSideWindow()
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })

    cy.intercept(
      { method: 'GET', url: '/bff/v1/missions/34/can_delete?source=MONITORENV' },
      FAKE_FISH_MISSION_ACTIONS
    ).as('canDeleteMission')
    cy.intercept({
      url: `/bff/v1/missions*`
    }).as('deleteMission')

    cy.clickButton('Supprimer la mission')

    cy.wait('@canDeleteMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.canDelete).equal(false)
      expect(response && response.body.sources[0]).equal('MONITORFISH')
    })

    cy.getDataCy('external-actions-modal').should('be.visible')
    cy.clickButton('Fermer')
    cy.getDataCy('external-actions-modal').should('not.be.exist')
  })

  it('A mission should be deleted and attached reportings should be detached', () => {
    visitSideWindow()

    createMissionWithAttachedReportingAndAttachedAction().then(response => {
      const missionId = response.body.id
      cy.intercept('PUT', `/bff/v1/missions/${missionId}`).as('updateMission')

      cy.clickButton('Editer')
      cy.fill("Type d'infraction", 'Avec PV')
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
      cy.fill('Clôturé par', 'PCF')

      cy.wait(500)
      cy.waitForLastRequest('@updateMission', {}, 5, undefined, missionResponse => {
        const attachedReportingId = missionResponse.body.attachedReportingIds[0]

        cy.intercept({
          url: `/bff/v1/missions*`
        }).as('deleteMission')
        cy.clickButton('Supprimer la mission')
        cy.wait(400)
        cy.get('*[name="delete-mission-modal-confirm"]').click()
        cy.wait(400)
        cy.wait('@deleteMission').then(({ response: deleteResponse }) => {
          expect(deleteResponse && deleteResponse.statusCode).equal(200)

          cy.intercept('GET', '/bff/v1/missions').as('getMissions')
          cy.get(`*[data-cy="edit-mission-${missionId}"]`).should('not.exist')

          cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')

          cy.clickButton('signalements')
          cy.wait('@getReportings')

          cy.getDataCy(`edit-reporting-${attachedReportingId}`).click({ force: true })
          cy.getDataCy('attach-mission-button').scrollIntoView().should('be.visible')
        })
      })
    })
  })
})
