import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Mission', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-394744.20,6104201.66,8.72')
  })

  describe('Menu button', () => {
    it('Should show the number of filter set', () => {
      cy.clickButton('Voir les missions')
      cy.fill('En cours', true)
      cy.getDataCy('mission-number-filters').contains('1')
      cy.fill('Période', 'Année en cours')
      cy.getDataCy('mission-number-filters').contains('2')
      cy.fill('Administration', ['DDTM'])
      cy.getDataCy('mission-number-filters').contains('3')
      cy.fill('Unité', ['DML 2A'])
      cy.getDataCy('mission-number-filters').contains('4')
      cy.fill('Type de mission', ['Air'])
      cy.getDataCy('mission-number-filters').contains('5')
      cy.fill('État des données', ['À jour'])
      cy.getDataCy('mission-number-filters').contains('6')
      cy.fill('Thématiques', ['Mouillage individuel'])
      cy.getDataCy('mission-number-filters').contains('7')
      cy.fill('Tags et sous-tags', ['AMP'])
      cy.getDataCy('mission-number-filters').contains('8')

      cy.fill('En cours', false)
      cy.fill('Période', "Aujourd'hui")
      cy.fill('Administration', undefined)
      cy.fill('Unité', undefined)
      cy.fill('Type de mission', undefined)
      cy.fill('État des données', undefined)
      cy.fill('Thématiques', undefined)
      cy.fill('Tags et sous-tags', undefined)

      cy.getDataCy('mission-number-filters').should('not.exist')
    })
  })
})
