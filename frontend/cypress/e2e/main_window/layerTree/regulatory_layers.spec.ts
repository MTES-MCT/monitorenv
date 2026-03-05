import { Layers } from 'domain/entities/layers/constants'

import { FAKE_MAPBOX_RESPONSE, PAGE_CENTER_PIXELS } from '../../constants'

context('LayerTree > Regulatory Layers', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v2/regulatory-areas').as('getRegulatoryAreas')

    cy.visit('/#@-481936.30,6137793.76,8.69')
    cy.wait(['@getAmps', '@getRegulatoryAreas'])

    cy.clickButton('Arbre des couches')
  })
  it('A regulatory area should be consulted', () => {
    cy.getDataCy('regulatory-result-list-button').click()
    cy.clickButton('Dragage port de Brest')
    cy.clickButton('Autorisation de dragage pendant les travaux')
    cy.getDataCy('regulatory-area-panel').should('be.visible')
    cy.get('[data-cy="regulatory-area-panel"] > header > span').contains('Dragage port de Brest')
    cy.getDataCy('regulatory-layers-metadata-polyName').contains('Autorisation de dragage pendant les travaux')
    cy.getDataCy('regulatory-layers-metadata-resume').contains(
      "Zone de dragage concernant l'accès maritime au Polder 124"
    )
    cy.getDataCy('regulatory-layers-metadata-type').contains('Arrêté préfectoral')
    cy.getDataCy('regulatory-layers-metadata-plan').contains('PSCEM')
    cy.getDataCy('regulatory-layers-metadata-facade').contains('NAMO')
    cy.getDataCy('metadata-panel-references').contains(
      "Arrêté préfectoral n°2015 212 0008 du 31 juillet 2015 portant autorisation au titre de l'article L.214-3 du code de l'environnement du développement du port de Brest"
    )
  })

  it('A regulatory area Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.getDataCy('regulatory-result-list-button').contains('13 résultats')

    cy.log('search a regulation by name')
    cy.fill('Rechercher une zone', 'querlen')
    cy.getDataCy('regulatory-result-list-button').contains('2 résultats').click()

    cy.log("zoom on the regulation's zone and show metadata")
    cy.clickButton('ZMEL Cale Querlen')
    cy.clickButton('Autorisation temporaire du domaine public')
    cy.getDataCy('regulatory-area-panel').contains('ZMEL Cale Querlen').click()
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
