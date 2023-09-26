import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Main Window > Control Unit List > Filter Bar', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.visit(`/`).wait(1000)

    cy.clickButton('Liste des unités de contrôle')
  })

  it('Should show all control units by default', () => {
    cy.getDataCy('control-unit-list-item').should('have.length', 33)
  })

  it('Should find control units matching the search query', () => {
    cy.fill('Rechercher une unité', 'marine')

    cy.getDataCy('control-unit-list-item').should('have.length', 4)

    cy.getDataCy('control-unit-33').should('exist')
    cy.getDataCy('control-unit-24').should('exist')
  })

  it('Should find control units matching the selected administration', () => {
    cy.fill('Administration', 'Douane')

    cy.getDataCy('control-unit-list-item').should('have.length', 5)

    cy.getDataCy('control-unit-14').should('exist')
    cy.getDataCy('control-unit-18').should('exist')
  })

  it('Should find control units matching the selected resource type', () => {
    cy.fill('Type de moyen', 'Barge')

    cy.getDataCy('control-unit-list-item').should('have.length', 3)

    cy.getDataCy('control-unit-1').should('exist')
    cy.getDataCy('control-unit-4').should('exist')
  })

  it('Should find control units matching the selected base', () => {
    cy.fill('Base du moyen', 'Marseille')

    cy.getDataCy('control-unit-list-item').should('have.length', 1)

    cy.getDataCy('control-unit-1').should('exist')
  })
})
