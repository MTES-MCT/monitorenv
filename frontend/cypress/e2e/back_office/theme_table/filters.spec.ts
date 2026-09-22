const totalThemes = 35

context('Back Office > Theme Table > Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/themes*`).as('getThemes')
    cy.visit(`/backoffice/themes`)
    cy.wait('@getThemes')
  })

  it('Should show all themes then showing subthemes when clicking row', () => {
    cy.get('tbody > tr').should('have.length', totalThemes)
    cy.get('tbody > tr').contains('Culture marine').click()
    cy.get('tbody > tr').should('have.length', totalThemes + 8)
  })

  it('Should filter themes matching the search query', () => {
    cy.get('tbody > tr').should('have.length', totalThemes)
    cy.fill('Rechercher dans les thématiques', 'Police des activités de cultures marines')
    cy.get('tbody > tr').should('have.length', 1)
  })

  it('Should filter themes that are out of validity period', () => {
    cy.fill('Validité', 'En cours de validité')

    cy.get('tbody > tr').should('have.length', totalThemes - 1)
  })

  it('Should filter themes that are out in progress', () => {
    cy.fill('Validité', 'Fin de validité dépassée')

    cy.get('tbody > tr').should('have.length', 1)
  })
})
