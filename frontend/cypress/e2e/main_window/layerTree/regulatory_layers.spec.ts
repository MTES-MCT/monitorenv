import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('LayerTree > Regulatory Layers', () => {
  it('A regulation Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulation')

    cy.visit('/#@-481936.30,6137793.76,8.69')
    cy.wait(300) // wait for rendering initial zoom

    cy.log('load the regulation layer')
    cy.wait('@getRegulation').then(({ response }) => expect(response && response.statusCode).equal(200))
    cy.log('search for a regulation by zone')
    cy.clickButton('Arbre des couches')
    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.getDataCy('regulatory-layers-result-title').contains('13 résultats')

    cy.log('search a regulation by name')
    cy.fill('Rechercher une zone', 'querlin') // "querlin" contains a typo to test fuzzy search ("querlen" in source)
    cy.getDataCy('regulatory-layers-result-title').contains('2 résultats').click()

    cy.log("zoom on the regulation's zone and show metadata")
    cy.getDataCy('result-group').contains('ZMEL Cale Querlen').click()
    cy.getDataCy('regulatory-result-zone').contains('Zone au sud de la cale').click()
    cy.getDataCy('regulatory-metadata-header').contains('ZMEL Cale Querlen').click()
    cy.wait(1000) // let OL do the rendering
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })

    cy.log('add the regulation to My Zones')
    cy.clickButton('Sélectionner la zone')

    cy.getDataCy('my-regulatory-layers').click() // zoom on the regulation's zone
    cy.clickButton('Effacer les résultats de la recherche')
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })
    cy.clickButton('Cacher la/les zone(s)')
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })
    cy.clickButton('Afficher la/les zone(s)')
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })
    cy.clickButton('Cacher la zone')
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })
    cy.clickButton('Afficher la zone')
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })
    cy.clickButton('Supprimer la zone de ma sélection')
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })
    cy.getDataCy('my-regulatory-layers-list').contains('Aucune zone sélectionnée')
  })
})
