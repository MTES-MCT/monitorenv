import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Main Window > AMP Layers', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.visit(`/`).wait(1000)
    cy.clickButton('Arbre des couches').wait(1000)
  })
  it('An AMP Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.clickButton('Filtrer par type de zones').wait(1000)
    cy.fill("Type d'AMP", ['Natura 2000'])
    cy.getDataCy('amp-results-list-button').click()
    cy.getDataCy('amp-result-list').find('li').first().click()
    cy.clickButton('Sélectionner la/les zone(s)')

    cy.getDataCy('my-amp-layers-zones').click({ force: true })
    cy.getDataCy('my-amp-zones-list').should('have.length', 1)

    cy.getDataCy('amp-layer-type').first().click({ force: true }).wait(2000)

    // Then
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 500, width: 250, x: 410, y: 0 }
      }
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
