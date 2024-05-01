import { goToMainWindowAndOpenControlUnit } from './utils'

context('Main Window > Control Unit Dialog > Contact List', () => {
  beforeEach(() => {
    goToMainWindowAndOpenControlUnit(10000)
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

    cy.wait('@createControlUnitContact').then(createInterception => {
      if (!createInterception.response) {
        assert.fail('`createInterception.response` is undefined.')
      }

      assert.deepInclude(createInterception.request.body, {
        email: 'foo@example.org',
        isEmailSubscriptionContact: false,
        isSmsSubscriptionContact: false,
        name: 'ADJUNCT',
        phone: '0123456789'
      })

      const newControlUnitContactId = createInterception.response.body.id

      cy.get('p').contains('Ajouter un contact').should('not.exist')
      cy.contains('Adjoint').should('be.visible')

      // -------------------------------------------------------------------------
      // Edit

      cy.intercept('PUT', `/api/v1/control_unit_contacts/${newControlUnitContactId}`).as('updateControlUnitContact')

      cy.getDataCy('ControlUnitDialog-control-unit-contact')
        .filter(`[data-id="${newControlUnitContactId}"]`)
        .clickButton('Éditer ce contact')

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
          id: newControlUnitContactId,
          isEmailSubscriptionContact: false,
          isSmsSubscriptionContact: false,
          name: 'BRIDGE',
          phone: '9876543210'
        })
      })

      cy.get('p').contains('Éditer un contact').should('not.exist')
      cy.contains('Enregistrer les modifications').should('not.exist')
      cy.contains('Passerelle').should('be.visible')

      // -------------------------------------------------------------------------
      // Delete

      cy.intercept('DELETE', `/api/v1/control_unit_contacts/${newControlUnitContactId}`).as('deleteControlUnitContact')

      cy.getDataCy('ControlUnitDialog-control-unit-contact')
        .filter(`[data-id="${newControlUnitContactId}"]`)
        .clickButton('Éditer ce contact')
      cy.clickButton('Supprimer ce contact')
      cy.clickButton('Supprimer')

      cy.wait('@deleteControlUnitContact')

      cy.contains('Passerelle').should('not.exist')
    })
  })

  it('Should subscribe and unsubscribe contact to emails and sms', () => {
    cy.intercept('POST', `/api/v1/control_unit_contacts`).as('createControlUnitContact')

    cy.clickButton('Ajouter un contact')
    cy.fill('Nom du contact', 'Adjoint')
    cy.fill('Numéro de téléphone', '0987654321')
    cy.fill('Adresse mail', 'baz@example.org')
    cy.clickButton('Ajouter')

    cy.wait('@createControlUnitContact').then(createInterception => {
      if (!createInterception.response) {
        assert.fail('`createInterception.response` is undefined.')
      }

      const newControlUnitContactId = createInterception.response.body.id
      cy.intercept('PUT', `/api/v1/control_unit_contacts/${newControlUnitContactId}`).as('updateControlUnitContact')
      cy.getDataCy('ControlUnitDialog-control-unit-contact')
        .filter(`[data-id="${newControlUnitContactId}"]`)
        .clickButton('Éditer ce contact')

      // -------------------------------------------------------------------------
      // Subscribe email

      cy.clickButton('Ajouter cette adresse à la liste de diffusion des préavis et des bilans d’activités de contrôle')

      // Warning confirmation message
      cy.getDataCy('ControlUnitDialog-control-unit-contact-form')
        .find('.Component-Message>')
        .should('be.visible')
        .contains('Attention')
        .parent()
        .contains('email_1')
        .parent()
        .contains('baz@example.org')

      cy.clickButton('Oui, la remplacer')

      // Info message
      cy.getDataCy('ControlUnitDialog-control-unit-contact-form')
        .find('.Component-Message>')
        .should('be.visible')
        .contains('Adresse de diffusion')

      // -------------------------------------------------------------------------
      // Subscribe phone

      cy.clickButton('Ajouter ce numéro à la liste de diffusion des préavis et des bilans d’activités de contrôle')

      cy.clickButton('Enregistrer les modifications')

      cy.wait('@updateControlUnitContact').then(updateInterception => {
        if (!updateInterception.response) {
          assert.fail('`interception.response` is undefined.')
        }

        assert.deepInclude(updateInterception.request.body, {
          email: 'baz@example.org',
          isEmailSubscriptionContact: true,
          isSmsSubscriptionContact: true,
          phone: '0987654321'
        })
      })

      cy.getDataCy('ControlUnitDialog-control-unit-contact')
        .filter(`[data-id="${newControlUnitContactId}"]`)
        .clickButton('Éditer ce contact')

      // -------------------------------------------------------------------------
      // Unsubscribe email

      cy.clickButton('Retirer cette adresse de la liste de diffusion des préavis et des bilans d’activités de contrôle')

      // Warning banner
      cy.get('.Component-Banner')
        .should('be.visible')
        .contains(
          'Cette unité n’a actuellement plus d’adresse de diffusion. Elle ne recevra plus de préavis ni de bilan de ses activités de contrôle.'
        )

      // -------------------------------------------------------------------------
      // Unsubscribe phone

      cy.clickButton('Retirer ce numéro de la liste de diffusion des préavis et des bilans d’activités de contrôle')

      cy.clickButton('Enregistrer les modifications')

      cy.wait('@updateControlUnitContact').then(interception => {
        if (!interception.response) {
          assert.fail('`interception.response` is undefined.')
        }

        assert.deepInclude(interception.request.body, {
          email: 'baz@example.org',
          isEmailSubscriptionContact: false,
          isSmsSubscriptionContact: false,
          phone: '0987654321'
        })
      })

      // -------------------------------------------------------------------------
      // Delete

      cy.intercept('DELETE', `/api/v1/control_unit_contacts/${newControlUnitContactId}`).as('deleteControlUnitContact')

      cy.getDataCy('ControlUnitDialog-control-unit-contact')
        .filter(`[data-id="${newControlUnitContactId}"]`)
        .clickButton('Éditer ce contact')
      cy.clickButton('Supprimer ce contact')
      cy.clickButton('Supprimer')

      cy.wait('@deleteControlUnitContact')
    })
  })
})
