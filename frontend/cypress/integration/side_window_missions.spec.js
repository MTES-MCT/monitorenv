/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

const port = Cypress.env('PORT') ? Cypress.env('PORT') : 3000

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`http://localhost:${port}/side_window`)
  })

  it('50 Missions should be displayed in Missions Table', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('50')
  })

})
