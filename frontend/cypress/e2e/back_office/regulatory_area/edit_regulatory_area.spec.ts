context('Back Office > Regulatory Area > Edit Regulatory Area', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/regulatory-areas?*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
  })
  it('should display the details of a regulatory area and edit it', () => {
    cy.intercept('GET', `bff/regulatory-areas/134`).as('getRegulatoryArea')
    cy.clickButton('Déplier le contenu des zones PIRC')
    cy.clickButton('Interdiction VNM Molene')
    cy.get('span[title="Interdiction VNM Molene"]').should('be.visible')
    cy.get('span[title="Article 1"]').click()
    cy.wait('@getRegulatoryArea')
    cy.getDataCy('regulatory-area-panel').should('be.visible')

    cy.clickButton('Editer la réglementation')
    cy.fill('Titre de la zone réglementaire', 'Article 1')
    cy.clickButton('Enregistrer la réglementation')

    cy.getDataCy('back-office-banner-stack').should('be.visible')
    cy.getDataCy('back-office-banner-stack').contains('La zone réglementaire "Article 1" a bien été enregistrée.')
  })
})
