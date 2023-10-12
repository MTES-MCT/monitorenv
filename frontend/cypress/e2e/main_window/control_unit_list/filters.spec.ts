import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Main Window > Control Unit List > Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.visit(`/`).wait(1000)

    cy.clickButton('Liste des unités de contrôle')
  })

  it('Should show all control units by default', () => {
    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 33)

    cy.contains('A636 Maïto').should('exist')
    cy.contains('SML 50').should('exist')
  })

  it('Should find control units matching the search query', () => {
    cy.fill('Rechercher une unité', 'marine')

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 4)

    cy.contains('Cultures marines – DDTM 30').should('exist')
    cy.contains('A636 Maïto').should('exist')
  })

  it('Should find control units matching the selected administration', () => {
    cy.fill('Administration', 'Douane')

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 5)

    cy.contains('BGC Ajaccio').should('exist')
    cy.contains('DF 61 Port-de-Bouc').should('exist')
  })

  it('Should find control units matching the selected resource type', () => {
    cy.fill('Type de moyen', 'Barge')

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 3)

    cy.contains('Cultures marines – DDTM 40').should('exist')
    cy.contains('DPM – DDTM 14').should('exist')
  })

  it('Should find control units matching the selected base', () => {
    cy.fill('Base du moyen', 'Marseille')

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 1)

    cy.contains('Cultures marines – DDTM 40').should('exist')
  })
})
