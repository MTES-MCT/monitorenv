context('Back Office > Regulatory Area > Create Regulatory Area Group', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/v1/regulatory-areas*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
  })
  it('should create a regulatory area group from regulatory area form', () => {
    cy.intercept('GET', `bff/v1/regulatory-areas/*`).as('getRegulatoryArea')
    cy.clickButton('Saisir une nouvelle réglementation')
    cy.fill('Titre de la zone réglementaire', 'Nouvelle zone réglementaire')
    cy.getDataCy('group-select').click()
    cy.clickButton('Ajouter un nouveau groupe')
    cy.fill('Géométrie', '789')
    cy.fill('Façade', 'NAMO')
    cy.fill('Type d’acte administratif', 'Arrêté inter-préfectoral')
    cy.fill('Tags et sous-tags', ['AMP'])
    cy.fill('Résumé', 'Résumé de la nouvelle zone réglementaire')
    cy.get('#PIRCType').click()
    cy.fill('URL du lien', 'https://www.google.com')
    cy.fill('Type', 'New group')
    cy.fill('Lieu', 'Location')
    cy.clickButton('Valider')
    cy.intercept('PUT', '/bff/v1/regulatory-areas').as('createRegulatoryArea')

    cy.clickButton('Créer la réglementation')

    cy.wait('@createRegulatoryArea').then(({ response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      const id = response.body.id
      assert.equal(response.statusCode, 200)
      cy.getDataCy('back-office-banner-stack').should('be.visible')
      cy.getDataCy('back-office-banner-stack').contains(
        'La zone réglementaire "Nouvelle zone réglementaire" a bien été enregistrée.'
      )
      cy.url().should('include', `/regulatory_areas/${id}`)
      cy.wait(300)
      cy.clickButton('Fermer')
      cy.clickButton('Déplier le contenu des zones PIRC')
      cy.get('span[title="New group - Location"]').should('be.visible')
    })
  })
})
