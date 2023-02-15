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
})
