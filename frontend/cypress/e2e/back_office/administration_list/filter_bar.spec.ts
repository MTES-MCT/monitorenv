context('Back Office > Administration List > Filter Bar', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/administrations`).as('getAdministrations')

    cy.visit(`/backoffice/administrations`)

    cy.wait('@getAdministrations')
  })

  it('Should show all administrations by default', () => {
    cy.get('tbody > tr').should('have.length', 33)
    cy.get('tbody > tr:first-child > td:nth-child(2)').should('have.text', '-')
    cy.get('tbody > tr:last-child > td:nth-child(2)').should('have.text', 'Sécurité Civile')
  })

  it('Should find administrations matching the search query', () => {
    cy.fill('Rechercher...', 'arm')

    cy.get('tbody > tr').should('have.length', 3)
    cy.get('tbody > tr:first-child > td:nth-child(2)').should('have.text', 'Armée Air')
    cy.get('tbody > tr:last-child > td:nth-child(2)').should('have.text', 'Gendarmerie Nationale')
  })
})
