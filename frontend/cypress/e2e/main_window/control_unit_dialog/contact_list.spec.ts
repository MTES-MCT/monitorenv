import { customDayjs } from '@mtes-mct/monitor-ui'

import { goToMainWindowAndOpenControlUnit } from './utils'

import type { Mission } from 'domain/entities/missions'

context('Main Window > Control Unit Dialog > Contact List', () => {
  it('Should show all contacts by default', () => {
    goToMainWindowAndOpenControlUnit(10000)

    cy.contains('Contact 1').should('be.visible')
    cy.contains('Contact 2').should('be.visible')
  })

  it('Should validate the form', () => {
    goToMainWindowAndOpenControlUnit(10000)

    cy.clickButton('Ajouter un contact')

    cy.clickButton('Ajouter')

    cy.contains('Veuillez choisir un nom.').should('be.visible')
    cy.contains('Veuillez entrer un téléphone ou un email.').should('be.visible')

    cy.fill('Numéro de téléphone', '1111111111111')
    cy.clickButton('Ajouter')

    cy.contains(
      "Le numéro saisi n'est pas valide. Si c'est un numéro satellitaire ou d'outre-mer, ajouter 00 avant les premiers chiffres."
    )

    cy.clickButton('Annuler')

    cy.get('p').contains('Ajouter un contact').should('not.exist')
  })

  it('Should add, edit and delete a contact', () => {
    goToMainWindowAndOpenControlUnit(10023)

    // -------------------------------------------------------------------------
    // Create

    cy.intercept('POST', `/api/v2/control_unit_contacts`).as('createControlUnitContact')

    cy.clickButton('Ajouter un contact')

    cy.fill('Nom du contact', 'Adjoint')
    cy.fill('Numéro de téléphone', '0123456789')
    cy.clickButton('Ajouter ce numéro à la liste de diffusion des préavis et des bilans d’activités de contrôle')
    cy.fill('Adresse mail', 'foo@example.org')
    cy.clickButton('Ajouter cette adresse à la liste de diffusion des préavis et des bilans d’activités de contrôle')

    cy.clickButton('Ajouter')

    cy.wait('@createControlUnitContact').then(createInterception => {
      if (!createInterception.response) {
        assert.fail('`createInterception.response` is undefined.')
      }

      assert.deepInclude(createInterception.request.body, {
        email: 'foo@example.org',
        isEmailSubscriptionContact: true,
        isSmsSubscriptionContact: true,
        name: 'ADJUNCT',
        phone: '0123456789'
      })

      const newControlUnitContactId = createInterception.response.body.id

      cy.get('p').contains('Ajouter un contact').should('not.exist')
      cy.contains('Adjoint').should('be.visible')
      cy.contains('01 23 45 67 89').should('be.visible')
      cy.contains('foo@example.org').should('be.visible')

      // -------------------------------------------------------------------------
      // Update

      cy.intercept('PATCH', `/api/v1/control_unit_contacts/${newControlUnitContactId}`).as('patchControlUnitContact')

      cy.getDataCy('ControlUnitDialog-control-unit-contact')
        .filter(`[data-id="${newControlUnitContactId}"]`)
        .clickButton('Éditer ce contact')

      cy.fill('Nom du contact', 'Passerelle')
      cy.fill('Numéro de téléphone', '0198765432')
      cy.fill('Adresse mail', 'bar@example.org')

      cy.clickButton('Enregistrer les modifications')

      cy.wait('@patchControlUnitContact').then(interception => {
        if (!interception.response) {
          assert.fail('`interception.response` is undefined.')
        }

        assert.deepInclude(interception.request.body, {
          email: 'bar@example.org',
          id: newControlUnitContactId,
          isEmailSubscriptionContact: true,
          isSmsSubscriptionContact: true,
          name: 'BRIDGE',
          phone: '0198765432'
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

      // Warning banner
      cy.get('.Component-Banner')
        .should('be.visible')
        .contains(
          'Cette unité n’a actuellement plus d’adresse de diffusion. Elle ne recevra plus de préavis ni de bilan de ses activités de contrôle.'
        )

      cy.wait('@deleteControlUnitContact')

      cy.contains('Passerelle').should('not.exist')
    })
  })

  it('Should open the mission list of the unit within last 6 months period', () => {
    goToMainWindowAndOpenControlUnit(10018)
    cy.window().then(win => {
      cy.stub(win, 'open').as('open')
    })
    cy.clickButton("Voir les missions de l'unité")

    cy.visit(`/side_window`).wait(1000)

    const sixMonthsAgo = customDayjs().subtract(6, 'month').format('DD/MM/YYYY').split('/')
    const today = customDayjs().utc().format('DD/MM/YYYY').split('/')
    cy.contains('Unité DREAL Pays-de-La-Loire').should('be.visible')
    cy.get('[id="missionDateRangeStartDay"]').should('have.value', sixMonthsAgo[0])
    cy.get('[id="missionDateRangeStartMonth"]').should('have.value', sixMonthsAgo[1])
    cy.get('[id="missionDateRangeStartYear"]').should('have.value', sixMonthsAgo[2])

    cy.get('[id="missionDateRangeEndDay"]').should('have.value', today[0])
    cy.get('[id="missionDateRangeEndMonth"]').should('have.value', today[1])
    cy.get('[id="missionDateRangeEndYear"]').should('have.value', today[2])

    cy.contains('Unité DREAL Pays-de-La-Loire').should('be.visible')

    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should open the current mission of the unit', () => {
    goToMainWindowAndOpenControlUnit(10018)
    cy.window().then(win => {
      cy.stub(win, 'open').as('open')
    })

    cy.intercept('GET', `/bff/v1/missions/29`).as('getMission')
    cy.clickButton('Ouvrir la mission en cours')

    // We check only the mission being called from bff instead of asserting ui because sidewindow isnt in the dom
    cy.wait('@getMission').then(({ response }) => {
      if (!response) {
        assert.fail('response is undefined')
      }
      const mission: Mission = response.body
      assert.equal(response.statusCode, 200)
      assert.equal(
        mission.controlUnits.some(controlUnit => controlUnit.id === 10018),
        true
      )
    })
  })

  it('Should subscribe and unsubscribe contact to emails and sms', () => {
    goToMainWindowAndOpenControlUnit(10023)

    cy.intercept('POST', `/api/v2/control_unit_contacts`).as('createControlUnitContact')

    cy.clickButton('Ajouter un contact')
    cy.fill('Nom du contact', 'Adjoint')
    cy.fill('Numéro de téléphone', '0111111111')
    cy.fill('Adresse mail', 'first.contact@example.org')
    cy.clickButton('Ajouter')

    cy.wait('@createControlUnitContact').then(firstCreateInterception => {
      if (!firstCreateInterception.response) {
        assert.fail('`firstCreateInterception.response` is undefined.')
      }

      const firstControlUnitContactId = firstCreateInterception.response.body.id

      cy.clickButton('Ajouter un contact')
      cy.fill('Nom du contact', 'Adjoint')
      cy.fill('Numéro de téléphone', '0222222222')
      cy.fill('Adresse mail', 'second.contact@example.org')
      cy.clickButton('Ajouter')

      cy.wait('@createControlUnitContact').then(secondCreateInterception => {
        if (!secondCreateInterception.response) {
          assert.fail('`firstCreateInterception.response` is undefined.')
        }

        const secondControlUnitContactId = secondCreateInterception.response.body.id

        cy.intercept('PATCH', `/api/v1/control_unit_contacts/${firstControlUnitContactId}`).as(
          'patchFirstControlUnitContact'
        )
        cy.intercept('PATCH', `/api/v1/control_unit_contacts/${secondControlUnitContactId}`).as(
          'patchSecondControlUnitContact'
        )

        // Edit first contact
        cy.getDataCy('ControlUnitDialog-control-unit-contact')
          .filter(`[data-id="${firstControlUnitContactId}"]`)
          .clickButton('Éditer ce contact')

        // -------------------------------------------------------------------------
        // Subscribe phone (first contact)

        cy.clickButton('Ajouter ce numéro à la liste de diffusion des préavis et des bilans d’activités de contrôle')

        // -------------------------------------------------------------------------
        // Subscribe email (first contact)

        cy.clickButton(
          'Ajouter cette adresse à la liste de diffusion des préavis et des bilans d’activités de contrôle'
        )

        // Info message
        cy.getDataCy('ControlUnitDialog-control-unit-contact-form')
          .find('.Component-Message>')
          .should('be.visible')
          .contains('Adresse de diffusion')

        // Update first contact
        cy.clickButton('Enregistrer les modifications')

        cy.wait('@patchFirstControlUnitContact').then(patchInterception => {
          if (!patchInterception.response) {
            assert.fail('`interception.response` is undefined.')
          }

          assert.deepInclude(patchInterception.request.body, {
            email: 'first.contact@example.org',
            id: firstControlUnitContactId,
            isEmailSubscriptionContact: true,
            isSmsSubscriptionContact: true,
            phone: '0111111111'
          })
        })

        // Edit second contact
        cy.getDataCy('ControlUnitDialog-control-unit-contact')
          .filter(`[data-id="${secondControlUnitContactId}"]`)
          .clickButton('Éditer ce contact')

        // -------------------------------------------------------------------------
        // Subscribe phone (second contact)

        cy.clickButton('Ajouter ce numéro à la liste de diffusion des préavis et des bilans d’activités de contrôle')

        // -------------------------------------------------------------------------
        // Subscribe another contact to email (second contact)

        cy.clickButton(
          'Ajouter cette adresse à la liste de diffusion des préavis et des bilans d’activités de contrôle'
        )

        // Warning confirmation message
        cy.getDataCy('ControlUnitDialog-control-unit-contact-form')
          .find('.Component-Message>')
          .should('be.visible')
          .contains('Attention')
          .parent()
          .contains('first.contact@example.org')
          .parent()
          .contains('second.contact@example.org')

        cy.clickButton('Oui, la remplacer')

        // Info message
        cy.getDataCy('ControlUnitDialog-control-unit-contact-form')
          .find('.Component-Message>')
          .should('be.visible')
          .contains('Adresse de diffusion')

        // Update second contact
        cy.clickButton('Enregistrer les modifications')

        cy.wait('@patchSecondControlUnitContact').then(patchInterception => {
          if (!patchInterception.response) {
            assert.fail('`interception.response` is undefined.')
          }

          assert.deepInclude(patchInterception.request.body, {
            email: 'second.contact@example.org',
            id: secondControlUnitContactId,
            isEmailSubscriptionContact: true,
            isSmsSubscriptionContact: true,
            phone: '0222222222'
          })
        })

        // Edit second contact
        cy.getDataCy('ControlUnitDialog-control-unit-contact')
          .filter(`[data-id="${secondControlUnitContactId}"]`)
          .clickButton('Éditer ce contact')

        // -------------------------------------------------------------------------
        // Unsubscribe phone (second contact)

        cy.clickButton('Retirer ce numéro de la liste de diffusion des préavis et des bilans d’activités de contrôle')

        // -------------------------------------------------------------------------
        // Unsubscribe email (second contact)

        cy.clickButton(
          'Retirer cette adresse de la liste de diffusion des préavis et des bilans d’activités de contrôle'
        )

        // Update second contact
        cy.clickButton('Enregistrer les modifications')

        // Warning banner
        cy.get('.Component-Banner')
          .should('be.visible')
          .contains(
            'Cette unité n’a actuellement plus d’adresse de diffusion. Elle ne recevra plus de préavis ni de bilan de ses activités de contrôle.'
          )

        cy.wait('@patchSecondControlUnitContact').then(interception => {
          if (!interception.response) {
            assert.fail('`interception.response` is undefined.')
          }

          assert.deepInclude(interception.request.body, {
            email: 'second.contact@example.org',
            id: secondControlUnitContactId,
            isEmailSubscriptionContact: false,
            isSmsSubscriptionContact: false,
            phone: '0222222222'
          })
        })

        // -------------------------------------------------------------------------
        // Delete (reset)

        cy.intercept('DELETE', `/api/v1/control_unit_contacts/${firstControlUnitContactId}`).as(
          'deleteFirstControlUnitContact'
        )

        cy.getDataCy('ControlUnitDialog-control-unit-contact')
          .filter(`[data-id="${firstControlUnitContactId}"]`)
          .clickButton('Éditer ce contact')
        cy.clickButton('Supprimer ce contact')
        cy.clickButton('Supprimer')

        cy.wait('@deleteFirstControlUnitContact')

        cy.intercept('DELETE', `/api/v1/control_unit_contacts/${secondControlUnitContactId}`).as(
          'deleteSecondControlUnitContact'
        )

        cy.getDataCy('ControlUnitDialog-control-unit-contact')
          .filter(`[data-id="${secondControlUnitContactId}"]`)
          .clickButton('Éditer ce contact')
        cy.clickButton('Supprimer ce contact')
        cy.clickButton('Supprimer')

        cy.wait('@deleteSecondControlUnitContact')
      })
    })
  })
})
