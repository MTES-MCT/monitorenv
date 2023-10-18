// Successful archiving and deleting use cases are tested in `base_form.spec.ts` for Test Idempotency purpose
context('Back Office > Base Table > Row Actions', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/bases`).as('getBases')

    cy.visit(`/backoffice/bases`)

    cy.wait('@getBases')
  })

  it('Should show a dialog when trying to delete a base linked to some control unit resources', () => {
    cy.intercept('DELETE', `/api/v1/bases/3`).as('deleteBase')

    cy.getTableRowById(3).clickButton('Supprimer cette base')

    cy.get('.Component-Dialog').should('be.visible')
    cy.contains('Suppression impossible').should('be.visible')
  })
})
