import { FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Main Window > Control Unit List Dialog > Filters', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.visit(`/`).wait(1000)

    cy.clickButton('Liste des unités de contrôle')
  })

  it('Should show all control units by default', () => {
    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 32)

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

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 3)

    cy.contains('BSN Ste Maxime').should('exist')
    cy.contains('DF 61 Port-de-Bouc').should('exist')
  })

  it('Should find control units matching the selected resource type', () => {
    cy.fill('Type de moyen', 'Barge')

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 3)

    cy.contains('Cultures marines – DDTM 40').should('exist')
    cy.contains('DPM – DDTM 14').should('exist')
  })

  it('Should find control units matching the selected resource category', () => {
    cy.fill('Catégorie de moyen', ['Aérien', 'Terrestre'])

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 2)

    cy.contains('Cultures marines – DDTM 40').should('exist')
    cy.contains('DML 2A').should('exist')
  })

  it('Should find control units matching the selected base', () => {
    cy.fill('Base du moyen', 'Marseille')

    cy.getDataCy('ControlUnitListDialog-control-unit').should('have.length', 1)

    cy.contains('Cultures marines – DDTM 40').should('exist')
  })

  it('Menu button should show the number of filter set', () => {
    cy.fill('Administration', 'Douane')
    cy.getDataCy('control-unit-number-filters').contains('1')
    cy.fill('Type de moyen', 'Barge')
    cy.getDataCy('control-unit-number-filters').contains('2')
    cy.fill('Catégorie de moyen', ['Aérien', 'Terrestre'])
    cy.getDataCy('control-unit-number-filters').contains('3')
    cy.fill('Base du moyen', 'Marseille')
    cy.getDataCy('control-unit-number-filters').contains('4')

    cy.fill('Administration', undefined)
    cy.fill('Type de moyen', undefined)
    cy.fill('Catégorie de moyen', undefined)
    cy.fill('Base du moyen', undefined)
    cy.getDataCy('control-unit-number-filters').should('not.exist')
  })
})
