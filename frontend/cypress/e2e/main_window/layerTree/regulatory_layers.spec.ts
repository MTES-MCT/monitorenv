import { Layers } from 'domain/entities/layers/constants'

import { PAGE_CENTER_PIXELS } from '../../constants'
import { goToMainWindow } from '../utils'

context('LayerTree > Regulatory Layers', () => {
  beforeEach(() => {
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')

    goToMainWindow()
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
    cy.getDataCy('result-group').contains('ZMEL Cale Querlen').click()
    cy.getDataCy('regulatory-result-zone').contains('Zone au sud de la cale').click()
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

    cy.getDataCy('my-regulatory-layers-list').contains('Aucune zone sélectionnée')
  })

  it('Result list should be displayed by default but not checked and total should be visible', () => {
    cy.getDataCy('regulatory-result-list-button').contains('13 résultats')

    cy.get('#isRegulatorySearchResultsVisible').should('not.be.checked')
    cy.getDataCy('regulatory-result-list-button').click()
    // we have 13 results but 9 groups of regulatory layers areas
    // because result list have a separator so we need to multiply the results by 2
    cy.getDataCy('regulatory-result-list').children().should('have.length', 18)
    cy.get('#isRegulatorySearchResultsVisible').should('be.checked')
  })
})
