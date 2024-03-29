import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('Search Places', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-824534.42,6082993.21,8.70')
  })

  it('A user can search a place and zoom on it when it is selected', () => {
    cy.fill('Rechercher un lieu', 'Nantes', { delay: 200 })
    cy.url().should('include', '/#@-173695.64,5981051.92,12.96')
  })
})
