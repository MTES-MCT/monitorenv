import { goToMainWindow } from './utils'

context('Main Window > Station Overlay', () => {
  beforeEach(() => {
    goToMainWindow()
    cy.clickButton('Liste des unités de contrôle')
    cy.clickButton('Afficher les bases').wait(1000)
  })

  it('Should show the expected station card and select the expected station filter when clicked', () => {
    // Click on Marseille base
    cy.get('.ol-viewport').click(750, 720, { force: true })

    cy.getDataCy('StationOverlay-card').contains('Marseille').should('be.visible')
    cy.getDataCy('StationOverlay-card').contains('Cultures marines – DDTM 40').should('be.visible')
    cy.getDataCy('StationOverlay-card').find('.Element-Tag').should('have.text', '2 Barges')
    // Expected base filter in control unit list dialog
    cy.get('.rs-picker-toggle-value').should('have.text', 'Marseille')
  })
})
