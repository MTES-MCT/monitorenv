import { FAKE_MAPBOX_RESPONSE } from '../../constants'
import { getBaseLayerSnapShot } from '../utils'

context('LayerTree > Regulatory Layers', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.visit(`/`)
    cy.wait(['@getAmps', '@getRegulatoryAreas'])

    cy.visit('/#@-481936.30,6137793.76,8.69')
    cy.wait(300) // wait for rendering initial zoom

    cy.log('load the regulation layer')
    cy.wait('@getRegulatoryAreas').then(({ response }) => expect(response?.statusCode).equal(200))
    cy.log('search for a regulation by zone')
    cy.clickButton('Arbre des couches')
  })
  it('A regulation Should be searched, added to My Zones and showed on the map with the Zone button', () => {
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
    getBaseLayerSnapShot()

    cy.log('add the regulation to My Zones')
    cy.clickButton('Sélectionner la zone')

    cy.getDataCy('my-regulatory-layers').click() // zoom on the regulation's zone
    cy.clickButton('Effacer les résultats de la recherche')
    cy.wait(250)
    getBaseLayerSnapShot()
    cy.clickButton('Cacher la/les zone(s)')
    cy.wait(250)
    getBaseLayerSnapShot()
    cy.clickButton('Afficher la/les zone(s)')
    cy.wait(250)
    getBaseLayerSnapShot()
    cy.clickButton('Cacher la zone')
    cy.wait(250)
    getBaseLayerSnapShot()
    cy.clickButton('Afficher la zone')
    cy.wait(250)
    getBaseLayerSnapShot()
    cy.clickButton('Supprimer la zone de ma sélection')
    cy.wait(250)
    getBaseLayerSnapShot()
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
