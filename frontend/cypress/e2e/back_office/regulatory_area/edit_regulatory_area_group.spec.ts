import { createRegulatoryArea } from '../../utils/createRegulatoryArea'

context('Back Office > Regulatory Area > Edit Regulatory Area Group', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/v1/regulatory-areas*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
  })
  it('should display the details of a regulatory area group and edit it', () => {
    cy.intercept('GET', `bff/v1/regulatory-areas/groups/4`).as('getRegulatoryAreaGroup')
    cy.clickButton('Déplier le contenu des zones PIRC')
    cy.get('span[title="Interdiction VNM Molene"]').should('be.visible')

    cy.clickButton('Editer le groupe de réglementation Interdiction VNM Molene')
    cy.wait('@getRegulatoryAreaGroup')
    cy.get('input[name="type"]').should('have.value', 'Interdiction VNM Molene')
    cy.fill('Type', 'Interdiction VNM')
    cy.fill('Lieu', 'Molene')
    cy.clickButton('Enregistrer les modifications')

    cy.getDataCy('back-office-banner-stack').should('be.visible')
    cy.getDataCy('back-office-banner-stack').contains(
      'Le groupe de réglementations "Interdiction VNM Molene" a bien été enregistré.'
    )
    // Rollback
    cy.get('input[name="type"]').clear()
    cy.fill('Type', 'Interdiction VNM Molene')
    cy.fill('Lieu', undefined)
    cy.clickButton('Enregistrer les modifications')
  })
  it('should add a new regulatory area to the group and display it', () => {
    cy.clickButton('Déplier le contenu des zones PIRC')
    cy.clickButton('Editer le groupe de réglementation Interdiction VNM Molene')
    cy.clickButton('Enregistrer les modifications')
    cy.clickButton('Saisir une nouvelle réglementation')
    createRegulatoryArea('101112', 'Interdiction VNM Molene', 'Nouvelle interdiction VNM Molene')
    cy.clickButton('Créer la réglementation')

    cy.url().should('include', `/regulatory_areas/101112`)
    cy.getDataCy('back-office-banner-stack').should('be.visible')
    cy.getDataCy('back-office-banner-stack').contains(
      'La zone réglementaire "Nouvelle interdiction VNM Molene" a bien été enregistrée.'
    )
    cy.wait(500)
    cy.clickButton('Fermer')

    cy.clickButton('Déplier le contenu des zones PIRC')
    cy.get('span[title="Nouvelle interdiction VNM Molene"]').should('be.visible')
  })
})
