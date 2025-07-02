import { faker } from '@faker-js/faker'

context('Back Office > Station Form', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/stations`).as('getStations')

    cy.visit(`/backoffice/stations`)

    cy.wait('@getStations')
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

    cy.intercept('POST', `/api/v1/stations`).as('createStation')

    cy.clickButton('Nouvelle base')

    const newBaseName = faker.location.city()
    cy.fill('Nom', newBaseName)
    cy.getDataCy('coordinates-dd-input-lat').type('1.2')
    cy.getDataCy('coordinates-dd-input-lon').type('3.4').wait(500)

    cy.clickButton('Créer')

    cy.wait('@createStation').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.equal(request.body.latitude, 1.2)
      assert.equal(request.body.longitude, 3.4)
      assert.equal(request.body.name, newBaseName)
    })

    cy.getTableRowByText(newBaseName).should('exist')

    // -------------------------------------------------------------------------
    // Edit

    cy.intercept('PUT', `/api/v1/stations/*`).as('updateStation')

    cy.getTableRowByText(newBaseName).clickButton('Éditer cette base')

    const nextBaseName = faker.location.city()
    cy.fill('Nom', nextBaseName)
    cy.getDataCy('coordinates-dd-input-lat').clear().type('5.6')
    cy.getDataCy('coordinates-dd-input-lon').clear().type('7.8').wait(500)

    cy.clickButton('Mettre à jour')

    cy.wait('@updateStation').then(({ request: requestOfUpdate, response: responseOfUpdate }) => {
      if (!responseOfUpdate) {
        assert.fail('response is undefined.')
      }

      assert.deepInclude(requestOfUpdate.body, {
        latitude: 5.6,
        longitude: 7.8,
        name: nextBaseName
      })
    })

    cy.getTableRowByText(newBaseName).should('not.exist')
    cy.getTableRowByText(nextBaseName).should('exist')

    // -------------------------------------------------------------------------
    // Delete

    cy.intercept('DELETE', `/api/v1/stations/*`).as('deleteStation')

    cy.getTableRowByText(nextBaseName).clickButton('Supprimer cette base')
    cy.clickButton('Supprimer')

    cy.wait('@deleteStation')

    cy.getTableRowByText(nextBaseName).should('not.exist')
  })
})
