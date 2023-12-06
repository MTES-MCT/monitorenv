import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Main Window > AMP Layers', () => {
  it('An AMP Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.visit(`/`).wait(1000)
    cy.clickButton('Arbre des couches').wait(1000)
    cy.clickButton('Filtrer par type de zones').wait(1000)
    cy.fill("Type d'AMP", ['Natura 2000'])
    cy.getDataCy('amp-results-list-button').click({ force: true })
    cy.getDataCy('amp-result-list').find('li').first().click({ force: true })
    cy.getDataCy('amp-layer-topic-pin-button').first().click({ force: true })

    cy.getDataCy('amp-layers-my-zones').click({ force: true })
    cy.getDataCy('amp-my-zones-list').should('have.length', 1)

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
})
