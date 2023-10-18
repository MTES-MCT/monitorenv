// Successful archiving and deleting use cases are tested in `control_unit_form.spec.ts` for Test Idempotency purpose
context('Back Office > Control Unit Table > Row Actions', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')

    cy.visit(`/backoffice/control_units`)

    cy.wait('@getControlUnits')
  })

  it('Should show a dialog when trying to delete a control unit linked to some missions or reportings', () => {
    cy.intercept('DELETE', `/api/v2/control_units/10000`).as('deleteControlUnit')

    cy.getTableRowById(10000).clickButton('Supprimer cette unité de contrôle')

    cy.get('.Component-Dialog').should('be.visible')
    cy.contains('Suppression impossible').should('be.visible')
  })
})
