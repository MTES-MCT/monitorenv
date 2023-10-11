import { gotToMainWindowAndOpenControlUnit } from './utils'

context('Main Window > Control Unit Dialog > Contact List', () => {
  beforeEach(() => {
    gotToMainWindowAndOpenControlUnit(10000)
  })

  it('Should show all contacts by default', () => {
    cy.contains('Contact 1').should('be.visible')
    cy.contains('Contact 2').should('be.visible')
  })

  it('Should validate the form', () => {
    cy.clickButton('Ajouter un contact')

    cy.clickButton('Ajouter')

    cy.contains('Veuillez choisir un nom.').should('be.visible')
    cy.contains('Veuillez entrer un téléphone ou un email.').should('be.visible')

    cy.clickButton('Annuler')

    cy.get('p').contains('Ajouter un contact').should('not.exist')
  })

  it('Should add, edit and delete a contact', () => {
    // -------------------------------------------------------------------------
    // Create

    cy.intercept('POST', `/api/v1/control_unit_contacts`).as('createControlUnitContact')

    cy.clickButton('Ajouter un contact')

    cy.fill('Nom du contact', 'Adjoint')
    cy.fill('Numéro de téléphone', '0123456789')
    cy.fill('Adresse mail', 'foo@example.org')

    cy.clickButton('Ajouter')

    cy.wait('@createControlUnitContact').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        email: 'foo@example.org',
        name: 'ADJUNCT',
        phone: '0123456789'
      })
    })

    cy.get('p').contains('Ajouter un contact').should('not.exist')
    cy.contains('Adjoint').should('be.visible')

    // -------------------------------------------------------------------------
    // Edit

    cy.intercept('PUT', `/api/v1/control_unit_contacts/4`).as('updateControlUnitContact')

    cy.getDataCy('ControlUnitDialog-control-unit-contact').filter('[data-id="4"]').clickButton('Éditer ce contact')

    cy.fill('Nom du contact', 'Passerelle')
    cy.fill('Numéro de téléphone', '9876543210')
    cy.fill('Adresse mail', 'bar@example.org')

    cy.clickButton('Enregistrer les modifications')

    cy.wait('@updateControlUnitContact').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        email: 'bar@example.org',
        id: 4,
        name: 'BRIDGE',
        phone: '9876543210'
      })
    })

    cy.get('p').contains('Éditer un contact').should('not.exist')
    cy.contains('Enregistrer les modifications').should('not.exist')
    cy.contains('Passerelle').should('be.visible')

    // -------------------------------------------------------------------------
    // Delete

    cy.intercept('DELETE', `/api/v1/control_unit_contacts/4`).as('deleteControlUnitContact')

    cy.getDataCy('ControlUnitDialog-control-unit-contact').filter('[data-id="4"]').clickButton('Éditer ce contact')
    cy.clickButton('Supprimer ce contact')
    cy.clickButton('Supprimer')

    cy.wait('@deleteControlUnitContact')

    cy.contains('Passerelle').should('not.exist')
  })
})
