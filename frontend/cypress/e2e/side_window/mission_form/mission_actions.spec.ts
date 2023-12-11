/// <reference types="cypress" />

context('Mission actions', () => {
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
    cy.get('*[data-cy="duplicate-infraction"]').click({ force: true })
    cy.get('*[data-cy="infraction-form-registrationNumber"]').should('have.value', 'BALTIK')
    cy.get('*[data-cy="infraction-form-validate"]').click({ force: true })
    cy.get('*[data-cy="duplicate-infraction"]').eq(1).should('be.disabled')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

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

  it('allow only one theme and may be multiple subthemes in control actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 1)
    cy.get('*[data-cy="envaction-theme-selector"]').contains('Police des mouillages')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Mouillage individuel')
    cy.get('*[data-cy="envaction-theme-element"]').contains('ZMEL')
    cy.get('*[data-cy="envaction-protected-species-selector"]').should('not.exist')
    // When
    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Police des espèces protégées').click()

    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Perturbation').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Atteinte aux habitats').click({ force: true })
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })

    cy.get('*[data-cy="envaction-protected-species-selector"]').should('exist')
    cy.get('*[data-cy="envaction-protected-species-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Habitat').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux').click({ force: true })
    cy.get('*[data-cy="envaction-protected-species-selector"]').click({ force: true })

    cy.get('*[data-cy="envaction-add-theme"]').should('not.exist')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      const { themes } = request.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      expect(themes.length).equal(1)
      expect(themes[0].theme).equal('Police des espèces protégées et de leurs habitats (faune et flore)')
      expect(themes[0].subThemes.length).equal(2)
      expect(themes[0].subThemes[0]).equal("Perturbation d'animaux")
      expect(themes[0].subThemes[1]).equal("Atteinte aux habitats d'espèces protégées")
      expect(themes[0].protectedSpecies.length).equal(2)
      expect(themes[0].protectedSpecies[0]).equal('HABITAT')
      expect(themes[0].protectedSpecies[1]).equal('BIRDS')
    })
  })

  it('save observations in control Actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('[id="envActions[1].observations"]').contains('RAS')

    // When
    cy.get('[id="envActions[1].observations"]').type('{backspace}{backspace}Une observation importante', {
      force: true
    })

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      const { observations } = request.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      expect(observations).equal('RUne observation importante')

      expect(response && response.statusCode).equal(200)
      expect(
        response && response.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')?.observations
      ).equal('RUne observation importante')
    })
  })

  it('allow multiple themes and may be multiple subthemes in surveillance actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 2)
    cy.get('*[data-cy="envaction-theme-selector"]')
      .eq(0)
      .contains('Police des espèces protégées et de leurs habitats (faune et flore)')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction, capture, arrachage')
    cy.get('*[data-cy="envaction-protected-species-selector"]').should('exist')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Flore')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux')

    // When
    cy.get('*[data-cy="envaction-theme-selector"]').eq(0).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(0).contains('Police des réserves naturelles').click()

    cy.get('*[data-cy="envaction-add-theme"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-selector"]').eq(2).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(2).contains('Rejets illicites').click()

    cy.get('*[data-cy="envaction-subtheme-selector"]').eq(2).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(2).contains('Jet de déchet').click({ force: true })

    cy.get('*[data-cy="envaction-protected-species-selector"]').should('have.length', 0)

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)

      const { themes } = response && response.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
      expect(themes.length).equal(3)
      expect(themes[0].theme).equal('Police des réserves naturelles')
      expect(themes[0].subThemes.length).equal(0)
      expect(themes[0].protectedSpecies.length).equal(0)
      expect(themes[1].theme).equal('Police des mouillages')
      expect(themes[1].subThemes.length).equal(2)
      expect(themes[1].subThemes[0]).equal('Mouillage individuel')
      expect(themes[1].subThemes[1]).equal('ZMEL')
      expect(themes[1].protectedSpecies.length).equal(0)
      expect(themes[2].theme).equal('Rejets illicites')
      expect(themes[2].subThemes.length).equal(1)
      expect(themes[2].subThemes[0]).equal('Jet de déchet')
      expect(themes[2].protectedSpecies.length).equal(0)
    })
  })

  it(`Should be able to delete action with linked reporting`, () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()
    // TODO
    cy.get('*[data-cy="actioncard-delete-button-b8007c8a-5135-4bc3-816f-c69c7b75d807"]').click()

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')
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
    cy.getDataCy('control-unit-contact').type('Contact 012345')
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')

    // Add a note
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une note libre')
    cy.get('[id="envActions[0].observations"]').type('Une observation importante', {
      force: true
    })

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')
    cy.clickButton('Enregistrer et quitter')
    cy.wait('@createMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.envActions[0].observations).equal('Une observation importante')
      const id = response && response.body.id

      // clean
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
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.get('[id="envActions[0].observations"]').type('Une observation importante', {
      force: true
    })

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')
    cy.clickButton('Enregistrer et quitter')
    cy.wait('@createMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.envActions[0].observations).equal('Une observation importante')

      const id = response && response.body.id

      // clean
      cy.getDataCy(`edit-mission-${id}`).click({ force: true })
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })
})
