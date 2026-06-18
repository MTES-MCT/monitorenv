context('Back Office > Tag Table > Row actions', () => {
  beforeEach(() => {
    cy.intercept('GET', `/bff/v1/tags*`).as('getTags')
    cy.visit(`/backoffice/tags`)
    cy.wait('@getTags')
  })

  it('Should edit the tag when clicking on Edit', () => {
    cy.intercept('PUT', `/bff/v1/tags`).as('saveTag')
    cy.contains('AMP').closest('tr').as('row')
    cy.get('@row').within(() => cy.get('button[title="Éditer ce tag"]').click({ force: true }))
    cy.get('input[name="name"]').clear()
    cy.get('input[name="name"]').type('New AMP')
    // Started At
    cy.get('input[id="startedAtDay"]').type('01', { force: true })
    cy.get('input[id="startedAtMonth"]').type('01', { force: true })
    cy.get('input[id="startedAtYear"]').type('2024', { force: true })
    // Ended At
    cy.get('input[id="endedAtDay"]').type('31', { force: true })
    cy.get('input[id="endedAtMonth"]').type('12', { force: true })
    cy.get('input[id="endedAtYear"]').type('2099', { force: true })
    cy.get('button[title="Sauvegarder ce tag"]').click()

    cy.wait('@saveTag').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.deepEqual(request.body, {
        endedAt: '2099-12-31T23:59:59.000Z',
        id: 2,
        name: 'New AMP',
        parentId: null,
        startedAt: '2024-01-01T00:00:00.000Z'
      })
    })

    cy.wait(250)
    // Reset data
    cy.contains('New AMP').closest('tr').as('row')

    cy.get('@row').within(() => cy.get('button[title="Éditer ce tag"]').click({ force: true }))

    cy.get('input[name="name"]').clear()
    cy.get('input[name="name"]').type('AMP')
    // Started At
    cy.get('input[id="startedAtDay"]').type('01', { force: true })
    cy.get('input[id="startedAtMonth"]').type('01', { force: true })
    cy.get('input[id="startedAtYear"]').type('2023', { force: true })
    // Ended At
    cy.get('input[id="endedAtDay"]').type('31', { force: true })
    cy.get('input[id="endedAtMonth"]').type('12', { force: true })
    cy.get('input[id="endedAtYear"]').type('2030', { force: true })
    cy.get('button[title="Sauvegarder ce tag"]').click({ force: true })
  })

  it('Should add subtag when clicking on Edit on parent tag', () => {
    cy.wait(200)
    cy.get('tbody > tr')
      .contains('AMP')
      .closest('tr')
      .click()
      .within(() => {
        cy.get('button[title="Éditer ce tag"]').click({ force: true })
        cy.get('button[title="Ajouter un sous-tag"]').click({ force: true })
      })
    cy.get('tbody > tr')
      .eq(2)
      .within(() => {
        cy.get('input[name="name"]').type('New subTag')
        // Started At
        cy.get('input[id="startedAtDay"]').type('01', { force: true })
        cy.get('input[id="startedAtMonth"]').type('01', { force: true })
        cy.get('input[id="startedAtYear"]').type('2024', { force: true })
        // Ended At
        cy.get('input[id="endedAtDay"]').type('31', { force: true })
        cy.get('input[id="endedAtMonth"]').type('12', { force: true })
        cy.get('input[id="endedAtYear"]').type('2099', { force: true })

        // Disabling saving because we cant rollback
        // cy.get('button[title="Sauvegarder ce tag"]').click()
      })

    // cy.wait('@saveTag').then(({ request, response }) => {
    //   if (!response) {
    //     assert.fail('response is undefined.')
    //   }
    //   assert.deepEqual(request.body, {
    //     endedAt: '2099-12-31T23:59:59.000Z',
    //     id: null,
    //     name: 'New subTag',
    //     parentId: 2,
    //     startedAt: '2024-01-01T00:00:00.000Z'
    //   })
    // })
    //
    // cy.clickButton('Sauvegarder ce tag')
    //
    // cy.get('tbody > tr')
    //   .contains('New subTag')
    //   .closest('tr')
    //   .within(() => {
    //     cy.contains('New subTag')
    //     cy.contains('01/01/2024')
    //     cy.contains('31/12/2099')
    //   })
  })

  it('Should not be possible to save if the tag is invalid', () => {
    cy.get('tbody > tr')
      .first()
      .within(() => {
        cy.get('button[title="Éditer ce tag"]').click({ force: true })
      })
    cy.fill('Nom du tag', '')
    cy.get('button[title="Sauvegarder ce tag"]').should('be.disabled')
    cy.fill('Nom du tag', 'AAAAA')
    cy.get('button[title="Sauvegarder ce tag"]').should('not.be.disabled')
    cy.fill('Date de début du tag', undefined)
    cy.get('button[title="Sauvegarder ce tag"]').should('be.disabled')
    cy.fill('Date de début du tag', [2023, 1, 1, 0, 0])
    cy.get('button[title="Sauvegarder ce tag"]').should('not.be.disabled')
    cy.fill('Date de fin du tag', [2022, 12, 31, 0, 0])
    cy.get('button[title="Sauvegarder ce tag"]').should('be.disabled')
    cy.fill('Date de fin du tag', [2023, 12, 31, 0, 0])
    cy.get('button[title="Sauvegarder ce tag"]').should('not.be.disabled')
  })

  it('Should add a new tag', () => {
    cy.clickButton('Ajouter un nouveau tag')
    cy.get('tbody > tr')
      .last()
      .scrollIntoView()
      .within(() => {
        cy.get('input[name="name"]').type('ZZZ New tag')
        // Started At
        cy.get('input[id="startedAtDay"]').type('01', { force: true })
        cy.get('input[id="startedAtMonth"]').type('01', { force: true })
        cy.get('input[id="startedAtYear"]').type('2024', { force: true })
        // Ended At
        cy.get('input[id="endedAtDay"]').type('31', { force: true })
        cy.get('input[id="endedAtMonth"]').type('12', { force: true })
        cy.get('input[id="endedAtYear"]').type('2099', { force: true })
        // Disabling saving because we cant rollback
        // cy.get('button[title="Sauvegarder ce tag"]').click()
      })

    // Disabling saving because we cant delete a tag (rollback)
    // cy.wait('@saveTag').then(({ request, response }) => {
    //   if (!response) {
    //     assert.fail('response is undefined.')
    //   }
    //   assert.deepEqual(request.body, {
    //     endedAt: '2099-12-31T23:59:59.000Z',
    //     id: null,
    //     name: 'ZZZ New tag',
    //     parentId: null,
    //     startedAt: '2024-01-01T00:00:00.000Z'
    //   })
    // })
    //
    // cy.get('tbody > tr')
    //   .last()
    //   .within(() => {
    //     cy.contains('Z New tag')
    //     cy.contains('01/01/2024')
    //     cy.contains('31/12/2099')
    //   })
  })
})
