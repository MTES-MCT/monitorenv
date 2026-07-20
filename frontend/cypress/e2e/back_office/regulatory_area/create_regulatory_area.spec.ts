import { createRegulatoryArea } from '../../utils/createRegulatoryArea'

context('Back Office > Regulatory Area > Create Regulatory Area', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/v1/regulatory-areas*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
  })
  it('should create a regulatory area', () => {
    cy.intercept('GET', `bff/v1/regulatory-areas/*`).as('getRegulatoryArea')
    cy.clickButton('Saisir une nouvelle réglementation')
    createRegulatoryArea('123')

    cy.clickButton('Créer la réglementation')

    cy.getDataCy('back-office-banner-stack').should('be.visible')
    cy.getDataCy('back-office-banner-stack').contains(
      'La zone réglementaire "Nouvelle zone réglementaire" a bien été enregistrée.'
    )
  })
})
