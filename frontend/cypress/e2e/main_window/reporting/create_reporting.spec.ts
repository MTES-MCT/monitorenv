import { FAKE_API_PUT_RESPONSE, FAKE_MAPBOX_RESPONSE } from '../../constants'

context('Reporting', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.viewport(1580, 1024)
    cy.visit(`/`)
    cy.wait(500)
  })

  it('A reporting can be created', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings', FAKE_API_PUT_RESPONSE).as('createReporting')
    cy.wait(1000)

    // When
    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

    cy.getDataCy('reporting-target-type').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(250, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Observation').click()

    cy.fill('Thématique du signalement', 'Culture marine')
    cy.fill('Sous-thématique du signalement', ['Remise en état après occupation du DPM'])

    cy.fill('Saisi par', 'XYZ')
    cy.fill('Date et heure (UTC)', [2024, 5, 26, 23, 35])

    cy.clickButton('Valider le signalement')

    // Then
    cy.wait('@createReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        createdAt: '2024-05-26T23:35:00.000Z',
        openBy: 'XYZ',
        reportType: 'OBSERVATION',
        semaphoreId: 35,
        sourceType: 'SEMAPHORE',
        targetDetails: [],
        targetType: 'COMPANY',
        validityTime: 24
      })
    })
  })

  it('A reporting cannot be created without required values', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')

    // When
    cy.fill('Date et heure (UTC)', undefined)
    cy.clickButton('Valider le signalement')

    // Then
    cy.get('.Element-FieldError').should('have.length', 7)
  })

  it('A mission can be attached to a reporting', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')

    // When
    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

    cy.get('*[data-cy="reporting-target-type"]').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(350, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Infraction (susp.)').click()

    cy.fill('Thématique du signalement', 'Culture marine')
    cy.fill('Sous-thématique du signalement', ['Remise en état après occupation du DPM'])

    cy.fill('Saisi par', 'XYZ')

    cy.clickButton('Lier à une mission existante')
    cy.get('#root').click(582, 546, { timeout: 10000 })
    cy.clickButton('Lier à la mission')
    cy.clickButton('Valider le signalement')

    // Then
    cy.wait('@createReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }
      cy.get(interception.request.body.attachedToMissionAtUtc).should('not.be.null')
      cy.get(interception.request.body.detachedToMissionAtUtc).should('not.exist')
      assert.deepInclude(interception.request.body, {
        missionId: 33,
        openBy: 'XYZ',
        reportType: 'INFRACTION_SUSPICION',
        semaphoreId: 35,
        sourceType: 'SEMAPHORE',
        targetDetails: [],
        targetType: 'COMPANY',
        validityTime: 24
      })
    })
  })

  it('A mission can be detached from a reporting', () => {
    // Given
    cy.intercept('PUT', '/bff/v1/reportings/*').as('updateReporting')
    cy.wait(1000)
    cy.get('#root').click(350, 690, { timeout: 10000 })
    cy.wait(1000)
    cy.clickButton('Editer le signalement')

    // When
    cy.clickButton('Détacher la mission')
    cy.clickButton('Enregistrer et quitter')
    cy.wait(1000)

    // Then
    cy.wait('@updateReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }
      cy.get(interception.request.body.attachedToMissionAtUtc).should('not.be.null')
      cy.get(interception.request.body.detachedToMissionAtUtc).should('not.be.null')
      assert.deepInclude(interception.request.body, {
        missionId: 33,
        openBy: 'XYZ',
        reportType: 'INFRACTION_SUSPICION',
        semaphoreId: 35,
        sourceType: 'SEMAPHORE',
        targetDetails: [],
        targetType: 'COMPANY',
        validityTime: 24
      })
    })
  })

  it('An attached mission can be reinitialize during reporting creation', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
    cy.wait(1000)

    // When
    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

    cy.getDataCy('reporting-target-type').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(350, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Infraction').click()

    cy.fill('Thématique du signalement', 'Culture marine')
    cy.fill('Sous-thématique du signalement', ['Remise en état après occupation du DPM'])

    cy.fill('Saisi par', 'XYZ')
    cy.fill('Date et heure (UTC)', [2024, 5, 26, 23, 35])

    cy.clickButton('Lier à une mission existante')
    cy.get('#root').click(582, 546)
    cy.wait(1000)
    cy.clickButton('Réinitialiser')
    cy.wait(1000)

    cy.clickButton('Valider le signalement')

    // Then
    cy.wait('@createReporting').then(({ response }) => {
      expect(response && response.statusCode).equal(201)
      const responseBody = response && response.body
      expect(responseBody.missionId).equal(null)
      expect(responseBody.attachedMission).equal(null)
    })
  })

  it('A reporting can be created with withVHFAnswer only for `mouillage individuel` theme', () => {
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')

    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')

    cy.get('.Element-Legend').contains('Réponse à la VHF').should('not.exist')

    cy.fill('Source', 'Autre')
    cy.fill('Nom, société ...', 'Nom de ma société')

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(450, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')
    cy.fill('Type de signalement', 'Observation')
    cy.fill('Thématique du signalement', 'Mouillage individuel')
    cy.fill('Sous-thématique du signalement', ['Mouillage réglementé par AMP'])

    cy.get('.Element-Legend').contains('Réponse à la VHF').should('be.visible')
    cy.fill('Réponse à la VHF', 'Oui')

    cy.fill('Saisi par', 'XYZ')

    cy.clickButton('Valider le signalement')

    cy.wait('@createReporting').then(({ request, response }) => {
      expect(request.body.themeId).equal(100)
      expect(request.body.withVHFAnswer).equal(true)

      expect(response && response.statusCode).equal(201)
      expect(response?.body.themeId).equal(100)
      expect(response?.body.withVHFAnswer).equal(true)
    })

    // we update reporting theme and clean `withVHFAnswer` field
    cy.intercept('PUT', '/bff/v1/reportings/*').as('updateReporting')
    cy.get('#root').click(450, 690, { timeout: 10000 })

    cy.clickButton('Editer le signalement')
    cy.fill('Thématique du signalement', 'Bien culturel maritime')
    cy.fill('Sous-thématique du signalement', ["Prospection d'un bien culturel maritime"])
    cy.clickButton('Enregistrer et quitter')

    cy.wait('@updateReporting').then(({ request, response }) => {
      expect(request.body.themeId).equal(104)
      expect(request.body.withVHFAnswer).equal(undefined)

      expect(response && response.statusCode).equal(200)
      expect(response?.body.themeId).equal(104)
      expect(response?.body.withVHFAnswer).equal(null)
    })

    // delete reporting
    cy.intercept('PUT', '/bff/v1/reportings/*').as('updateReporting')
    cy.get('#root').click(450, 690, { timeout: 10000 })

    cy.clickButton('Editer le signalement')
    cy.clickButton('Supprimer le signalement')
    cy.clickButton('Confirmer la suppression')
  })
})
