import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Search Places', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-824534.42,6082993.21,8.70')
  })

  it('A user can search a vessel and show its resume when it is selected', () => {
    cy.clickButton('Lieux')
    cy.clickButton('Navires')
    cy.getDataCy('vessel-search-input').type('shipname', { delay: 400 })
    cy.wait(500)
    cy.get('.rs-auto-complete-item').first().click()
    cy.getDataCy('vessel-resume-SHIPNAME 1').should('be.visible')
    cy.clickButton('Fermer la fiche navire')
    cy.getDataCy('vessel-resume-SHIPNAME 1').should('not.exist')
  })
})
