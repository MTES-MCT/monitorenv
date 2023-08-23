/// <reference types="cypress" />

context('Reporting', () => {
  beforeEach(() => {
    cy.viewport(1580, 1024)
    cy.visit(`/`)
  })
  it('A reporting can be created', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')

    // When
    cy.get('*[data-cy="add-semaphore-source"]').click({ force: true })
    cy.get('div[role="option"]').contains('Sémaphore de Dieppe').click()

    cy.get('*[data-cy="reporting-target-type"]').click({ force: true })
    cy.get('div[role="option"]').contains('Société').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(250, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Infraction (suspicion)').click()
    cy.get('.rs-radio').find('label').contains('Avérée').click()
    cy.get('*[data-cy="reporting-is-control-required"] > input').scrollIntoView().should('be.checked')

    cy.clickButton('Valider le signalement')

    // Then
    cy.wait('@createReporting').then(({ response }) => {
      expect(response && response.statusCode).equal(201)
    })
  })
})
