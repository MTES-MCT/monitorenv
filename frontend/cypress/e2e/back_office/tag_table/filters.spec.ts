const totalTags = 16

context('Back Office > Tag Table > Filters', () => {
  beforeEach(() => {
    cy.visit(`/backoffice/tags`)
    cy.intercept('GET', `/bff/v1/tags*`).as('getTags')
    cy.wait('@getTags')
  })

  it('Should show all tags then showing subtags when clicking row', () => {
    cy.get('tbody > tr').should('have.length', totalTags)
    cy.get('tbody > tr').contains('Mouillage').click()
    cy.get('tbody > tr').should('have.length', totalTags + 2)
  })

  it('Should filter tags matching the search query', () => {
    cy.get('tbody > tr').should('have.length', totalTags)
    cy.fill('Rechercher dans les tags', 'AMP')
    cy.get('tbody > tr').should('have.length', 1)
  })

  it('Should filter tags that are out of validity period', () => {
    cy.fill('Validité', 'En cours de validité')

    cy.get('tbody > tr').should('have.length', totalTags - 1)
  })

  it('Should filter tags that are out in progress', () => {
    cy.fill('Validité', 'Fin de validité dépassée')

    cy.get('tbody > tr').should('have.length', 1)
  })
})
