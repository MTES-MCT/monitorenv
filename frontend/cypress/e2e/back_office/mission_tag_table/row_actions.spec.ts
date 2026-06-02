context('Back Office > Tag Table > Row actions', () => {
  beforeEach(() => {
    cy.visit(`/backoffice/mission_tags`)
  })

  it('Should edit the tag when clicking on Edit', () => {
    cy.intercept('PUT', `/bff/v1/missions/tags`).as('saveMissionTag')
    cy.contains('Mission tag 1').closest('tr').as('row')
    cy.get('@row').within(() => cy.get('button[title="Éditer cette étiquette de mission"]').click({ force: true }))
    cy.fill("Nom de l'étiquette de mission", 'Mission tag 1 archived')
    cy.fill('Statut', 'Archivé')
    cy.clickButton('Sauvegarder cette étiquette de mission')

    cy.wait('@saveMissionTag').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.deepEqual(request.body, {
        id: 1,
        isArchived: true,
        name: 'Mission tag 1 archived'
      })
    })

    cy.wait(250)
    // Reset data
    cy.contains('Mission tag 1 archived').closest('tr').as('row')

    cy.get('@row').within(() => cy.get('button[title="Éditer cette étiquette de mission"]').click({ force: true }))
    cy.fill("Nom de l'étiquette de mission", 'Mission tag 1')
    cy.fill('Statut', 'Actif')
    cy.get('button[title="Sauvegarder cette étiquette de mission"]').click({ force: true })
  })

  it('Should not be possible to save if the tag is invalid', () => {
    cy.get('tbody > tr')
      .first()
      .within(() => {
        cy.get('button[title="Éditer cette étiquette de mission"]').click({ force: true })
      })
    cy.fill("Nom de l'étiquette de mission", '')
    cy.get('button[title="Sauvegarder cette étiquette de mission"]').should('be.disabled')
    cy.fill("Nom de l'étiquette de mission", 'AAAAA')
    cy.get('button[title="Sauvegarder cette étiquette de mission"]').should('not.be.disabled')
  })

  it('Should add a new mission tag', () => {
    cy.intercept('PUT', `/bff/v1/missions/tags`).as('saveMissionTag')
    cy.clickButton('Ajouter une étiquette de mission')
    cy.get('tbody > tr')
      .last()
      .scrollIntoView()
      .within(() => {
        cy.fill("Nom de l'étiquette de mission", 'New mission tag')
        cy.fill('Statut', 'Actif')
        cy.clickButton('Sauvegarder cette étiquette de mission')
        // Disabling saving because we cant rollback
        // cy.get('button[title="Sauvegarder cette étiquette de mission"]').should('not.be.disabled')
      })

    // Disabling saving because we cant delete a tag (rollback)
    // cy.wait('@saveMissionTag').then(({ request, response }) => {
    //   if (!response) {
    //     assert.fail('response is undefined.')
    //   }
    //   assert.deepEqual(request.body, {
    //     id: null,
    //     isArchived: true,
    //     name: 'New mission tag'
    //   })
    // })
    //
    // cy.get('tbody > tr')
    //   .last()
    //   .within(() => {
    //     cy.contains('New mission tag')
    //   })
  })
})
