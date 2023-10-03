context('Back Office > Control Unit List > Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')

    cy.visit(`/backoffice/control_units`)

    cy.wait('@getControlUnits')
  })

  it('Should show all control units by default', () => {
    cy.get('tbody > tr').should('have.length', 31)
    cy.getTableRowByText('A636 Maïto').should('exist', 'A636 Maïto')
    cy.getTableRowByText('A636 Maïto').should('exist', 'SML 50')
    cy.getTableRowByText('BGC Ajaccio').should('not.exist')
  })

  it('Should find control units matching the search query', () => {
    cy.fill('Rechercher...', 'marine')

    cy.get('tbody > tr').should('have.length', 4)
    cy.getTableRowByText('A636 Maïto').should('exist', 'A636 Maïto')
    cy.getTableRowByText('SML 50').should('not.exist')
  })
})
