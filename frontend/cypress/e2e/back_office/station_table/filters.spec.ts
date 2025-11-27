context('Back Office > Station Table > Filters', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', `/api/v1/stations`).as('getStations')

    cy.visit(`/backoffice/stations`)

    cy.wait('@getStations')
  })

  it('Should show all stations by default', () => {
    cy.get('tbody > tr').should('have.length', 3)
    cy.get('tbody > tr:first-child > td:nth-child(2)').should('have.text', 'Dunkerque')
    cy.get('tbody > tr:last-child > td:nth-child(2)').should('have.text', 'Saint-Malo')
  })

  it('Should find stations matching the search query', () => {
    cy.fill('Rechercher...', 'mar')

    cy.get('tbody > tr').should('have.length', 1)
    cy.get('tbody > tr:first-child > td:nth-child(2)').should('have.text', 'Marseille')
  })
})
