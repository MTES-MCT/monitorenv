// Successful archiving and deleting use cases are tested in `administration_form.spec.ts` for Test Idempotency purpose
context('Back Office > Administration Table > Row Actions', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', `/api/v1/administrations`).as('getAdministrations')

    cy.visit(`/backoffice/administrations`)

    cy.wait('@getAdministrations')
  })

  it('Should show an error dialog when trying to archive an administration linked to unarchived control units', () => {
    cy.getTableRowById(1005).clickButton('Archiver cette administration')

    cy.get('.Component-Dialog').should('be.visible')
    cy.contains('Archivage impossible').should('be.visible')
  })

  it('Should show an error dialog when trying to delete an administration linked to some control units', () => {
    cy.getTableRowById(1005).clickButton('Supprimer cette administration')

    cy.get('.Component-Dialog').should('be.visible')
    cy.contains('Suppression impossible').should('be.visible')
  })
})
