context('Back Office > Administration Table > Filters', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', `/api/v1/administrations`).as('getAdministrations')

    cy.visit(`/backoffice/administrations`)

    cy.wait('@getAdministrations')
  })

  it('Should show all active (unarchived) administrations by default', () => {
    cy.get('tbody > tr').should('have.length', 33)
    cy.getTableRowByText('-').should('be.visible')
    cy.getTableRowByText('Sécurité Civile').should('exist')
    cy.getTableRowByText('Administration Archivée 1').should('not.exist')
  })

  it('Should show all archived administrations when clicking on "Administrations archivées" tab', () => {
    cy.clickButton('Administrations archivées')

    cy.get('tbody > tr').should('have.length', 2)
    cy.getTableRowByText('Administration Archivée 1').should('be.visible')
    cy.getTableRowByText('Administration Archivée 2').should('be.visible')
    cy.getTableRowByText('-').should('not.exist')
  })

  it('Should find administrations matching the search query', () => {
    cy.fill('Rechercher...', 'arm')

    cy.get('tbody > tr').should('have.length', 3)
    cy.getTableRowByText('Armée Air').should('be.visible')
    cy.getTableRowByText('Gendarmerie Nationale').should('be.visible')
  })
})
