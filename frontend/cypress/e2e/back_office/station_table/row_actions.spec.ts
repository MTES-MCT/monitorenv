// Successful archiving and deleting use cases are tested in `base_form.spec.ts` for Test Idempotency purpose
context('Back Office > Station Table > Row Actions', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', `/api/v1/stations`).as('getStations')

    cy.visit(`/backoffice/stations`)

    cy.wait('@getStations')
  })

  it('Should show an error dialog when trying to delete a station linked to some control unit resources', () => {
    cy.getTableRowById(3).clickButton('Supprimer cette base')

    cy.get('.Component-Dialog').should('be.visible')
    cy.contains('Suppression impossible').should('be.visible')
  })
})
