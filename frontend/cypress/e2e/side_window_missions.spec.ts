/// <reference types="cypress" />

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('50 Missions should be displayed in Missions Table', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('5')
  })
})
