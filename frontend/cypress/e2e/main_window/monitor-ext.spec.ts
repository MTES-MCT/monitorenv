import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('MonitorExt', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.intercept('GET', '/bff/v1/semaphores').as('getSemaphores')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')
    cy.intercept('GET', '/bff/v1/reportings?*').as('getReportings')
    cy.visit('/ext#@-195375.91,6028315.57,7.57')
    cy.wait(500)

    cy.wait(['@getSemaphores', '@getVigilanceAreas', '@getReportings'])
  })

  it('A user can search semaphore', () => {
    cy.wait(200)
    cy.clickButton('Chercher un sémaphore')
    cy.fill('Rechercher un sémaphore', 'Sémaphore de Fécamp', { delay: 200 })
    cy.url().should('contain', '/ext#@41280.98,6406155.75,14.00')
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

  it('A user can consult vigilance areas', () => {
    cy.intercept('PUT', '/bff/v1/vigilance_areas/1').as('editVigilanceArea')
    cy.wait(200)
    cy.clickButton('Arbre des couches')
    cy.wait(250)

    cy.clickButton('Filtrer par type de zones')
    cy.get('[label="Période de vigilance"]').should('not.exist')

    cy.clickButton('Définir la zone de recherche et afficher les tracés')
    cy.getDataCy('vigilance-area-results-list-button').contains('1 résultat')
    cy.getDataCy('vigilance-area-results-list-button').click()
    cy.getDataCy('vigilance-area-result-zone').contains('Zone de vigilance 1')
    cy.getDataCy('vigilance-area-result-zone').click()
    cy.getDataCy('vigilance-area-title').should('have.text', 'Zone de vigilance 1')

    cy.getDataCy('vigilance-area-panel-source').should('not.exist')
  })
  it('A user can consult reporting', () => {
    cy.wait(1000).get('#root').click(325, 580).wait(250)
    cy.clickButton('Consulter le signalement')

    cy.getDataCy('reporting-title').contains('23-00007 - Good Company')
    cy.get('.Field-TextInput').find('label').contains('Saisi par').should('not.exist')
    cy.get('.Field-TextInput').find('label').contains('Actions effectuées').should('not.exist')
  })
})
