import { FAKE_MAPBOX_RESPONSE } from '../../constants'
import { getBaseLayerSnapShot } from '../utils'

context('LayerTree > Vigilance Area Layers', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')

    cy.visit('/#@-444365.78,6153753.97,7.20')
    cy.wait(300) // wait for rendering initial zoom

    cy.wait('@getVigilanceAreas').then(({ response }) => expect(response?.statusCode).equal(200))

    cy.clickButton('Arbre des couches')
  })
  it('A vigilance area Should be searched, added to My Zones and showed on the map with the Zone button', () => {
    cy.clickButton('Définir la zone de recherche et afficher les tracés')

    cy.fill('Rechercher une zone', 'Lorem ipsum') // "Lorem ipsum" is in comments of vigilance area
    cy.fill('Période de vigilance', 'Cette année')
    cy.getDataCy('vigilance-area-results-list-button').contains('1 résultat').click()

    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 4').click()
    cy.getDataCy('vigilance-area-title').contains('Zone de vigilance 4')
    cy.wait(1000) // let OL do the rendering
    getBaseLayerSnapShot()

    // Save vigilance Area in "Mes zones de vigilance"
    cy.clickButton('Sélectionner la zone')
    cy.getDataCy('my-vigilance-areas-layers').click()
    cy.clickButton('Effacer les résultats de la recherche')
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
    cy.getDataCy('my-vigilance-area-zones-list').contains('Aucune zone sélectionnée')
  })

  it('A vigilance area should be searched per period', () => {
    // Filter "Next three months"
    cy.getDataCy('vigilance-area-results-list-button').click()
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 1')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 2')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 6')

    // Filter "Current quarter"
    cy.clickButton('Filtrer par type de zones')
    cy.fill('Période de vigilance', 'Ce trimestre')
    cy.getDataCy('vigilance-area-results-list-button').click()
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 1')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 3')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 7')

    // Filter "Current year"
    cy.clickButton('Filtrer par type de zones')
    cy.fill('Période de vigilance', 'Cette année')
    cy.getDataCy('vigilance-area-results-list-button').click()
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 1')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 2')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 3')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 4')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 5')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 6')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 7')
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 8')

    // Filter "Spécific Period"
    cy.clickButton('Filtrer par type de zones')
    cy.fill('Période de vigilance', 'Période spécifique')
    cy.fill('Période spécifique', [
      [2021, 1, 1],
      [2022, 3, 3]
    ])
    cy.getDataCy('vigilance-area-results-list-button').contains('0 résultat')
  })
  it('Result list should be displayed by default but not checked and total should be visible', () => {
    cy.getDataCy('vigilance-area-results-list-button').contains('4 résultats')

    cy.get('#isVigilanceAreaSearchResultsVisible').should('not.be.checked')
    cy.getDataCy('vigilance-area-results-list-button').click()
    cy.getDataCy('vigilance-area-result-list').children().should('have.length', 4)
    cy.get('#isVigilanceAreaSearchResultsVisible').should('be.checked')
  })
})
