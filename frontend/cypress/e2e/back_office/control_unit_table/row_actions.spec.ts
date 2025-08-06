// Successful archiving and deleting use cases are tested in `control_unit_form.spec.ts` for Test Idempotency purpose
context('Back Office > Control Unit Table > Row Actions', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')

    cy.visit(`/backoffice/control_units`)

    cy.wait('@getControlUnits')
  })

  it('Should show an error dialog when trying to delete a control unit linked to some missions or reportings', () => {
    cy.getTableRowByText('Cultures marines – DDTM 40').clickButton('Supprimer cette unité de contrôle')

    cy.get('.Component-Dialog').should('be.visible')
    cy.contains('Suppression impossible').should('be.visible')
  })

  it("Should allow deletion of a control unit when it's only linked to a (soft) deleted mission", () => {
    cy.getTableRowByText('Police Municipale Le Marin 972').clickButton('Supprimer cette unité de contrôle')

    cy.get('.Component-Dialog').should('be.visible')
    cy.contains("Suppression de l'unité").should('be.visible')
  })
})
