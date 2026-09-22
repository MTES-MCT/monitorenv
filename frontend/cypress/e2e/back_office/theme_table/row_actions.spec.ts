context('Back Office > Theme Table > Row actions', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/themes*`).as('getThemes')
    cy.visit(`/backoffice/themes`)
    cy.wait('@getThemes')
  })

  it('Should open the theme form dialog when clicking on Edit', () => {
    cy.intercept('PUT', `/api/v1/themes`).as('saveTheme')
    cy.contains('Out of validity').closest('tr').as('row')
    cy.get('@row').within(() => cy.get('button[title="Éditer cette thématique"]').click({ force: true }))
    cy.fill('Nom', 'Updated out of validity')
    cy.fill('Début de validité', [2023, 1, 1, 0, 0])
    cy.fill('Fin de validité', [2099, 12, 31, 0, 0])
    cy.clickButton('Ajouter une sous-thématique')
    cy.fill('Sous-thématique 0', 'Subtag 1')
    cy.fill('Début de validité de la sous-thématique 0', [2023, 1, 1, 0, 0])
    cy.fill('Fin de validité de la sous-thématique 0', [2099, 12, 31, 0, 0])
    cy.clickButton('Valider les modifications')
    cy.wait('@saveTheme').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.deepEqual(request.body, {
        endedAt: '2099-12-31T23:59:59.000Z',
        id: 370,
        name: 'Updated out of validity',
        startedAt: '2023-01-01T00:00:00.000Z',
        subThemes: [
          {
            endedAt: '2099-12-31T23:59:59.000Z',
            id: null,
            name: 'Subtag 1',
            startedAt: '2023-01-01T00:00:00.000Z'
          }
        ]
      })
    })

    cy.wait(250)
    // Reset data
    cy.contains('Updated out of validity').closest('tr').as('row')

    cy.get('@row').within(() => cy.get('button[title="Éditer cette thématique"]').click({ force: true }))
    cy.fill('Nom', 'Out of validity')
    cy.fill('Début de validité', [2023, 1, 1])
    cy.fill('Fin de validité', [2024, 31, 12])
    cy.clickButton('Supprimer cette sous-thématique')
    cy.clickButton('Valider les modifications')
  })
})
