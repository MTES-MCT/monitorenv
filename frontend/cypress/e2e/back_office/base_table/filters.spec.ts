context('Back Office > Base Table > Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/bases`).as('getBases')

    cy.visit(`/backoffice/bases`)

    cy.wait('@getBases')
  })

  it('Should show all bases by default', () => {
    cy.get('tbody > tr').should('have.length', 3)
    cy.get('tbody > tr:first-child > td:nth-child(2)').should('have.text', 'Dunkerque')
    cy.get('tbody > tr:last-child > td:nth-child(2)').should('have.text', 'Saint-Malo')
  })

  it('Should find bases matching the search query', () => {
    cy.fill('Rechercher...', 'mar')

    cy.get('tbody > tr').should('have.length', 1)
    cy.get('tbody > tr:first-child > td:nth-child(2)').should('have.text', 'Marseille')
  })
})
