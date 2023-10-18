import { faker } from '@faker-js/faker'

context('Back Office > Base Form', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/bases`).as('getBases')

    cy.visit(`/backoffice/bases`)

    cy.wait('@getBases')
  })

  it('Should validate the form', () => {
    cy.clickButton('Nouvelle base')

    cy.clickButton('Créer')

    cy.contains('Le nom est obligatoire.').should('be.visible')
    cy.contains('Les coordonnées sont obligatoires.').should('be.visible')

    cy.clickButton('Annuler')

    cy.get('h1').contains('Gestion des bases').should('be.visible')
  })

  it('Should create, edit and delete a base', () => {
    // -------------------------------------------------------------------------
    // Create

    cy.intercept('POST', `/api/v1/bases`).as('createBase')

    cy.clickButton('Nouvelle base')

    const newBaseName = faker.location.city()
    cy.fill('Nom', newBaseName)
    cy.getDataCy('coordinates-dd-input-lat').type('1.2')
    cy.getDataCy('coordinates-dd-input-lon').type('3.4').wait(500)

    cy.clickButton('Créer')

    cy.wait('@createBase').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        latitude: 1.2,
        longitude: 3.4,
        name: newBaseName
      })
    })

    cy.getTableRowByText(newBaseName).should('exist')

    // -------------------------------------------------------------------------
    // Edit

    cy.intercept('PUT', `/api/v1/bases/*`).as('updateBase')

    cy.getTableRowByText(newBaseName).clickButton('Éditer cette base')

    const nextBaseName = faker.location.city()
    cy.fill('Nom', nextBaseName)
    cy.getDataCy('coordinates-dd-input-lat').clear().type('5.6')
    cy.getDataCy('coordinates-dd-input-lon').clear().type('7.8').wait(500)

    cy.clickButton('Mettre à jour')

    cy.wait('@updateBase').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        latitude: 5.6,
        longitude: 7.8,
        name: nextBaseName
      })
    })

    cy.getTableRowByText(newBaseName).should('not.exist')
    cy.getTableRowByText(nextBaseName).should('exist')

    // -------------------------------------------------------------------------
    // Delete

    cy.intercept('DELETE', `/api/v1/bases/*`).as('deleteBase')

    cy.getTableRowByText(nextBaseName).clickButton('Supprimer cette base')
    cy.clickButton('Supprimer')

    cy.wait('@deleteBase')

    cy.getTableRowByText(nextBaseName).should('not.exist')
  })
})
