/// <reference types="cypress" />

import dayjs from "dayjs";

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('10 Missions should be displayed in Missions Table', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('10')


    cy.log('A default date filter should be set')
    const thirtyDaysAgo = dayjs().subtract(30, 'days')
    const month = thirtyDaysAgo.get('month') <= 9
        ? '0' + Number(thirtyDaysAgo.get('month') + 1)
        : thirtyDaysAgo.get('month') + 1
    cy.get('*[data-cy="datepicker-missionStartedAfter"]')
        .contains(`${thirtyDaysAgo.get('year')}-${month}-${thirtyDaysAgo.get('date')}`)

    cy.log('Units should be filtered')
    cy.get('*[data-cy="select-units-filter"]').click({ force: true })
    cy.get('[data-key="Cross Etel"] > .rs-picker-select-menu-item').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('1')

    cy.log('Administrations should be filtered')
    cy.get('*[data-cy="select-administrations-filter"]').click({ force: true })
    cy.get('[data-key="DDTM"] > .rs-picker-select-menu-item').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('6')

    cy.get('*[data-cy="select-administrations-filter"] > .rs-btn-close').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('10')
  })

  it('An infraction Should be duplicated', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click()
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.get('*[data-cy="infraction-form"]').should('not.exist')

    // When
    cy.get('*[data-cy="duplicate-infraction"]').click({ force: true })
    cy.get('*[data-cy="infraction-form-registrationNumber"]').should('have.value', 'BALTIK')
    cy.get('*[data-cy="infraction-form-validate"]').click({ force: true })
    cy.get('*[data-cy="duplicate-infraction"]').eq(1).should('be.disabled')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('[type="submit"]').click()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      expect(request.body.envActions[1].infractions.length).equal(2)
      const duplicatedInfraction = request.body.envActions[1].infractions[1]

      expect(duplicatedInfraction.controlledPersonIdentity).equal("John Doe")
      expect(duplicatedInfraction.formalNotice).equal("PENDING")
      expect(duplicatedInfraction.infractionType).equal("WITH_REPORT")
      expect(duplicatedInfraction.natinf.length).equal(2)
      expect(duplicatedInfraction.observations).equal("Pas d'observations")
      expect(duplicatedInfraction.registrationNumber).equal("BALTIK")
      expect(duplicatedInfraction.relevantCourt).equal("LOCAL_COURT")
      expect(duplicatedInfraction.toProcess).equal(false)
      expect(duplicatedInfraction.vesselSize).equal("FROM_24_TO_46m")
      expect(duplicatedInfraction.vesselType).equal("COMMERCIAL")
      expect(duplicatedInfraction.id).not.equal("c52c6f20-e495-4b29-b3df-d7edfb67fdd7")
    })
  })
})
