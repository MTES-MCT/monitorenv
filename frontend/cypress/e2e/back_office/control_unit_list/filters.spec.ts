context('Back Office > Control Unit List > Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')

    cy.visit(`/backoffice/control_units`)

    cy.wait('@getControlUnits')
  })

  it('Should show all active (unarchived) control units by default', () => {
    cy.get('tbody > tr').should('have.length', 31)
    cy.getTableRowByText('A636 Maïto').should('be.visible', 'A636 Maïto')
    cy.getTableRowByText('SML 50').should('exist')
    cy.getTableRowByText('BGC Ajaccio').should('not.exist')
  })

  it('Should show all archived control units when clicking on "Unités archivées" tab', () => {
    cy.clickButton('Unités archivées')

    cy.get('tbody > tr').should('have.length', 2)
    cy.getTableRowByText('BGC Ajaccio').should('be.visible')
    cy.getTableRowByText('BGC Bastia').should('be.visible')
    cy.getTableRowByText('A636 Maïto').should('not.exist')
  })

  it('Should find control units matching the search query', () => {
    cy.fill('Rechercher...', 'marine')

    cy.get('tbody > tr').should('have.length', 4)
    cy.getTableRowByText('A636 Maïto').should('be.visible', 'A636 Maïto')
    cy.getTableRowByText('SML 50').should('not.exist')
  })
})
