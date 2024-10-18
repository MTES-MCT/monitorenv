import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('MonitorExt', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/ext#@-195375.91,6028315.57,7.57')
    cy.wait(500)
  })

  it('A user can search semaphore', () => {
    cy.wait(200)
    cy.clickButton('Chercher un sémaphore')
    cy.fill('Rechercher un sémaphore', 'Sémaphore de Fécamp', { delay: 400 })
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 250, width: 250, x: 440, y: 450 }
      }
    })
  })

  it("A user can't see missions, reportings, bases and measurements tools button", () => {
    cy.wait(200)
    cy.getDataCy('missions-button').should('not.exist')
    cy.getDataCy('reportings-button').should('not.exist')
    cy.getDataCy('semaphores-button').should('exist')
    cy.get('button[title="Liste des unités de contrôle"]').should('not.exist')
    cy.getDataCy('measurement').should('not.exist')
    cy.getDataCy('interest-point').should('not.exist')
  })

  it("A user can't see or search vigilance areas", () => {
    cy.wait(200)
    cy.clickButton('Arbre des couches')
    cy.wait(250)

    cy.clickButton('Filtrer par type de zones')
    cy.get('[label="Période de vigilance"]').should('not.exist')

    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.getDataCy('vigilance-area-results-list-button').should('not.exist')
    cy.getDataCy('my-vigilance-areas-layers').should('not.exist')
  })
})
