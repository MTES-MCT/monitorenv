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
    cy.fill('Façade', 'NAMO')
    cy.fill('Département', '50')

    cy.clickButton('Créer')

    cy.wait('@createControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        administrationId: 1007,
        areaNote: null,
        department: '50',
        isArchived: false,
        name: 'Unité 1',
        seaFront: 'NAMO',
        termsNote: null
      })
    })

    // -------------------------------------------------------------------------
    // Edit

    cy.intercept('PUT', `/api/v2/control_units/10033`).as('updateControlUnit')

    cy.getTableRowById(10033).clickButton('Éditer cette unité de contrôle')

    expectPathToBe('/backoffice/control_units/10033')

    cy.fill('Administration', 'AFB')
    cy.fill('Nom', 'Unité 2')
    cy.fill('Façade', 'SA')
    cy.fill('Département', '40')

    cy.clickButton('Mettre à jour')

    cy.wait('@updateControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        administrationId: 1002,
        areaNote: null,
        id: 10033,
        isArchived: false,
        name: 'Unité 2',
        seaFront: 'SA',
        termsNote: null
      })
    })

    // -------------------------------------------------------------------------
    // Archive

    cy.intercept('POST', `/api/v2/control_units/10033/archive`).as('archiveControlUnit')

    cy.getTableRowById(10033).clickButton('Archiver cette unité de contrôle')
    cy.clickButton('Confirmer')

    cy.wait('@archiveControlUnit')

    cy.getTableRowById(10033).should('not.exist')
    cy.clickButton('Unités archivées')
    cy.getTableRowById(10033).should('exist')

    // -------------------------------------------------------------------------
    // Delete

    cy.intercept('DELETE', `/api/v2/control_units/10033`).as('deleteControlUnit')

    cy.getTableRowById(10033).clickButton('Supprimer cette unité de contrôle')
    cy.clickButton('Confirmer')

    cy.wait('@deleteControlUnit')

    cy.getTableRowById(10033).should('not.exist')
    cy.clickButton('Unités actives')
    cy.getTableRowById(10033).should('not.exist')
  })
})
