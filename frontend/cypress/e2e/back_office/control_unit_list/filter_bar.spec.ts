context('Back Office > Control Unit List > Filter Bar', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')

    cy.visit(`/backoffice/control_units`)

    cy.wait('@getControlUnits')
  })

  it('Should show all control units by default', () => {
    cy.get('tbody > tr').should('have.length', 33)
    cy.get('tbody > tr:first-child > td:nth-child(3)').should('have.text', 'A636 Maïto')
    cy.get('tbody > tr:last-child > td:nth-child(3)').should('have.text', 'SML 50')
  })

  it('Should find control units matching the search query', () => {
    cy.fill('Rechercher...', 'marine')

    cy.get('tbody > tr').should('have.length', 4)
    cy.get('tbody > tr:first-child > td:nth-child(3)').should('have.text', 'A636 Maïto')
    cy.get('tbody > tr:last-child > td:nth-child(3)').should('have.text', 'Natura 2000 Côte Bleue Marine')
  })
})
