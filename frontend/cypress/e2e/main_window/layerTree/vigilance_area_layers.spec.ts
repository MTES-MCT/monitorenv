import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('LayerTree > Vigilance Area Layers', () => {
  it('A vigilance area Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')

    cy.visit('/#@-444365.78,6153753.97,7.20')
    cy.wait(300) // wait for rendering initial zoom

    cy.wait('@getVigilanceAreas').then(({ response }) => expect(response && response.statusCode).equal(200))

    cy.clickButton('Arbre des couches')
    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.getDataCy('vigilance-area-results-list').contains('5 résultats')

    cy.fill('Rechercher une zone', 'Lorem ipsum') // "Lorem ipsum" is in comments of vigilance area
    cy.getDataCy('vigilance-area-results-list').contains('1 résultat').click()

    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 4').click()
    cy.getDataCy('vigilance-area-title').contains('Zone de vigilance 4')
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

    // Save vigilance Area in "Mes zones de vigilance"
    cy.clickButton('Sélectionner la zone')
    cy.getDataCy('my-vigilance-areas-layers').click()
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
    cy.getDataCy('my-vigilance-area-zones-list').contains('Aucune zone sélectionnée')
  })

  it('A vigilance area should be searched per period', () => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')

    cy.visit('/#@-444365.78,6153753.97,7.20')
    cy.wait(300) // wait for rendering initial zoom

    cy.wait('@getVigilanceAreas').then(({ response }) => expect(response && response.statusCode).equal(200))

    cy.clickButton('Arbre des couches')
    cy.clickButton('Filtrer par type de zones')

    // Filter "Next three months"
    cy.fill('Période de vigilance', 'Les trois prochains mois')
    cy.getDataCy('vigilance-area-results-list').contains('4 résultats').click()
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 2')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 3')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 8')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 9')

    // Filter "Current quarter"
    cy.clickButton('Filtrer par type de zones')
    cy.fill('Période de vigilance', 'Ce trimestre')
    cy.getDataCy('vigilance-area-results-list').contains('4 résultats').click()
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 2')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 3')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 8')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 9')

    // Filter "Current year"
    cy.clickButton('Filtrer par type de zones')
    cy.fill('Période de vigilance', 'Cette année')
    cy.getDataCy('vigilance-area-results-list').contains('8 résultats').click()
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 2')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 3')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 4')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 5')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 6')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 7')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 8')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 9')
  })
})
