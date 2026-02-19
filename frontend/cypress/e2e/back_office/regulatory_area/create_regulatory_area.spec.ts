context('Back Office > Regulatory Area > Create Regulatory Area', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/regulatory-areas?*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
  })
  it('should create a regulatory area', () => {
    cy.intercept('GET', `bff/regulatory-areas/*`).as('getRegulatoryArea')
    cy.clickButton('Saisir une nouvelle réglementation')

    cy.fill('Titre de la zone réglementaire', 'Nouvelle zone réglementaire')
    cy.fill('Titre du groupe de réglementation', 'RNN Iroise')
    cy.fill('Géométrie', '123')
    cy.fill('Façade', 'NAMO')
    cy.fill('Type d’acte administratif', 'Arrêté inter-préfectoral')
    cy.fill('Tags et sous-tags', ['AMP'])
    cy.fill('Résumé', 'Résumé de la nouvelle zone réglementaire')
    cy.get('#PIRCType').click()

    cy.fill('URL du lien', 'https://www.google.com')

    cy.clickButton('Créer la réglementation')

    cy.getDataCy('back-office-banner-stack').should('be.visible')
    cy.getDataCy('back-office-banner-stack').contains(
      'La zone réglementaire "Nouvelle zone réglementaire" a bien été enregistrée.'
    )
  })
})
