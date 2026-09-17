context('Back Office > Regulatory Area > Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/v1/regulatory-areas?*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
    cy.clickButton('Déplier le contenu des zones PIRC')
    cy.clickButton('Déplier le contenu des zones PSCEM')
  })

  it('should filter regulatory areas by search query', () => {
    cy.fill('Rechercher dans les zones réglementaires', 'querlen')
    cy.wait('@getRegulatoryAreas')
    cy.get('span[title="ZMEL - Cale Querlen"]').should('be.visible')
    cy.get('span[title="ZMEL - Cale Querlen"]').should('have.length', 2)

    // Reset field
    cy.clickButton('Réinitialiser les filtres')
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
    cy.get('span[title="Interdiction VNM - Molene"]').should('be.visible')

    // Reset
    cy.clickButton('Réinitialiser les filtres')
  })

  it('should select a theme', () => {
    cy.fill('Filtre thématiques et sous-thématiques', ['Pêche à pied de loisir'])
    cy.wait('@getRegulatoryAreas')
    cy.get('span[title="ZMEL - Cale Querlen"]').should('be.visible')
    cy.get('span[title="ZMEL - Cale Querlen"]').should('have.length', 2)

    // Reset
    cy.clickButton('Réinitialiser les filtres')
  })

  it('should select a tag', () => {
    cy.fill('Filtre tags et sous-tags', ['Mixte'])
    cy.wait('@getRegulatoryAreas')
    cy.get('span[title="Interdiction VNM - Molene"]').should('be.visible')
    cy.get('span[title="Mouillage - Conquet Ile de bannec"]').should('be.visible')

    // Reset
    cy.clickButton('Réinitialiser les filtres')
  })

  it('should filter by last modification date', () => {
    cy.contains('button', 'Dragage - port de Brest').should('be.visible')
    cy.contains('button', 'Dragage - port de Brest')
      .parent()
      .within(() => cy.contains('2/2'))
    cy.fill('Dernière modification', 'Il y a plus d’un mois')
    cy.wait('@getRegulatoryAreas')
    cy.contains('button', 'Dragage - port de Brest').should('be.visible')
    cy.contains('button', 'Dragage - port de Brest')
      .parent()
      .within(() => cy.contains('1/2'))

    // Reset
    cy.clickButton('Réinitialiser les filtres')
  })

  it('should filter by specific regulatory filters', () => {
    cy.fill('Aide à la gestion des réglementations', 'Reg. sans thématique associée')
    cy.contains('button', 'Interdiction VNM - Molene').should('be.visible')
    cy.contains('button', 'Mouillage interdiction - port Camaret').should('be.visible')
    cy.contains('button', 'Dragage - port de Brest').should('be.visible')
    cy.contains('button', 'RNN - Iroise').should('be.visible')
    cy.contains('button', 'ZMEL - anse illien Ploumoguer').should('be.visible')
    cy.contains('button', 'ZMEL - Cale Querlen').should('be.visible')
    cy.contains('button', 'ZMEL - maison blanche').should('be.visible')
    cy.contains('button', 'Mouillage - Conquet Ile de bannec').should('be.visible')

    cy.fill('Aide à la gestion des réglementations', 'Reg. sans tag associée')
    cy.contains('button', 'Mouillage interdiction - port Camaret').should('be.visible')
    cy.contains('button', 'RNN - Iroise').should('be.visible')

    cy.fill('Aide à la gestion des réglementations', 'Reg. dont la date de validité est dépassée')
    cy.contains('button', 'ZMEL - anse illien Ploumoguer').should('be.visible')

    // Reset
    cy.clickButton('Réinitialiser les filtres')
  })
})
