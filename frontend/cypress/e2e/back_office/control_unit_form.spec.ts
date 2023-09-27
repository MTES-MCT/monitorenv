import { expectPathToBe } from '../utils'

context('Back Office > Control Unit Form', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')

    cy.visit(`/backoffice/control_units`)

    cy.wait('@getControlUnits')
  })

  it('Should create, edit, archive and delete a control unit', () => {
    // -------------------------------------------------------------------------
    // Create

    cy.intercept('POST', `/api/v2/control_units`).as('createControlUnit')

    cy.clickButton('Nouvelle unité de contrôle')

    expectPathToBe('/backoffice/control_units/new')

    cy.fill('Administration', 'AECP')
    cy.fill('Nom', 'Unité 1')

    cy.clickButton('Créer')

    cy.wait('@createControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        administrationId: 1007,
        areaNote: null,
        isArchived: false,
        name: 'Unité 1',
        termsNote: null
      })
    })

    // -------------------------------------------------------------------------
    // Edit

    cy.intercept('PUT', `/api/v2/control_units/34`).as('updateControlUnit')

    cy.getTableRowById(34).clickButton('Éditer cette unité de contrôle')

    expectPathToBe('/backoffice/control_units/34')

    cy.fill('Administration', 'AFB')
    cy.fill('Nom', 'Unité 2')

    cy.clickButton('Mettre à jour')

    cy.wait('@updateControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        administrationId: 1002,
        areaNote: null,
        id: 34,
        isArchived: false,
        name: 'Unité 2',
        termsNote: null
      })
    })

    // -------------------------------------------------------------------------
    // Archive

    cy.intercept('POST', `/api/v2/control_units/34/archive`).as('archiveControlUnit')

    cy.getTableRowById(34).clickButton('Archiver cette unité de contrôle')
    cy.clickButton('Confirmer')

    cy.wait('@archiveControlUnit')

    cy.getTableRowById(34).should('not.exist')
    cy.clickButton('Unités archivées')
    cy.getTableRowById(34).should('exist')

    // -------------------------------------------------------------------------
    // Delete

    cy.intercept('DELETE', `/api/v2/control_units/34`).as('deleteControlUnit')

    cy.getTableRowById(34).clickButton('Supprimer cette unité de contrôle')
    cy.clickButton('Confirmer')

    cy.wait('@deleteControlUnit')

    cy.getTableRowById(34).should('not.exist')
    cy.clickButton('Unités actives')
    cy.getTableRowById(34).should('not.exist')
  })
})
