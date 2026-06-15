import { FAKE_MAPBOX_RESPONSE } from './constants'
import { checkA11y } from './utils/a11y'
import { visitSideWindow } from './utils/visitSideWindow'

context('Axe core RGAA check that ', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory-areas').as('getRegulatoryAreas')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')
    cy.intercept('GET', '/bff/v1/dashboards').as('getDashboards')
    cy.viewport(1280, 1024)
  })

  it('Layer selector should respect RGAA criteria', () => {
    cy.visit('/#@-192242.97,5819420.73,9.93')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])
    cy.clickButton('Arbre des couches')
    cy.injectAxe()
    checkA11y()
  })

  describe('Mission ', () => {
    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Afficher les filtres')
      cy.wait('@getMissions')
      cy.injectAxe()
      checkA11y()
    })

    it('with surveillance action opened should respect RGAA criteria', () => {
      visitSideWindow()
      cy.wait('@getMissions')
      cy.clickButton('Afficher les filtres')
      cy.fill('Période', 'Année en cours')
      cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
      cy.getDataCy('action-card').eq(0).click()
      cy.injectAxe()
      checkA11y()
    })

    it('with a control action opened should respect RGAA criteria', () => {
      visitSideWindow()
      cy.wait('@getMissions')
      cy.clickButton('Afficher les filtres')
      cy.fill('Période', 'Année en cours')
      cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
      cy.getDataCy('action-card').eq(1).click()
      cy.injectAxe()
      checkA11y()
    })

    it('with attached reporting should respect RGAA criteria', () => {
      visitSideWindow()
      cy.wait('@getMissions')
      cy.clickButton('Afficher les filtres')
      cy.fill('Période', 'Année en cours')
      cy.injectAxe()
      cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
      cy.getDataCy('action-card').eq(2).click()
      cy.injectAxe()
      checkA11y()
    })
  })

  describe('Vigilance area ', () => {
    it('form should respect RGAA criteria', () => {
      cy.visit('/#@-192242.97,5819420.73,9.93')
      cy.wait(['@getVigilanceAreas'])
      cy.clickButton('Arbre des couches')
      cy.getDataCy('vigilance-area-results-list-button').click()
      cy.clickButton('Zone de vigilance 1')
      cy.clickButton('Editer')
      cy.injectAxe()
      checkA11y()
    })

    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Zones de vigilance')
      cy.wait(['@getVigilanceAreas'])
      cy.injectAxe()
      checkA11y()
    })
  })

  describe('Reporting ', () => {
    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Signalements')
      cy.wait('@getReportings')
      cy.injectAxe()
      checkA11y()
    })

    it('a reporting form should respect RGAA criteria', () => {
      cy.visit(`/`)
      cy.clickButton('Chercher des signalements')
      cy.clickButton('Ajouter un signalement')
      cy.injectAxe()
      checkA11y()
    })
  })

  describe('Dashboard ', () => {
    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Tableaux de bord')
      cy.wait(['@getDashboards'])
      cy.injectAxe()
      checkA11y()
    })

    it('form should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Tableaux de bord')
      cy.wait(['@getDashboards'])
      const id = 'e2a7d0ae-55ff-4fd9-8a6d-88b92d2b1a42'
      cy.getDataCy(`edit-dashboard-${id}`).click({ force: true })

      // Tab should be visible
      cy.getDataCy('dashboard-1').contains('Dashboard 2')
      cy.injectAxe()
      checkA11y()
    })
  })

  describe('Backoffice ', () => {
    it('administration list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/administrations`)
      cy.injectAxe()
      checkA11y()
    })
    it('control unit list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/control_units`)
      cy.injectAxe()
      checkA11y()
    })
    it('stations list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/stations`)
      cy.injectAxe()
      checkA11y()
    })
    /*     it('regulatory areas list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/regulatory_areas`)
      cy.injectAxe()
      cy.intercept('GET', `bff/v1/regulatory-areas/134`).as('getRegulatoryArea')
      cy.clickButton('Déplier le contenu des zones PIRC')
      cy.clickButton('Interdiction VNM Molene')
      checkA11y()
      cy.get('span[title="Article 1"]').click()
      cy.wait('@getRegulatoryArea')
      cy.clickButton('Editer la réglementation')
      // Wait for the zoom
      cy.wait(500)
      checkA11y()
    }) */

    it('tag list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/tags`)
      cy.injectAxe()
      cy.clickButton('Éditer ce tag')
      checkA11y()
    })
  })
})
