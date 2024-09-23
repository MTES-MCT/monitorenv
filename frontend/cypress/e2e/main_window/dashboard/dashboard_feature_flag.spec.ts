import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-394744.20,6104201.66,8.72')
    Cypress.env('CYPRESS_FRONTEND_DASHBOARD_ENABLED', 'false')
  })

  describe('dashboard menu button', () => {
    it('should not appear when feature is disable', () => {
      cy.getDataCy('dashboard').should('not.exist')
    })
  })
})
