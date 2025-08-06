import { Layers } from 'domain/entities/layers/constants'

import { PAGE_CENTER_PIXELS } from '../../constants'
import { goToMainWindow } from '../utils'

context('LayerTree > AMP Layers', () => {
  beforeEach(() => {
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    goToMainWindow()

    cy.wait(['@getAmps', '@getRegulatoryAreas'])
    cy.clickButton('Arbre des couches').wait(1000)
  })
  it('An AMP Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.fill("Type d'AMP", ['Natura 2000'])
    cy.getDataCy('amp-results-list-button').click()
    cy.clickButton('baie de Stagnolu, golfu du Sognu, golfe de Porto-Vecchio')
    cy.wait(1000)
    cy.clickButton('Sélectionner la zone')

    cy.clickButton('Mes AMP')
    cy.getDataCy('my-amp-zones-list').should('have.length', 1)

    cy.getDataCy('amp-layer-type').first().click({ force: true }).wait(2000)

    cy.getFeaturesFromLayer(Layers.AMP.code, PAGE_CENTER_PIXELS).should(features => {
      expect(features).to.have.length(1)
      expect(features?.[0]?.get('type')).to.equal('Natura 2000')
    })
  })

  it('Result list should be displayed by default but not checked and total should be visible', () => {
    cy.getDataCy('amp-results-list-button').contains('20 résultats')

    cy.get('#isAmpSearchResultsVisible').should('not.be.checked')
    cy.getDataCy('amp-results-list-button').click()
    cy.getDataCy('amp-result-list').children().should('have.length', 18)
    cy.get('#isAmpSearchResultsVisible').should('be.checked')
  })
})
