import { createRegulatoryAreaGroup } from '../../utils/createRegulatoryAreaGroup'

context('Back Office > Regulatory Area > Create Regulatory Area Group', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/v1/regulatory-areas*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
  })
  it('should create a regulatory Area Group', () => {
    cy.clickButton('Créer un groupe de reg.')
    cy.intercept('PUT', '/bff/v1/regulatory-areas/groups').as('createRegulatoryAreaGroup')
    cy.contains('button', 'Ajouter une réglementation').should('be.disabled')
    createRegulatoryAreaGroup()
    cy.clickButton('Créer le groupe')
    cy.wait('@createRegulatoryAreaGroup').then(({ response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.equal(response.statusCode, 200)
      cy.getDataCy('back-office-banner-stack').should('be.visible')
      cy.getDataCy('back-office-banner-stack').contains(
        'Le groupe de réglementations "Nouveau groupe - Quelque part" a bien été enregistré.'
      )
      cy.url().should('include', `/regulatory_area_group/1000010`)
      cy.contains('button', 'Ajouter une réglementation').should('not.be.disabled')
    })
  })
  it('should navigate to regulatory area group from regulatory area form', () => {
    cy.intercept('GET', `bff/v1/regulatory-areas/*`).as('getRegulatoryArea')
    cy.clickButton('Saisir une nouvelle réglementation')
    cy.getDataCy('group-select').click()
    cy.clickButton('Ajouter un nouveau groupe')
    cy.url().should('include', `/regulatory_area_group/new`)
  })
})
