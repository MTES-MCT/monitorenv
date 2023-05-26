/// <reference types="cypress" />

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('An infraction Should be duplicated', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.get('*[data-cy="infraction-form"]').should('not.exist')

    // When
    cy.get('*[data-cy="duplicate-infraction"]').click({ force: true })
    cy.get('*[data-cy="infraction-form-registrationNumber"]').should('have.value', 'BALTIK')
    cy.get('*[data-cy="infraction-form-validate"]').click({ force: true })
    cy.get('*[data-cy="duplicate-infraction"]').eq(1).should('be.disabled')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('form').submit()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)
      const { infractions } = request.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
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
      expect(duplicatedInfraction.id).not.equal('c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
    })
  })

  it('allow only one theme and may be multiple subthemes in control actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click({ force: true })
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
    cy.get('form').submit()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      const { themes } = request.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
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
    cy.get('*[data-cy="edit-mission"]').eq(3).click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('[id="envActions[1].observations"]').contains('RAS')

    // When
    cy.get('[id="envActions[1].observations"]').type('{backspace}{backspace}Une observation importante')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('form').submit()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      const { observations } = request.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
      expect(observations).equal('Une observation importante')
    })
  })

  it('allow multiple themes and may be multiple subthemes in surveillance actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 1)
    cy.get('*[data-cy="envaction-theme-selector"]').contains(
      'Police des espèces protégées et de leurs habitats (faune et flore)'
    )
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction, capture, arrachage')
    cy.get('*[data-cy="envaction-protected-species-selector"]').should('exist')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Flore')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux')

    // When
    cy.get('*[data-cy="envaction-add-theme"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-selector"]').eq(1).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(1).contains('Police des mouillages').click()

    cy.get('*[data-cy="envaction-subtheme-selector"]').eq(1).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(1).contains('ZMEL').click()

    cy.get('*[data-cy="envaction-protected-species-selector"]').should('have.length', 1)

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('form').submit()

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)

      const { themes } = response && response.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      expect(themes.length).equal(2)
      expect(themes[0].theme).equal('Police des espèces protégées et de leurs habitats (faune et flore)')
      expect(themes[0].subThemes.length).equal(2)
      expect(themes[0].subThemes[0]).equal('Destruction, capture, arrachage')
      expect(themes[0].subThemes[1]).equal("Atteinte aux habitats d'espèces protégées")
      expect(themes[0].protectedSpecies.length).equal(2)
      expect(themes[0].protectedSpecies[0]).equal('FLORA')
      expect(themes[0].protectedSpecies[1]).equal('BIRDS')
      expect(themes[1].theme).equal('Police des mouillages')
      expect(themes[1].subThemes.length).equal(1)
      expect(themes[1].subThemes[0]).equal('ZMEL')
      expect(themes[1].protectedSpecies.length).equal(0)
    })
  })

  it('A mission should be created and closed with surveillances and valid dates', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    cy.get('form').submit()
    cy.wait(100)
    cy.get('*[data-cy="mission-errors"]').should('exist')

    // When
    cy.fill('Début de mission (UTC)', [2023, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2023, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.get('[name="closedBy"]').scrollIntoView().type('PCF')

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.get('*[data-cy="add-surveillance-action"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()

    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Police des espèces protégées').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Perturbation').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft')

    cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Jour"]')
      .invoke('val')
      .then(surveillanceStartDay => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Jour"]')
          .invoke('val')
          .should('eq', surveillanceStartDay)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Mois"]')
      .invoke('val')
      .then(surveillanceStartMonth => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Mois"]')
          .invoke('val')
          .should('eq', surveillanceStartMonth)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Année"]')
      .invoke('val')
      .then(surveillanceStartYear => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Année"]')
          .invoke('val')
          .should('eq', surveillanceStartYear)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Heure"]')
      .invoke('val')
      .then(surveillanceStartHour => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Heure"]')
          .invoke('val')
          .should('eq', surveillanceStartHour)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Minute"]')
      .invoke('val')
      .then(surveillanceStartMinute => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Minute"]')
          .invoke('val')
          .should('eq', surveillanceStartMinute)
      })

    // Add a second surveillance
    cy.clickButton('Ajouter')
    cy.getDataCy('add-surveillance-action').click({ force: true })

    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Police des mouillages').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('ZMEL').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft')

    cy.getDataCy('action-card').eq(0).click()
    cy.getDataCy('surveillance-duration-matches-mission').should('not.have.class', 'rs-checkbox-checked')

    // Start date of surveillance is before start date of mission
    cy.fill('Date et heure de début de surveillance (UTC)', [2023, 5, 25, 23, 35])
    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)
    cy.get('*[data-cy="surveillance-start-date-time"] > div > p').contains(
      'La date doit être postérieure à la date de début de mission'
    )

    // Start date of surveillance is after end date of mission
    cy.fill('Date et heure de début de surveillance (UTC)', [2023, 5, 28, 15, 35])
    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)
    cy.get('*[data-cy="surveillance-start-date-time"] > div > p').contains(
      'La date doit être antérieure à la date de fin de mission'
    )

    // Valid start date of surveillance
    cy.fill('Date et heure de début de surveillance (UTC)', [2023, 5, 26, 23, 35])

    // End date of surveillance is before start date of mission
    cy.fill('Date et heure de fin de surveillance (UTC)', [2023, 5, 25, 23, 35])
    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)
    cy.get('*[data-cy="surveillance-end-date-time"] > div > p').contains(
      'La date doit être postérieure à la date de début de mission'
    )

    // End date of surveillance is after end date of mission
    cy.fill('Date et heure de fin de surveillance (UTC)', [2023, 5, 28, 15, 35])
    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)
    cy.get('*[data-cy="surveillance-end-date-time"] > div > p').contains(
      'La date doit être antérieure à la date de fin de mission'
    )

    // Valid end date of surveillance
    cy.fill('Date et heure de fin de surveillance (UTC)', [2023, 5, 28, 13, 35])

    // Then
    cy.intercept('PUT', '/bff/v1/missions').as('createAndCloseMission')
    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)

    cy.wait('@createAndCloseMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })

  it('A mission should be created with valid dates for control action', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    // When
    cy.fill('Début de mission (UTC)', [2023, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2023, 5, 28, 14, 15])

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.get('[name="closedBy"]').scrollIntoView().type('PCF')

    // Add a control
    cy.clickButton('Ajouter')
    cy.get('*[data-cy="add-control-action"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()

    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Police des espèces protégées').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Perturbation').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft')

    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.fill('Type de cible', 'Société')

    // Date is before start date of mission
    cy.fill('Date et heure du contrôle (UTC)', [2023, 5, 25, 23, 35])

    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)
    cy.get('*[data-cy="control-date-time"] > div > p').contains(
      'La date doit être postérieure à la date de début de mission'
    )

    // Date is after end date of mission
    cy.fill('Date et heure du contrôle (UTC)', [2023, 5, 28, 14, 16])
    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)
    cy.get('*[data-cy="control-date-time"] > div > p').contains(
      'La date doit être antérieure à la date de fin de mission'
    )

    // Valid date
    cy.fill('Date et heure du contrôle (UTC)', [2023, 5, 28, 13, 16])

    // Then
    cy.intercept('PUT', '/bff/v1/missions').as('createAndCloseMission')
    cy.get('*[data-cy="close-mission"]').click()
    cy.wait(100)

    cy.wait('@createAndCloseMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })
})
