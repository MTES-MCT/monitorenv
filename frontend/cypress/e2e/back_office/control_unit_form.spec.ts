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
    cy.fill('Département', 'Manche')

    cy.clickButton('Créer')

    cy.wait('@createControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        administrationId: 1007,
        areaNote: null,
        departmentAreaInseeCode: '50',
        isArchived: false,
        name: 'Unité 1',
        termsNote: null
      })
    })

    // -------------------------------------------------------------------------
    // Edit

    cy.intercept('PUT', `/api/v2/control_units/10122`).as('updateControlUnit')

    cy.getTableRowById(10122).clickButton('Éditer cette unité de contrôle')

    expectPathToBe('/backoffice/control_units/10122')

    cy.fill('Administration', 'AFB')
    cy.fill('Nom', 'Unité 2')
    cy.fill('Département', 'Vendée')

    cy.clickButton('Mettre à jour')

    cy.wait('@updateControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        administrationId: 1002,
        areaNote: null,
        departmentAreaInseeCode: '85',
        id: 10122,
        isArchived: false,
        name: 'Unité 2',
        termsNote: null
      })
    })

    // -------------------------------------------------------------------------
    // Archive

    cy.intercept('POST', `/api/v2/control_units/10122/archive`).as('archiveControlUnit')

    cy.getTableRowById(10122).clickButton('Archiver cette unité de contrôle')
    cy.clickButton('Archiver')

    cy.wait('@archiveControlUnit')

    cy.getTableRowById(10122).should('not.exist')
    cy.clickButton('Unités archivées')
    cy.getTableRowById(10122).should('exist')

    // -------------------------------------------------------------------------
    // Delete

    cy.intercept('DELETE', `/api/v2/control_units/10122`).as('deleteControlUnit')

    cy.getTableRowById(10122).clickButton('Supprimer cette unité de contrôle')
    cy.clickButton('Supprimer')

    cy.wait('@deleteControlUnit')

    cy.getTableRowById(10122).should('not.exist')
    cy.clickButton('Unités actives')
    cy.getTableRowById(10122).should('not.exist')
  })
})
