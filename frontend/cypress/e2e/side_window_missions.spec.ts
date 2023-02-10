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
    cy.get('*[data-cy="datepicker-missionStartedAfter"]')
        .contains(`${thirtyDaysAgo.get('year')-thirtyDaysAgo.get('month')-thirtyDaysAgo.get('date')}`)
  })
})
