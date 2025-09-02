context('Back Office > Administration Form', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', `/api/v1/administrations`).as('getAdministrations')
    cy.visit(`/backoffice/administrations`)
    cy.wait('@getAdministrations')
  })

  it('Should validate the form', () => {
    cy.clickButton('Nouvelle administration')

    cy.clickButton('Créer')

    cy.contains('Le nom est obligatoire.').should('be.visible')

    cy.clickButton('Annuler')

    cy.get('h1').contains('Gestion des administrations').should('be.visible')
  })

  it('Should create, edit, archive and delete an administration', () => {
    // -------------------------------------------------------------------------
    // Create

    cy.intercept('POST', `/api/v1/administrations`).as('createAdministration')

    cy.clickButton('Nouvelle administration')

    cy.fill('Nom', 'Administration 1')

    cy.clickButton('Créer')

    cy.wait('@createAdministration').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      const id = response.body.id

      assert.deepEqual(request.body, {
        isArchived: false,
        name: 'Administration 1'
      })

      // -------------------------------------------------------------------------
      // Edit

      cy.intercept('PUT', `/api/v1/administrations/${id}`).as('updateAdministration')

      cy.getTableRowById(id).clickButton('Éditer cette administration')

      cy.fill('Nom', 'Administration 2')

      cy.clickButton('Mettre à jour')

      cy.wait('@updateAdministration').then(({ request: requestOfUpdate, response: responseOfUpdate }) => {
        if (!responseOfUpdate) {
          assert.fail('response is undefined.')
        }

        assert.deepInclude(requestOfUpdate.body, {
          id,
          isArchived: false,
          name: 'Administration 2'
        })
      })

      // -------------------------------------------------------------------------
      // Archive

      cy.intercept('PUT', `/api/v1/administrations/${id}/archive`).as('archiveAdministration')

      cy.getTableRowById(id).clickButton('Archiver cette administration')
      cy.clickButton('Archiver')

      cy.wait('@archiveAdministration')

      cy.getTableRowById(id).should('not.exist')
      cy.clickButton('Administrations archivées')
      cy.getTableRowById(id).should('exist')

      // -------------------------------------------------------------------------
      // Delete

      cy.intercept('DELETE', `/api/v1/administrations/${id}`).as('deleteAdministration')

      cy.getTableRowById(id).clickButton('Supprimer cette administration')
      cy.clickButton('Supprimer')

      cy.wait('@deleteAdministration')

      cy.getTableRowById(id).should('not.exist')
      cy.clickButton('Administrations actives')
      cy.getTableRowById(id).should('not.exist')
    })
  })
})
