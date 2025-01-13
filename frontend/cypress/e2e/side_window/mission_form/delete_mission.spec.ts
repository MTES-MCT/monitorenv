import { FAKE_MISSION_WITH_EXTERNAL_ACTIONS } from '../../constants'
import { createMissionWithAttachedReportingAndAttachedAction } from '../../utils/createMissionWithAttachedReportingAndAttachedAction'
import { visitSideWindow } from '../../utils/visitSideWindow'

import type { Mission } from 'domain/entities/missions'

context('Side Window > Mission Form > Delete Mission', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
  })

  it('A mission should be deleted if no action created in MonitorFish', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    visitSideWindow()
    cy.wait('@getMissions')
    cy.wait(600) // a first render with 0 missions is likely to happen
    cy.getDataCy('Missions-numberOfDisplayedMissions').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.wrap(numberOfMissions).as('numberOfMissions')
    })

    const missionId = 49
    cy.get(`*[data-cy="edit-mission-${missionId}"]`).scrollIntoView().click({ force: true })
    cy.wait(250)
    cy.intercept({ method: 'GET', url: `/bff/v1/missions/${missionId}/can_delete?source=MONITORENV` }).as(
      'canDeleteMission'
    )
    cy.intercept('DELETE', `/bff/v1/missions/${missionId}`, {
      statusCode: 200
    }).as('deleteMission')

    cy.getDataCy('delete-mission').click()

    cy.wait('@canDeleteMission').then(({ response }) => {
      cy.log('response', JSON.stringify(response))
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
    cy.wait('@getMissions').then(({ response }) => {
      if (!response) {
        assert.fail('response is undefined')
      }
      const numberOfMissions = (response.body as Array<Mission>).filter(({ id }) => id !== missionId)

      cy.get('@numberOfMissions').then(numberOfMissionsBefore => {
        expect(numberOfMissions.length).equal(parseInt(numberOfMissionsBefore as unknown as string, 10) - 1)
      })
    })
  })

  it('A mission should not be deleted if actions have been created in MonitorFish or RapportNav', () => {
    visitSideWindow()
    cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })

    cy.intercept(
      { method: 'GET', url: '/bff/v1/missions/34/can_delete?source=MONITORENV' },
      FAKE_MISSION_WITH_EXTERNAL_ACTIONS
    ).as('canDeleteMission')
    cy.intercept(
      {
        url: `/bff/v1/missions*`
      },
      { status: 200 }
    ).as('deleteMission')

    cy.clickButton('Supprimer la mission')

    cy.wait('@canDeleteMission').then(({ response }) => {
      cy.log('response', JSON.stringify(response))
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.canDelete).equal(false)
      expect(response && response.body.sources[0]).equal('MONITORFISH')
      expect(response && response.body.sources[1]).equal('RAPPORT_NAV')

      cy.getDataCy('external-action-modal-text').contains(
        "La mission ne peut pas être supprimée, car elle comporte des événements ajoutés par le CNSP et l'unité."
      )
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
      cy.fill('Réponse administrative', 'Sanction')
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])

      cy.wait(500)
      cy.waitForLastRequest('@updateMission', {}, 5, 0, missionResponse => {
        const attachedReportingId = missionResponse.body.attachedReportingIds[0]

        cy.intercept({ method: 'GET', url: '/bff/v1/missions/34/can_delete?source=MONITORENV' }).as('canDeleteMission')
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

          cy.clickButton('Signalements')
          cy.wait('@getReportings')

          cy.getDataCy(`edit-reporting-${attachedReportingId}`).click({ force: true })
          cy.getDataCy('attach-mission-button').scrollIntoView().should('be.visible')
        })
      })
    })
  })
})
