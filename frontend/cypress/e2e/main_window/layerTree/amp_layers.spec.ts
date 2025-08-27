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
    cy.getDataCy('amp-result-list').find('li').first().click()
    cy.wait(1000)
    cy.getDataCy('amp-zone-check').first().click()

    cy.getDataCy('my-amp-layers-zones').click({ force: true })
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
    // we have 20 results but 18 groups of amps areas
    // because result list have a separator so we need to multiply the results by 2
    cy.getDataCy('amp-result-list').children().should('have.length', 36)
    cy.get('#isAmpSearchResultsVisible').should('be.checked')
  })
})
