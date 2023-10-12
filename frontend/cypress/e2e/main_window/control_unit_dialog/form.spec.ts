import { gotToMainWindowAndOpenControlUnit } from './utils'

context('Main Window > Control Unit Dialog > Resource List', () => {
  beforeEach(() => {
    gotToMainWindowAndOpenControlUnit(10000)
  })

  it('Should edit a control unit', () => {
    cy.intercept('PUT', `/api/v2/control_units/10000`).as('updateControlUnit')

    // -------------------------------------------------------------------------
    // Terms note

    cy.getDataCy('ControlUnitDialog-termsNote').forceClick()

    cy.fill('Modalités de contact avec l’unité', 'Des modalités de contact avec l’unité.')

    cy.clickButton('Valider')

    cy.wait('@updateControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        id: 10000,
        termsNote: 'Des modalités de contact avec l’unité.'
      })
    })

    cy.contains('Des modalités de contact avec l’unité.').should('be.visible')
    cy.get('.Element-Button').contains('Valider').should('not.exist')

    // -------------------------------------------------------------------------
    // Area note

    cy.getDataCy('ControlUnitDialog-areaNote').forceClick()

    cy.fill('Secteur d’intervention', 'Un secteur d’intervention.')

    cy.clickButton('Valider')

    cy.wait('@updateControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        areaNote: 'Un secteur d’intervention.',
        id: 10000
      })
    })

    cy.contains('Un secteur d’intervention.').should('be.visible')
    cy.get('.Element-Button').contains('Valider').should('not.exist')
  })
})
