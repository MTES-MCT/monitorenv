/// <reference types="cypress" />

context('Side Window > Mission Form > Mission dates', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
      }
    })
  })

  it('A mission should be created and closed with surveillances and valid dates', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    cy.get('form').submit()
    cy.wait(100)

    // When
    cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.clickOutside()
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(250)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait(500)
    cy.fill('Clôturé par', 'PCF').scrollIntoView()
    cy.wait(250)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.get('*[data-cy="envaction-theme-selector"]').click()
    cy.get('*[data-cy="envaction-theme-element"]').contains('Espèce protégée').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction').click({ force: true })
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })

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
    cy.clickButton('Ajouter une surveillance')

    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Mouillage individuel').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Autre').click({ force: true })
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })

    cy.getDataCy('action-card').eq(0).click()
    cy.getDataCy('surveillance-duration-matches-mission').should('not.have.class', 'rs-checkbox-checked')

    // Start date of surveillance is before start date of mission
    cy.fill('Date et heure de début de surveillance (UTC)', [2024, 5, 25, 23, 35])
    cy.clickButton('Clôturer')
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de début doit être postérieure à celle de début de mission')

    // Start date of surveillance is after end date of mission
    cy.fill('Date et heure de début de surveillance (UTC)', [2024, 5, 28, 15, 35])
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de début doit être antérieure à celle de fin de mission')

    // Valid start date of surveillance
    cy.fill('Date et heure de début de surveillance (UTC)', [2024, 5, 26, 23, 35])

    // End date of surveillance is before start date of mission
    cy.fill('Date et heure de fin de surveillance (UTC)', [2024, 5, 25, 23, 35])
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de fin doit être postérieure à celle de début de mission')

    // End date of surveillance is after end date of mission
    cy.fill('Date et heure de fin de surveillance (UTC)', [2024, 5, 28, 15, 35])
    cy.wait(250)
    cy.get('.Element-FieldError').contains('La date de fin doit être antérieure à celle de fin de mission')

    // Valid end date of surveillance
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateAndCloseMission')
    cy.fill('Date et heure de fin de surveillance (UTC)', [2024, 5, 28, 13, 35])

    // Then
    cy.wait('@updateAndCloseMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })

  it('A mission should be created with same surveillance and mission dates', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    // When
    cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.clickOutside()
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')
    cy.wait(200)
    cy.wait(200)

    cy.intercept('PUT', `/bff/v1/missions`).as('createMission')
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait('@createMission')

    cy.intercept('PUT', `/bff/v1/missions/*`).as('updateMission')

    // Add a second surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')

    cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              actionEndDateTimeUtc: '2024-05-28T14:15:00Z',
              actionStartDateTimeUtc: '2024-05-26T12:00:00Z'
            }
          ]
        }
      },
      5,
      response => {
        // Then
        const id = response.body.id

        // clean
        cy.getDataCy(`edit-mission-${id}`).click({ force: true })
        cy.getDataCy('action-card').eq(0).click()
        cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')
        cy.clickButton('Supprimer la mission')
        cy.clickButton('Confirmer la suppression')
      }
    )
      .its('response.statusCode')
      .should('eq', 200)
  })

  it('A mission should be created with valid dates for control action', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    // When
    cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.clickOutside()
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.get('[name="closedBy"]').scrollIntoView().type('PCF')
    cy.wait(250)

    // Add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')

    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Espèce protégée').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Détention').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft')
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })

    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.fill('Type de cible', 'Personne morale')

    // Date is before start date of mission
    cy.fill('Date et heure du contrôle (UTC)', [2024, 5, 25, 23, 35])

    cy.clickButton('Clôturer')
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date doit être postérieure à celle de début de mission')

    // Date is after end date of mission
    cy.fill('Date et heure du contrôle (UTC)', [2024, 5, 28, 14, 16])
    cy.wait(250)
    cy.get('.Element-FieldError').contains('La date doit être antérieure à celle de fin de mission')

    // Valid date
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateAndCloseMission')
    cy.fill('Date et heure du contrôle (UTC)', [2024, 5, 28, 13, 16])

    // Then
    cy.wait('@updateAndCloseMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })

  it('save other control actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-41"]').click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()

    cy.get('*[data-cy="add-control-administration"]').click()
    cy.get('.rs-picker-search-bar-input').type('DIRM{enter}')

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('*[data-key="10080"]').click()
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')

    // When
    cy.intercept('PUT', `/bff/v1/missions/41`).as('updateMission')
    cy.fill('Contrôle administratif', false)
    cy.fill('Respect du code de la navigation sur le plan d’eau', false)
    cy.fill('Gens de mer', false)
    cy.fill('Equipement de sécurité et respect des normes', false)

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              isAdministrativeControl: false,
              isComplianceWithWaterRegulationsControl: false,
              isSafetyEquipmentAndStandardsComplianceControl: false,
              isSeafarersControl: false
            }
          ]
        }
      },
      5,
      response => {
        const controlActionResponse = response?.body.envActions[0]
        expect(controlActionResponse.isAdministrativeControl).equal(false)
        expect(controlActionResponse.isComplianceWithWaterRegulationsControl).equal(false)
        expect(controlActionResponse.isSeafarersControl).equal(false)
        expect(controlActionResponse.isSafetyEquipmentAndStandardsComplianceControl).equal(false)

        cy.get('*[data-cy="edit-mission-41"]').click({ force: true })
        cy.get('*[data-cy="action-card"]').eq(0).click()
        cy.fill('Contrôle administratif', true)
        cy.fill('Respect du code de la navigation sur le plan d’eau', true)
        cy.fill('Gens de mer', true)
        cy.fill('Equipement de sécurité et respect des normes', true)
        cy.clickButton('Enregistrer')
      }
    )
      .its('response.statusCode')
      .should('eq', 200)
  })
})
