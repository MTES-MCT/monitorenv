import { goToMainWindow } from '../utils'

context('Dashboard', () => {
  beforeEach(() => {
    goToMainWindow()
  })

  describe('dashboard', () => {
    it('should extract insee code, amps, regulatory and vigilance areas from the given geometry', () => {
      // Avoid sidewindow from opening that make the next test to crash
      cy.window().then(window => {
        cy.stub(window, 'open').callsFake(() => {})
      })

      cy.intercept('GET', `/bff/v1/dashboards/extract?geometry=*`).as('extractAreas')

      // When
      cy.clickButton('Voir les briefs pour les unités')

      cy.clickButton('Créer un tableau de bord')
      cy.get('#root').click(490, 550)
      cy.get('#root').click(900, 550)

      cy.clickButton('Créer le tableau')

      // Then
      cy.wait('@extractAreas').then(({ response }) => {
        if (!response) {
          assert.fail('response is undefined.')
        }
        const body = response.body

        expect(body.inseeCode).equal('29')
        expect(body.regulatoryAreaIds.length).equal(13)
        expect(body.ampIds.length).equal(4)
        expect(body.reportingIds.length).equal(6)
        expect(body.vigilanceAreaIds.length).equal(1)
      })
    })
  })

  it('Menu button should show the number of filter set', () => {
    cy.clickButton('Voir les briefs pour les unités')
    cy.fill('Façade', ['Guadeloupe'])
    cy.getDataCy('dashboard-number-filters').contains('1')
    cy.fill('Période de mise à jour', 'Année en cours')
    cy.getDataCy('dashboard-number-filters').contains('2')
    cy.fill('Unité', ['DML 2A'])
    cy.getDataCy('dashboard-number-filters').contains('3')
    cy.fill('Tags', ['AMP'])
    cy.getDataCy('dashboard-number-filters').contains('4')

    cy.fill('Façade', undefined)
    cy.fill('Période de mise à jour', 'Un mois')
    cy.fill('Unité', undefined)
    cy.fill('Tags', undefined)

    cy.getDataCy('dashboard-number-filters').should('not.exist')
  })
})
