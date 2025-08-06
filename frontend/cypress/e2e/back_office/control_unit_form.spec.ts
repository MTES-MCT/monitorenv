import { expectPathToBe } from '../utils/expectPathToBe'

context('Back Office > Control Unit Form', () => {
  beforeEach(() => {
    cy.login('superuser')
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')
    cy.visit(`/backoffice/control_units`)
    cy.wait('@getControlUnits')
  })

  it('Should validate the form', () => {
    cy.clickButton('Nouvelle unité de contrôle')

    cy.clickButton('Créer')

    cy.contains('L’administration est obligatoire.').should('be.visible')
    cy.contains('Le nom est obligatoire.').should('be.visible')

    cy.clickButton('Annuler')

    cy.get('h1').contains('Gestion des unités de contrôle').should('be.visible')
  })

  it('Should create, edit, archive and delete a control unit', () => {
    // -------------------------------------------------------------------------
    // Create

    cy.intercept('POST', `/api/v2/control_units`).as('createControlUnit')

    cy.clickButton('Nouvelle unité de contrôle')

    expectPathToBe('/backoffice/control_units/new')

    cy.fill('Administration', 'AECP')
    cy.fill('Nom', 'Unité 1')
    cy.fill('Département', 'Manche')

    cy.clickButton('Créer')

    cy.wait('@createControlUnit').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      const id = response.body.id

      assert.deepEqual(request.body, {
        administrationId: 1007,
        areaNote: null,
        departmentAreaInseeCode: '50',
        isArchived: false,
        name: 'Unité 1',
        termsNote: null
      })

      // -------------------------------------------------------------------------
      // Edit

      cy.intercept('PUT', `/api/v2/control_units/${id}`).as('updateControlUnit')

      cy.getTableRowById(id).clickButton('Éditer cette unité de contrôle')

      expectPathToBe(`/backoffice/control_units/${id}`)

      cy.fill('Administration', 'AFB')
      cy.fill('Nom', 'Unité 2')
      cy.fill('Département', 'Vendée')

      cy.clickButton('Mettre à jour')

      cy.wait('@updateControlUnit').then(({ request: requestOfUpdate, response: responseOfUpdate }) => {
        if (!responseOfUpdate) {
          assert.fail('response is undefined.')
        }

        assert.deepInclude(requestOfUpdate.body, {
          administrationId: 1002,
          areaNote: null,
          departmentAreaInseeCode: '85',
          id,
          isArchived: false,
          name: 'Unité 2',
          termsNote: null
        })
      })

      // -------------------------------------------------------------------------
      // Archive

      cy.intercept('PUT', `/api/v2/control_units/${id}/archive`).as('archiveControlUnit')

      cy.getTableRowById(id).clickButton('Archiver cette unité de contrôle')
      cy.clickButton('Archiver')

      cy.wait('@archiveControlUnit')

      cy.getTableRowById(id).should('not.exist')
      cy.clickButton('Unités archivées')
      cy.getTableRowById(id).should('exist')

      // -------------------------------------------------------------------------
      // Delete

      cy.intercept('DELETE', `/api/v2/control_units/${id}`).as('deleteControlUnit')

      cy.getTableRowById(id).clickButton('Supprimer cette unité de contrôle')
      cy.clickButton('Supprimer')

      cy.wait('@deleteControlUnit')

      cy.getTableRowById(id).should('not.exist')
      cy.clickButton('Unités actives')
      cy.getTableRowById(id).should('not.exist')
    })
  })
})
