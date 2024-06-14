import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('MonitorExt', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/ext#@-824534.42,6082993.21,8.70')
    cy.wait(500)
  })

  it('A user can search semaphore', () => {
    cy.wait(200)
    cy.clickButton('Chercher un sémaphore')
    cy.fill('Rechercher un sémaphore', 'Sémaphore de Fécamp')
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
})
