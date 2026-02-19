context('Back Office > Regulatory Area > Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/regulatory-areas?*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
    cy.clickButton('Déplier le contenu des zones PIRC')
    cy.clickButton('Déplier le contenu des zones PSCEM')
  })

  it('should filter regulatory areas by search query', () => {
    cy.fill('Rechercher dans les zones réglementaires', 'querlen')
    cy.wait('@getRegulatoryAreas')
    cy.get('span[title="ZMEL Cale Querlen"]').should('be.visible')
    cy.get('span[title="ZMEL Cale Querlen"]').should('have.length', 2)

    // Reset field
    cy.fill('Rechercher dans les zones réglementaires', undefined)
  })

  it('should group by control plan or sea front', () => {
    cy.get('h2').contains('PIRC').should('be.visible')
    cy.get('h2').contains('PSCEM').should('be.visible')
    cy.fill('Grouper les zones réglementaires', 'Grouper par façade')
    cy.get('h2').contains('MED').should('be.visible')
    cy.get('h2').contains('NAMO').should('be.visible')

    // Reset
    cy.fill('Grouper les zones réglementaires', 'Grouper par plan de contrôle')
  })

  it('should filter by sea front', () => {
    cy.fill('Façade', ['MED'])
    cy.wait('@getRegulatoryAreas')
    cy.get('span[title="Interdiction VNM Molene"]').should('be.visible')

    // Reset
    cy.fill('Façade', undefined)
  })

  it('should select a theme', () => {
    cy.fill('Filtre thématiques et sous-thématiques', ['Pêche à pied de loisir'])
    cy.wait('@getRegulatoryAreas')
    cy.get('span[title="ZMEL Cale Querlen"]').should('be.visible')
    cy.get('span[title="ZMEL Cale Querlen"]').should('have.length', 2)

    // Reset
    cy.fill('Filtre thématiques et sous-thématiques', undefined)
  })

  it('should select a tag', () => {
    cy.fill('Filtre tags et sous-tags', ['AMP'])
    cy.wait('@getRegulatoryAreas')
    cy.get('span[title="RNN Iroise"]').should('be.visible')

    // Reset
    cy.fill('Filtre tags et sous-tags', undefined)
  })
})
