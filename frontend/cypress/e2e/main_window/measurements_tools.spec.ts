import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('Measurement tools', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-824534.42,6082993.21,8.70')
  })

  it('A user measure a distance with line tool', () => {
    cy.wait(200)
    cy.clickButton('Mesurer une distance')
    cy.clickButton("Mesure d'une distance avec lignes brisées")

    cy.get('#root').click(490, 580)
    cy.get('#root').click(690, 880)
    cy.get('#root').click(400, 500)
    cy.get('#root').click(400, 500)
    cy.getDataCy('measurement-value').should('be.visible')
  })
  it('A user measure a distance with circle tool', () => {
    cy.wait(200)
    cy.clickButton('Mesurer une distance')
    cy.clickButton("Rayon d'action")

    cy.get('#root').click(850, 780)
    cy.get('#root').click(1050, 780)
    cy.getDataCy('measurement-value').should('be.visible')
  })
})
