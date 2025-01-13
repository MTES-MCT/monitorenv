import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('LayerTree > Search zone', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-196785.63,5515456.96,7.26').wait(1000)
    cy.clickButton('Arbre des couches').wait(1000)
  })

  it('Layers can be searched by zone and reset', () => {
    cy.clickButton('Définir la zone de recherche et afficher les tracés')

    cy.getDataCy('regulatory-result-list-button').contains('0 résultat')
    cy.get('#isRegulatorySearchResultsVisible').should('be.checked')

    cy.getDataCy('amp-results-list-button').contains('7 résultats')
    cy.get('#isAmpSearchResultsVisible').should('be.checked')

    cy.getDataCy('vigilance-area-results-list-button').contains('3 résultats')
    cy.get('#isVigilanceAreaSearchResultsVisible').should('be.checked')

    // reset search by zone
    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.wait(500)

    cy.getDataCy('regulatory-result-list-button').contains('13 résultats')
    cy.get('#isRegulatorySearchResultsVisible').should('not.be.checked')

    cy.getDataCy('amp-results-list-button').contains('20 résultats')
    cy.get('#isAmpSearchResultsVisible').should('not.be.checked')

    cy.getDataCy('vigilance-area-results-list-button').contains('5 résultats')
    cy.get('#isVigilanceAreaSearchResultsVisible').should('not.be.checked')
  })
})
