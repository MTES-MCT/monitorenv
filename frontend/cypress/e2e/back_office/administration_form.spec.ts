context('Back Office > Administration Form', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/administrations`).as('getAdministrations')

    cy.visit(`/backoffice/administrations`)

    cy.wait('@getAdministrations')
  })

  it('Should create, edit, archive and delete an administration', () => {
    // -------------------------------------------------------------------------
    // Create

    cy.intercept('POST', `/api/v1/administrations`).as('createAdministration')

    cy.clickButton('Nouvelle administration')

    cy.fill('Nom', 'Administration 1')

    cy.clickButton('Créer')

    cy.wait('@createAdministration').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        isArchived: false,
        name: 'Administration 1'
      })
    })

    // -------------------------------------------------------------------------
    // Edit

    cy.intercept('PUT', `/api/v1/administrations/2007`).as('updateAdministration')

    cy.getTableRowById(2007).clickButton('Éditer cette administration')

    cy.fill('Nom', 'Administration 2')

    cy.clickButton('Mettre à jour')

    cy.wait('@updateAdministration').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        id: 2007,
        isArchived: false,
        name: 'Administration 2'
      })
    })

    // -------------------------------------------------------------------------
    // Archive

    cy.intercept('POST', `/api/v1/administrations/2007/archive`).as('archiveAdministration')

    cy.getTableRowById(2007).clickButton('Archiver cette administration')
    cy.clickButton('Confirmer')

    cy.wait('@archiveAdministration')

    cy.getTableRowById(2007).should('not.exist')
    cy.clickButton('Administrations archivées')
    cy.getTableRowById(2007).should('exist')

    // -------------------------------------------------------------------------
    // Delete

    cy.intercept('DELETE', `/api/v1/administrations/2007`).as('deleteAdministration')

    cy.getTableRowById(2007).clickButton('Supprimer cette administration')
    cy.clickButton('Confirmer')

    cy.wait('@deleteAdministration')

    cy.getTableRowById(2007).should('not.exist')
    cy.clickButton('Administrations actives')
    cy.getTableRowById(2007).should('not.exist')
  })
})
