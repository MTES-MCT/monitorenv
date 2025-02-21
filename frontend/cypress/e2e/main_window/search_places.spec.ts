import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('Search Places', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-824534.42,6082993.21,8.70')
    cy.wait(500)
  })

  it('A user can search a place and zoom on it when it is selected', () => {
    cy.wait(200)
    cy.getDataCy('location-search-input').type('Nantes', { delay: 400 })
    cy.wait(500)
    cy.get('.rs-auto-complete-item').first().click()
    cy.url().should('include', '/#@-173695.65,5981052.00,12.96')
  })
})
