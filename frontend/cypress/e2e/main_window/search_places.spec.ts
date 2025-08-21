import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('Search Places', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-824534.42,6082993.21,8.70')
  })

  it('A user can search a place and zoom on it when it is selected', () => {
    cy.getDataCy('location-search-input').type('Nantes', { delay: 400 })
    cy.wait(500)
    cy.get('.rs-auto-complete-item').first().click()
    cy.url().should('include', '/#@-173695.65,5981052.00,12.96')
  })

  it('A user can search a beach and zoom on it when it is selected', () => {
    cy.getDataCy('location-search-input').type("Plan d'eau, Étel", { delay: 400 })
    cy.get('.rs-auto-complete-item').first().click()
    cy.url().should('include', '/#@-356522.93,6049418.48,14.00')
  })
})
