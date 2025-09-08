import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Reporting', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-394744.20,6104201.66,8.72')
  })

  describe('Menu button', () => {
    it('Should show the number of filter set', () => {
      cy.clickButton('Chercher des signalements')
      cy.fill('Archivés', true)
      cy.getDataCy('reporting-number-filters').contains('1')
      cy.fill('Liés à une mission', true)
      cy.getDataCy('reporting-number-filters').contains('2')
      cy.fill('Période', 'Année en cours')
      cy.getDataCy('reporting-number-filters').contains('3')
      cy.fill('Type de source', ['Unité'])
      cy.getDataCy('reporting-number-filters').contains('4')
      cy.fill('Type de signalement', 'Observation')
      cy.getDataCy('reporting-number-filters').contains('5')
      cy.fill('Type de cible', ['Véhicule'])
      cy.getDataCy('reporting-number-filters').contains('6')
      cy.fill('Thématiques', ['Pêche à pied de loisir'])
      cy.getDataCy('reporting-number-filters').contains('7')
      cy.fill('Tags et sous-tags', ['AMP'])
      cy.getDataCy('reporting-number-filters').contains('8')

      cy.fill('Archivés', false)
      cy.fill('Liés à une mission', false)
      cy.fill('Période', '30 derniers jours')
      cy.fill('Type de source', undefined)
      cy.fill('Type de signalement', undefined)
      cy.fill('Type de cible', undefined)
      cy.fill('Thématiques', undefined)
      cy.fill('Tags et sous-tags', undefined)

      cy.getDataCy('reporting-number-filters').should('not.exist')
    })
  })
})
