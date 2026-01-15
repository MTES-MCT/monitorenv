import { Layers } from 'domain/entities/layers/constants'

import { FAKE_MAPBOX_RESPONSE, PAGE_CENTER_PIXELS } from '../../constants'

context('LayerTree > Regulatory Layers', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')

    cy.visit('/#@-481936.30,6137793.76,8.69')
    cy.wait(['@getAmps', '@getRegulatoryAreas'])

    cy.clickButton('Arbre des couches')
  })
  it('A regulatory area Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.getDataCy('regulatory-result-list-button').contains('13 résultats')

    cy.log('search a regulation by name')
    cy.fill('Rechercher une zone', 'querlin') // "querlin" contains a typo to test fuzzy search ("querlen" in source)
    cy.getDataCy('regulatory-result-list-button').contains('2 résultats').click()

    cy.log("zoom on the regulation's zone and show metadata")
    cy.clickButton('ZMEL Cale Querlen')
    cy.clickButton('Zone au sud de la cale')
    cy.getDataCy('regulatory-metadata-header').contains('ZMEL Cale Querlen').click()
    cy.wait(1000) // let OL do the rendering

    cy.getFeaturesFromLayer(Layers.REGULATORY_ENV_PREVIEW.code, PAGE_CENTER_PIXELS).should(features => {
      expect(features).to.have.length(2)
      expect(features?.[0]?.get('layerName')).to.equal('ZMEL_Cale_Querlen')
      expect(features?.[0]?.get('id')).to.equal(17)
      expect(features?.[1]?.get('layerName')).to.equal('ZMEL_Cale_Querlen')
      expect(features?.[1]?.get('id')).to.equal(697)
    })

    cy.log('add the regulation to My Zones')
    cy.clickButton('Sélectionner la zone')

    cy.getDataCy('my-regulatory-layers').click() // zoom on the regulation's zone
    cy.clickButton('Effacer les résultats de la recherche')
    cy.wait(250)

    cy.clickButton('Mes zones réglementaires')
    cy.clickButton('Cacher la/les zone(s)')
    cy.wait(250)
    cy.getFeaturesFromLayer(Layers.REGULATORY_ENV.code, PAGE_CENTER_PIXELS).should(features => {
      expect(features).to.have.length(0)
    })

    cy.clickButton('Afficher la/les zone(s)')
    cy.wait(250)
    cy.getFeaturesFromLayer(Layers.REGULATORY_ENV.code, PAGE_CENTER_PIXELS).should(features => {
      expect(features).to.have.length(1)
    })

    cy.clickButton('Cacher la zone')
    cy.wait(250)
    cy.getFeaturesFromLayer(Layers.REGULATORY_ENV.code, PAGE_CENTER_PIXELS).should(features => {
      expect(features).to.have.length(0)
    })

    cy.clickButton('Afficher la zone')
    cy.wait(250)
    cy.getFeaturesFromLayer(Layers.REGULATORY_ENV.code, PAGE_CENTER_PIXELS).should(features => {
      expect(features).to.have.length(1)
    })

    cy.clickButton('Supprimer la zone de ma sélection')
    cy.wait(250)

    cy.contains('Aucune zone sélectionnée').should('be.visible')
  })

  it('Result list should be displayed by default but not checked and total should be visible', () => {
    cy.getDataCy('regulatory-result-list-button').contains('13 résultats')

    cy.get('#isRegulatorySearchResultsVisible').should('not.be.checked')
    cy.getDataCy('regulatory-result-list-button').click()
    cy.getDataCy('regulatory-result-list').children().should('have.length', 9)
    cy.get('#isRegulatorySearchResultsVisible').should('be.checked')
  })

  it('Should filter regulatory areas by control plan', () => {
    cy.getDataCy('regulatory-result-list-button').contains('13 résultats')

    cy.fill('Plan de contrôle', 'PIRC')
    cy.getDataCy('regulatory-result-list-button').contains('9 résultats')

    cy.fill('Plan de contrôle', 'PSCEM')
    cy.getDataCy('regulatory-result-list-button').contains('8 résultats')

    cy.clickButton('Réinitialiser les filtres')
  })
})
