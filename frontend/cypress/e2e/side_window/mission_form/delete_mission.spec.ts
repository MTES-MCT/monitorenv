import { FAKE_FISH_MISSION_ACTIONS } from '../../constants'
import { visitSideWindow } from '../../utils'

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
      expect(response && response.body.value).equal(true)
    })
    cy.get('*[name="delete-mission-modal-cancel"]').click()
    cy.get('*[data-cy="delete-mission"]').click()
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

    cy.get('*[data-cy="delete-mission"]').click()

    cy.wait('@canDeleteMission').then(({ response }) => {
      expect(response && response.statusCode).equal(400)
      expect(response && response.body.data.sources[0]).equal('MONITORFISH')
    })

    cy.get('*[data-cy="external-actions-modal"]').should('be.visible')
  })
})
