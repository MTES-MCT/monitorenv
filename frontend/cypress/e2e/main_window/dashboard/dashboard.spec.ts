import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-394744.20,6104201.66,8.72')
  })

  describe('dashboard', () => {
    it('should extract insee code, amps, regulatory and vigilance areas from the given geometry', () => {
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
        expect(body.vigilanceAreaIds.length).equal(2)
      })
    })
  })
})
