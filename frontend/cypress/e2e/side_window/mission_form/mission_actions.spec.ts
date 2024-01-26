/// <reference types="cypress" />

context('Side Window > Mission Form > Mission actions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`).wait(1000)
  })

  it('An infraction Should be duplicated', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.get('*[data-cy="infraction-form"]').should('not.exist')

    // When
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="duplicate-infraction"]').click({ force: true })
    cy.get('*[data-cy="infraction-form-registrationNumber"]').should('have.value', 'BALTIK')
    cy.get('*[data-cy="infraction-form-validate"]').click({ force: true })
    cy.get('*[data-cy="duplicate-infraction"]').eq(1).should('be.disabled')

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)
      const { infractions } = request.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      expect(infractions.length).equal(2)
      const duplicatedInfraction = infractions[1]

      expect(duplicatedInfraction.controlledPersonIdentity).equal('John Doe')
      expect(duplicatedInfraction.formalNotice).equal('PENDING')
      expect(duplicatedInfraction.infractionType).equal('WITH_REPORT')
      expect(duplicatedInfraction.natinf.length).equal(2)
      expect(duplicatedInfraction.observations).equal("Pas d'observations")
      expect(duplicatedInfraction.registrationNumber).equal('BALTIK')
      expect(duplicatedInfraction.relevantCourt).equal('LOCAL_COURT')
      expect(duplicatedInfraction.toProcess).equal(false)
      expect(duplicatedInfraction.vesselSize).equal('FROM_24_TO_46m')
      expect(duplicatedInfraction.vesselType).equal('COMMERCIAL')
      expect(duplicatedInfraction.id).not.equal('b8007c8a-5135-4bc3-816f-c69c7b75d807')
    })
  })

  it('allow only one theme and multiple subthemes in control actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 1)
    cy.get('*[data-cy="envaction-theme-selector"]').contains('Mouillage individuel') // id 100
    cy.get('*[data-cy="envaction-theme-element"]').contains('Mouillage avec AOT individuelle') // id 102
    cy.get('*[data-cy="envaction-tags-selector"]').should('not.exist')
    // When
    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Espèce protégée').click() // id 103

    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction, capture, arrachage').click({ force: true }) // id 117
    cy.get('*[data-cy="envaction-theme-element"]').contains('Détention des espèces protégées').click({ force: true }) // id 120
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })

    cy.get('*[data-cy="envaction-tags-selector"]').should('exist')
    cy.get('*[data-cy="envaction-tags-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Habitat').click({ force: true }) // id 15
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux').click({ force: true }) // id 11
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="envaction-tags-selector"]').click({ force: true })

    cy.get('*[data-cy="envaction-add-theme"]').should('not.exist')

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      const { controlPlans } = request.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')

      expect(controlPlans.length).equal(1)
      expect(controlPlans[0].themeId).equal(103)

      expect(controlPlans[0].subThemeIds.length).equal(2)
      expect(controlPlans[0].subThemeIds[0]).equal(117)
      expect(controlPlans[0].subThemeIds[1]).equal(120)
      expect(controlPlans[0].tagIds.length).equal(2)
      expect(controlPlans[0].tagIds[0]).equal(15)
      expect(controlPlans[0].tagIds[1]).equal(11)
    })
  })

  it('save observations in control Actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('[id="envActions[0].observations"]').contains('RAS')

    // When
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('[id="envActions[0].observations"]').type('{backspace}{backspace}Une observation importante.', {
      force: true
    })

    cy.wait(500)
    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      const { observations } = request.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      expect(observations).equal('RUne observation importante.')

      expect(response && response.statusCode).equal(200)
      expect(
        response && response.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')?.observations
      ).equal('RUne observation importante.')
    })
  })

  it('allow multiple themes and multiple subthemes in surveillance actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 2)
    cy.get('*[data-cy="envaction-theme-selector"]').eq(0).contains('Espèce protégée et leur habitat (faune et flore)') // id 103
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction, capture, arrachage') // id 117
    cy.get('*[data-cy="envaction-tags-selector"]').should('exist')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Habitat') // id 15
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux') // id 11

    // When
    cy.get('*[data-cy="envaction-theme-selector"]').eq(0).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(0).contains('Épave').click({ force: true }) // id 105

    cy.get('*[data-cy="envaction-add-theme"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-selector"]').eq(2).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(2).contains('Rejet').click({ force: true }) // id 102

    cy.get('*[data-cy="envaction-subtheme-selector"]').eq(2).click({ force: true })
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="envaction-theme-element"]').eq(2).contains("Rejet d'hydrocarbure").click({ force: true }) // id 74

    cy.get('*[data-cy="envaction-tags-selector"]').should('have.length', 0)

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)

      const { controlPlans } =
        response && response.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
      expect(controlPlans.length).equal(3)

      expect(controlPlans[0].themeId).equal(100)
      expect(controlPlans[0].subThemeIds.length).equal(2)
      expect(controlPlans[0].subThemeIds[0]).equal(100)
      expect(controlPlans[0].subThemeIds[1]).equal(102)
      expect(controlPlans[0].tagIds.length).equal(0)
      0
      expect(controlPlans[1].themeId).equal(105)
      expect(controlPlans[1].subThemeIds.length).equal(0)
      expect(controlPlans[1].tagIds.length).equal(0)

      expect(controlPlans[2].themeId).equal(102)
      expect(controlPlans[2].subThemeIds.length).equal(1)
      expect(controlPlans[2].subThemeIds[0]).equal(110)
      expect(controlPlans[2].tagIds.length).equal(0)
    })
  })

  it(`Should be able to delete action with linked reporting`, () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.wait(500)
    cy.get('*[data-cy="action-card"]').eq(0).click()

    cy.wait(500)
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="actioncard-delete-button-b8007c8a-5135-4bc3-816f-c69c7b75d807"]').click()

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)

      const { envActions } = response && response.body
      expect(envActions.length).equal(1)
    })
  })

  it(`Should create and save a note`, () => {
    // Given
    cy.wait(400)

    cy.clickButton('Ajouter une nouvelle mission')

    // When
    cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })

    cy.getDataCy('add-control-unit').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.clickOutside()
    cy.getDataCy('control-unit-contact').type('Contact 012345')
    cy.wait(250)
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait(250)

    // Add a note
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une note libre')
    cy.wait(500)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.get('[id="envActions[0].observations"]').type('Obs.', {
      force: true
    })

    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.envActions[0].observations).equal('Obs.')
      const id = response && response.body.id

      // clean
      cy.wait(250)
      cy.clickButton('Quitter')
      cy.getDataCy(`edit-mission-${id}`).click({ force: true })
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('save observations in surveillance Actions', () => {
    // Given
    cy.wait(400)

    cy.clickButton('Ajouter une nouvelle mission')

    // When
    cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.clickOutside()
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(250)
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait(250)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(500)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.get('[id="envActions[0].observations"]').type('Obs.', {
      force: true
    })

    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.envActions[0].observations).equal('Obs.')

      const id = response && response.body.id

      // clean
      cy.wait(250)
      cy.clickButton('Quitter')
      cy.getDataCy(`edit-mission-${id}`).click({ force: true })
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('Sould create surveillance and control actions with valid themes and subthemes depending on mission year', () => {
    // Given
    cy.wait(400)

    cy.clickButton('Ajouter une nouvelle mission')

    // When
    cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.clickOutside()
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(250)
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait(250)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.get('*[data-cy="envaction-theme-selector"]').eq(0).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(0).contains('Épave').click({ force: true }) // id 105
    cy.get('*[data-cy="envaction-subtheme-selector"]').eq(0).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]')
      .eq(0)
      .contains("Découverte d'une épave maritime")
      .click({ force: true }) // id 128
    cy.get('*[data-cy="envaction-theme-element"]').eq(0).contains('Autre (Épave)').click({ force: true }) // id 131

    // Add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')
    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Pêche de loisir (autre que PAP)').click({ force: true }) // id 112
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Pêche embarquée').click({ force: true }) // id 173

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const { envActions } = response && response.body
      expect(envActions.length).equal(2)

      // surveillance
      const surveillance = envActions[0]
      const surveillanceControlPlans = surveillance.controlPlans[0]
      expect(surveillanceControlPlans.themeId).equal(105)
      expect(surveillanceControlPlans.subThemeIds.length).equal(2)
      expect(surveillanceControlPlans.subThemeIds[0]).equal(128)
      expect(surveillanceControlPlans.subThemeIds[1]).equal(131)

      // control
      const control = envActions[1]
      const controlPlans = control.controlPlans[0]
      expect(controlPlans.themeId).equal(112)
      expect(controlPlans.subThemeIds.length).equal(1)
      expect(controlPlans.subThemeIds[0]).equal(173)

      const id = response && response.body.id
      // update mission date to 2023
      cy.fill('Début de mission (UTC)', [2023, 5, 26, 12, 0])
      cy.intercept('PUT', `/bff/v1/missions/${id}`).as('updateMissionTwo')
      cy.fill('Fin de mission (UTC)', [2023, 5, 28, 14, 15])

      cy.wait('@updateMissionTwo').then(({ response: newResponse }) => {
        const { envActions: updatedEnvActions } = newResponse && newResponse.body
        expect(updatedEnvActions.length).equal(2)

        // control
        const updatedControl = updatedEnvActions[0]
        expect(updatedControl.controlPlans.length).equal(0)

        // surveillance
        const updatedSurveillance = updatedEnvActions[1]
        expect(updatedSurveillance.controlPlans.length).equal(0)
      })
    })
  })
})
