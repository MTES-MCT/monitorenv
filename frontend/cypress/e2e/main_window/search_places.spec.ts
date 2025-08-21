import { goToMainWindow } from './utils'

context('Search Places', () => {
  beforeEach(() => {
    goToMainWindow()
  })

  it('A user can search a place and zoom on it when it is selected', () => {
    cy.getDataCy('location-search-input').type('Nantes', { delay: 400 })
    cy.wait(500)
    cy.get('.rs-auto-complete-item').first().click()
    cy.url().should('include', '/#@-173695.65,5981052.00,12.96')
  })
})
