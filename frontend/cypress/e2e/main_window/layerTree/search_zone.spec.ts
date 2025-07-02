import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('LayerTree > Search zone', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')
    cy.visit('/#@-196785.63,5515456.96,7.26')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])
    cy.clickButton('Arbre des couches').wait(1000)
  })

  it('Layers can be searched by zone and reset', () => {
    cy.clickButton('Définir la zone de recherche et afficher les tracés')

    cy.getDataCy('regulatory-result-list-button').contains('0 résultat')
    cy.get('#isRegulatorySearchResultsVisible').should('be.checked')

    cy.getDataCy('amp-results-list-button').contains('7 résultats')
    cy.get('#isAmpSearchResultsVisible').should('be.checked')

    cy.getDataCy('vigilance-area-results-list-button').contains('4 résultats')
    cy.get('#isVigilanceAreaSearchResultsVisible').should('be.checked')

    // reset search by zone
    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.wait(500)

    cy.getDataCy('regulatory-result-list-button').contains('13 résultats')
    cy.get('#isRegulatorySearchResultsVisible').should('not.be.checked')

    cy.getDataCy('amp-results-list-button').contains('20 résultats')
    cy.get('#isAmpSearchResultsVisible').should('not.be.checked')

    cy.getDataCy('vigilance-area-results-list-button').contains('6 résultats')
    cy.get('#isVigilanceAreaSearchResultsVisible').should('not.be.checked')
  })
})
